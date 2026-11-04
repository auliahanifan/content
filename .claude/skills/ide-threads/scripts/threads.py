#!/usr/bin/env python3
"""Pengambil data Threads Indonesia untuk /ide-threads (ScrapeCreators). Tiga langkah, satu file hasil:

  python3 -I threads.py cari  --kata gimana banget ...      [--jam 72] [--budget 40] [--out hasil.json]
  python3 -I threads.py akun  --akun putstywd nova_medialab  [--jam 72] [--budget 40] [--out hasil.json]
  python3 -I threads.py balas [--kode K1 K2 ...] [--top 15] [--budget 40] [--out hasil.json]

`cari` (radar umum): satu pencarian per kata Indonesia umum (1 kredit). Pencarian Threads mencocokkan frasa persis
dan mengembalikan ±15-20 post teratas, jadi kata AI ("ChatGPT") hampir selalu memberi post Inggris, sedangkan kata
umum ("gimana", "banget") memberi sampel Threads Indonesia yang sedang ramai.
`akun` (radar AI): post terbaru tiap akun (1 kredit/akun). Hot dinilai relatif terhadap median akun itu sendiri
(`rasio`), supaya akun besar tidak otomatis menang.
`balas`: balasan + post terkait untuk thread hot teratas (1 kredit/thread): pertanyaan di balasan dihitung, dan
akun Indonesia di "post terkait" (rekomendasi Threads) dikumpulkan sebagai usulan akun baru.
Hanya post berbahasa Indonesia yang bisa lolos hot. Kredit total dicatat di file; tiap langkah berhenti sebelum --budget.
Kunci: env SCRAPECREATORS_API_KEY. Memakai curl (CA bundle dan proxy sistem), bukan urllib.
"""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

API = 'https://api.scrapecreators.com'

ID_WORDS = set('yang dan di ke dari ini itu aja aku kamu gue gw lu lo nggak ngga gak ga enggak tidak bisa udah sudah lagi banget kak bang sih kok dong deh juga buat untuk pakai pake gimana bagaimana kenapa apa ada sama kalau kalo jadi mau masih cuma tapi karena biar soal orang kerja'.split())
EN_WORDS = set('the and is are to of for with you your my this that it in on not but just have has was what how why can will be do does they we our about when'.split())
Q_RE = re.compile(r'\?|\b(gimana|bagaimana|caranya|cara nya|kenapa|knp|salah(nya)? ?di ?mana|dimana|aman (ga|gak|nggak|tidak|enggak)|bisa (ga|gak|nggak|tidak)|apakah|how|why|what|which|can i|is it|does it)\b', re.I)


def get(path, params):
    key = os.environ.get('SCRAPECREATORS_API_KEY')
    if not key:
        sys.exit('SCRAPECREATORS_API_KEY kosong')
    url = f'{API}{path}?{urllib.parse.urlencode(params)}'
    for attempt in range(3):
        r = subprocess.run(['curl', '-s', '--max-time', '60', url, '-H', f'x-api-key: {key}'], capture_output=True, text=True)
        try:
            d = json.loads(r.stdout)
            return d
        except json.JSONDecodeError:
            time.sleep(2 * (attempt + 1))
    return {'success': False, 'message': 'respon tidak terbaca'}


def lang(text):
    t = text.lower()
    latin = sum(c.isascii() for c in t if c.isalpha())
    letters = sum(c.isalpha() for c in t)
    if letters and latin / letters < 0.8:
        return 'lain'
    words = re.findall(r'[a-z]+', t)
    i = sum(w in ID_WORDS for w in words)
    e = sum(w in EN_WORDS for w in words)
    if i == 0 and e == 0:
        return 'lain'
    return 'id' if i >= e else 'en'


def caption(p):
    c = p.get('caption')
    return (c.get('text') if isinstance(c, dict) else c) or ''


def post_row(p, kata, now):
    info = p.get('text_post_app_info') or {}
    like = p.get('like_count') or 0
    reply = info.get('direct_reply_count') or 0
    repost = info.get('repost_count') or 0
    quote = info.get('quote_count') or 0
    t = p.get('taken_at') or 0
    jam = max(1.0, (now - t) / 3600)
    eng = like + 3 * reply + 2 * (repost + quote)
    user = (p.get('user') or {}).get('username', '')
    code = p.get('code', '')
    text = caption(p)
    return {
        'kode': code,
        'url': p.get('url') or f'https://www.threads.com/@{user}/post/{code}',
        'akun': user,
        'terverifikasi': bool((p.get('user') or {}).get('is_verified')),
        'waktu': dt.datetime.fromtimestamp(t, dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC') if t else '',
        'jam': round(jam, 1),
        'like': like,
        'balasan': reply,
        'repost': repost + quote,
        'skor': round(eng / jam, 1),  # cepat ramai: keterlibatan per jam
        'debat': round(reply / max(like, 1), 2),  # rasio balasan/like
        'bahasa': lang(text),
        'kata': [kata],
        'teks': text,
    }


AI_RE = re.compile(r'(\bai\b|chatgpt|\bgpt|gemini|claude|prompt|copilot|meta ai|grok|deepseek|openai|notebooklm|vibe ?cod|cursor|\bn8n\b|ai agent|agent ai|otomatis|deepfake|chatbot)', re.I)


def hot(r):
    """Ambang minimum (bisa disetel). Hanya Indonesia. Radar AI juga wajib di atas 2x median akunnya."""
    if r['bahasa'] != 'id':
        return False
    if not (r['like'] >= 30 or r['balasan'] >= 10):
        return False
    if r.get('radar') == 'ai':
        return r.get('rasio', 0) >= 2
    return r['skor'] >= 3


def load(path):
    try:
        return json.load(open(path))
    except (FileNotFoundError, json.JSONDecodeError):
        return {'posts': [], 'kredit': 0, 'gagal': []}


def save(d, path):
    d['posts'].sort(key=lambda r: (-int(r['hot']), -r['skor']))
    json.dump(d, open(path, 'w'), ensure_ascii=False, indent=1)


def show(posts, n=40):
    print('kode | radar | skor/jam | rasio | like | bls | rpst | debat | jam | akun | teks')
    for r in [r for r in posts if r['hot']][:n]:
        print(f"{r['kode']} | {r.get('radar', '?')} | {r['skor']} | {r.get('rasio', '-')} | {r['like']} | {r['balasan']} | {r['repost']} | {r['debat']} | {r['jam']} | @{r['akun']} | {'AI ' if AI_RE.search(r['teks']) else ''}{r['teks'][:100].replace(chr(10), ' ')}")


def cmd_cari(a):
    now = time.time()
    start = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=a.jam)).strftime('%Y-%m-%d')
    end = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d')
    d = load(a.out)
    rows = {r['kode']: r for r in d['posts']}
    for i, k in enumerate(a.kata):
        if d['kredit'] + 1 > a.budget:
            print(f'! budget {a.budget} tercapai, kata sisa dilewati: {a.kata[i:]}')
            break
        x = get('/v1/threads/search', {'query': k, 'start_date': start, 'end_date': end})
        if not x.get('success'):
            d['gagal'].append(f"cari {k}: {x.get('message', 'gagal')}")
            continue
        d['kredit'] += x.get('credits_charged', 1)
        if not x.get('posts'):
            d['gagal'].append(f'cari {k}: 0 hasil (pencarian mencocokkan frasa persis; pakai satu kata umum)')
        for p in x.get('posts', []):
            if not p.get('taken_at') or now - p['taken_at'] > a.jam * 3600:
                continue
            r = post_row(p, k, now)
            r['radar'] = 'umum'
            if r['kode'] in rows:
                rows[r['kode']]['kata'].append(k)
            else:
                rows[r['kode']] = r
    d['posts'] = list(rows.values())
    for r in d['posts']:
        r['hot'] = hot(r)
    save(d, a.out)
    umum = [r for r in d['posts'] if r.get('radar') == 'umum']
    print(f"Radar umum: {len(umum)} post ≤{a.jam} jam ({sum(r['bahasa'] == 'id' for r in umum)} Indonesia), {sum(r['hot'] for r in umum)} hot, {sum(r['hot'] and bool(AI_RE.search(r['teks'])) for r in umum)} menyebut AI. Kredit run: {d['kredit']}.")
    for g in d['gagal']:
        print('!', g)
    show(umum)


def cmd_akun(a):
    now = time.time()
    d = load(a.out)
    rows = {r['kode']: r for r in d['posts']}
    d.setdefault('akun', {})
    for i, h in enumerate(a.akun):
        h = h.lstrip('@')
        if d['kredit'] + 1 > a.budget:
            print(f'! budget {a.budget} tercapai, akun sisa dilewati: {a.akun[i:]}')
            break
        x = get('/v1/threads/user/posts', {'handle': h})
        if not x.get('success'):
            d['gagal'].append(f"akun {h}: {x.get('message', 'gagal')}")
            continue
        d['kredit'] += x.get('credits_charged', 1)
        ps = x.get('posts', [])
        allrows = [post_row(p, f'@{h}', now) for p in ps if p.get('taken_at')]
        engs = sorted(r['like'] + 3 * r['balasan'] + 2 * r['repost'] for r in allrows)
        med = engs[len(engs) // 2] if engs else 0
        d['akun'][h] = {'post': len(allrows), 'median': med, 'terbaru': max((r['waktu'] for r in allrows), default=''),
                        'ai': sum(bool(AI_RE.search(r['teks'])) for r in allrows), 'id': sum(r['bahasa'] == 'id' for r in allrows)}
        for r in allrows:
            if r['jam'] > a.jam:
                continue
            r['radar'] = 'ai'
            r['rasio'] = round((r['like'] + 3 * r['balasan'] + 2 * r['repost']) / max(med, 1), 1)
            r['hot'] = hot(r)
            rows.setdefault(r['kode'], r)
    d['posts'] = list(rows.values())
    save(d, a.out)
    ai = [r for r in d['posts'] if r.get('radar') == 'ai']
    print(f"Radar AI: {len(d['akun'])} akun, {len(ai)} post ≤{a.jam} jam, {sum(r['hot'] for r in ai)} hot (≥2x median akunnya). Kredit run: {d['kredit']}.")
    sepi = [h for h, v in d['akun'].items() if v['post'] and v['terbaru'] < (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=30)).strftime('%Y-%m-%d')]
    if sepi:
        print('Akun tanpa post 30 hari (usul dimatikan):', ', '.join(sepi))
    show(ai)


def cmd_balas(a):
    d = load(a.out)
    kredit = d.get('kredit', 0)
    if a.kode:
        targets = [r for r in d['posts'] if r['kode'] in a.kode and 'balasan_teks' not in r]
    else:  # default: separuh dari tiap radar
        half = max(1, a.top // 2)
        hot_ = [r for r in d['posts'] if r.get('hot') and 'balasan_teks' not in r]
        targets = [r for r in hot_ if r.get('radar') == 'ai'][:half]
        targets += [r for r in hot_ if r.get('radar') != 'ai'][: a.top - len(targets)]
    rel = d.setdefault('akun_terkait', {})
    known = set(d.get('akun', {}))
    for r in targets:
        if kredit + 1 > a.budget:
            print(f'! budget {a.budget} tercapai, berhenti')
            break
        x = get('/v1/threads/post', {'url': r['url']})
        if not x.get('success'):
            r['balasan_teks'] = []
            r['balasan_gagal'] = x.get('message', 'gagal')
            continue
        kredit += x.get('credits_charged', 1)
        texts = [caption(c) for c in x.get('comments', []) if caption(c)]
        r['balasan_teks'] = texts
        r['pertanyaan'] = [t for t in texts if Q_RE.search(t)]
        for rp in x.get('relatedPosts', []) or []:
            q = rp.get('post', rp) if isinstance(rp, dict) else {}
            us = (q.get('user') or {}).get('username')
            c = caption(q)
            if us and us not in known and lang(c) == 'id' and AI_RE.search(c):
                rel.setdefault(us, {'n': 0, 'contoh': c[:100]})
                rel[us]['n'] += 1
    d['kredit'] = kredit
    save(d, a.out)
    print(f'Balasan diambil untuk {len(targets)} thread. Total kredit run: {kredit}.')
    for r in targets:
        q = r.get('pertanyaan', [])
        print(f"\n@{r['akun']} skor {r['skor']} · {len(r.get('balasan_teks', []))} balasan, {len(q)} pertanyaan · {r['url']}\n  {r['teks'][:140].replace(chr(10), ' ')}")
        for t in q[:5]:
            print('  ?', t[:140].replace('\n', ' '))
    if rel:
        print('\nUsulan akun baru (akun Indonesia soal AI di post terkait thread hot):')
        for us, v in sorted(rel.items(), key=lambda x: -x[1]['n']):
            print(f"  @{us} ({v['n']}x) {v['contoh'].replace(chr(10), ' ')}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    c = sub.add_parser('cari')
    c.add_argument('--kata', nargs='+', required=True)
    c.add_argument('--jam', type=int, default=72)
    c.add_argument('--budget', type=int, default=40)
    c.add_argument('--out', default='threads-hasil.json')
    k = sub.add_parser('akun')
    k.add_argument('--akun', nargs='+', required=True)
    k.add_argument('--jam', type=int, default=72)
    k.add_argument('--budget', type=int, default=40)
    k.add_argument('--out', default='threads-hasil.json')
    b = sub.add_parser('balas')
    b.add_argument('--top', type=int, default=15)
    b.add_argument('--kode', nargs='+', help='kode post terpilih (setelah saringan topik); default separuh tiap radar')
    b.add_argument('--budget', type=int, default=40)
    b.add_argument('--out', default='threads-hasil.json')
    a = ap.parse_args()
    {'cari': cmd_cari, 'akun': cmd_akun, 'balas': cmd_balas}[a.cmd](a)


if __name__ == '__main__':
    main()
