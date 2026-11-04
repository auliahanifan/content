#!/usr/bin/env node
// Cek kepadatan visual: daftar jeda tanpa kejadian di layar lebih dari batas (default 2 detik, kanvas 3).
// Kanvas: hanya kemajuan penjelasan yang dihitung, plus cek headline menutupi ucapan dan batas dekorasi.
// Pakai (dari remotion/): pnpm density <folder-video> [batas-detik]
import fs from 'node:fs';
import path from 'node:path';

const [dirArg, limArg] = process.argv.slice(2);
const repo = path.dirname(path.dirname(path.dirname(new URL(import.meta.url).pathname)));
const dir = [path.resolve(dirArg ?? '.'), path.resolve(repo, dirArg ?? '.')].find((d) => fs.existsSync(path.join(d, 'storyboard.json')));
if (!dir) {
  console.error('pakai: pnpm density <dates/YYYY-MM-DD/slug> [batas-detik]');
  process.exit(1);
}
const sb = JSON.parse(fs.readFileSync(path.join(dir, 'storyboard.json'), 'utf8'));
const lim = Number(limArg ?? ((sb.style ? sb.style === 'kanvas' : !!sb.panels) ? 3 : 2));
const words = JSON.parse(fs.readFileSync(path.join(dir, sb.words ?? 'tts/words.json'), 'utf8'));
const t = (i) => words[Math.max(0, Math.min(words.length - 1, i))][1];
const ev = []; // [detik, label]
const add = (i, label) => i !== undefined && i !== null && ev.push([t(i), label]);

const kanvas = sb.style ? sb.style === 'kanvas' : !!sb.panels;
const deco = []; // kejadian dekoratif (kanvas: dibatasi)
if (kanvas) {
  // kanvas: yang dihitung hanya kemajuan penjelasan (headline, panggung, pose)
  (sb.lines ?? []).forEach((l, k) => {
    add(l.from, `headline ${k}`);
    if (l.split !== undefined && l.split !== l.from) add(l.split, `inti ${k}`);
  });
  const walk = (els) =>
    els.forEach((e) => {
      add(e.at, e.kind);
      add(e.dimAt, 'redup');
      add(e.labelAt, 'label');
      add(e.subAt, 'sub');
      add(e.strikeAt, 'coret');
      if (e.swap) add(e.swap.at, 'ganti nilai');
      if (e.stamp) { add(e.stamp.at, 'stempel'); deco.push(`stempel ${e.stamp.text}`); }
      (e.rings ?? []).forEach((r) => add(r.at, 'cincin'));
      (e.steps ?? []).forEach((st) => add(st.at, 'langkah'));
      if (e.kind === 'stepper') e.items.forEach((st) => add(st.at, 'langkah'));
      else if (e.kind === 'row') walk(e.items);
      else (e.items ?? []).forEach((it) => { add(it.at, 'baris'); add(it.doneAt, 'centang'); add(it.strikeAt, 'coret'); add(it.flagAt, 'flag'); });
    });
  (sb.panels ?? []).forEach((p, k) => {
    add(p.at, `panel ${k}`);
    walk(p.items);
  });
  sb.poses?.forEach((p) => add(p.at, `pose ${p.pose}`));
  sb.epic?.forEach((e) => { add(e.at, `epik ${e.reaction}`); deco.push(`epik ${e.reaction}`); });
  for (const k of ['aura', 'stickers', 'pops', 'fx', 'loot', 'moods', 'meter', 'scenes']) if (sb[k]) console.warn(`! "${k}" tidak dipakai di mode kanvas (diabaikan).`);
}
(kanvas ? [] : sb.scenes ?? []).forEach((s, k) => {
  add(s.at, `adegan ${k}`);
  s.poses?.forEach((p) => add(p.at, `pose ${p.pose}`));
  if (s.footer) add(s.footer.at, 'dialog');
  const b = s.board;
  [...(b.items ?? []), ...(b.total ? [b.total] : []), ...(b.left ? [b.left] : []), ...(b.right ? [b.right] : [])].forEach((it) => {
    add(it.at, 'item');
    add(it.subAt, 'sub');
    add(it.strikeAt, 'coret');
    if (it.flag) add(it.flagAt ?? it.at, 'flag');
  });
  add(b.subAt, 'sub');
  add(b.opAt, 'op');
  add(b.buttonAt, 'tombol');
  add(b.at, 'papan');
  if (b.stamp) add(b.stamp.at, 'stempel');
  b.rings?.forEach((r) => add(r.at, 'cincin'));
  b.hits?.forEach((h) => add(h.at, 'pukul boss'));
  add(b.defeatAt, 'boss kalah');
});
if (!kanvas) sb.epic?.forEach((e) => add(e.at, `epik ${e.reaction}`));
if (!kanvas) sb.aura?.forEach((a) => add(a.at, `aura ${a.effect}`));
if (!kanvas) sb.punch?.forEach((i) => add(i, 'punch'));
if (!kanvas) sb.pops?.forEach((p) => add(p.at, `pop ${p.text}`));
if (!kanvas) sb.stickers?.forEach((p) => add(p.at, `stiker ${p.emoji}`));
if (!kanvas) sb.fx?.forEach((f) => add(f.at, f.kind));
if (!kanvas) sb.loot?.forEach((l) => add(l.at, `loot ${l.emoji}`));
if (!kanvas) sb.moods?.forEach((m) => add(m.at, `mood ${m.mood}`));
if (!kanvas) sb.meter?.steps.forEach((m) => add(m.at, 'meter'));
if (sb.loop) add(sb.loop.until, 'janji dibayar');
sb.sfx?.forEach((x) => add(x.at, `sfx ${x.name}`));

ev.sort((a, b) => a[0] - b[0]);
const end = words[words.length - 1][2];
const times = [0, ...ev.map((e) => e[0]), end];
const gaps = [];
for (let i = 1; i < times.length; i++) if (times[i] - times[i - 1] > lim) gaps.push([times[i - 1], times[i]]);
const ctx = (a, b) => words.filter((w) => w[1] >= a && w[1] < b).map((w) => w[0]).join(' ');
const idx = (sec) => { const i = words.findIndex((w) => w[1] >= sec); return i < 0 ? words.length : i; };
console.log(`${ev.length} kejadian dalam ${end.toFixed(1)} dtk (rata-rata tiap ${(end / Math.max(1, ev.length)).toFixed(2)} dtk). Batas jeda: ${lim} dtk.`);
if (!gaps.length) console.log('Tidak ada jeda kosong. ✓');
for (const [a, b] of gaps) console.log(`- ${a.toFixed(1)}-${b.toFixed(1)} dtk (${(b - a).toFixed(1)} dtk, kata ${idx(a)}-${idx(b) - 1}): "${ctx(a, b)}"`);
if (kanvas) {
  // headline harus menutupi ucapan: kata yang tidak masuk baris mana pun
  const lines = sb.lines ?? [];
  const cov = new Set();
  lines.forEach((l, k) => {
    const to = l.to ?? (lines[k + 1] ? lines[k + 1].from - 1 : words.length - 1);
    for (let i = l.from; i <= to; i++) cov.add(i);
  });
  const miss = words.map((_, i) => i).filter((i) => !cov.has(i));
  if (!lines.length) console.log('! Tidak ada `lines`: layar tanpa headline.');
  else if (miss.length) console.log(`! ${miss.length} kata tanpa headline: ${miss.slice(0, 20).join(', ')}${miss.length > 20 ? ' ...' : ''}`);
  const long = lines.filter((l, k) => {
    const to = l.to ?? (lines[k + 1] ? lines[k + 1].from - 1 : words.length - 1);
    return to - l.from + 1 > 14;
  });
  if (long.length) console.log(`! ${long.length} baris headline lebih dari 14 kata (pecah): from ${long.map((l) => l.from).join(', ')}`);
  console.log(`Dekoratif: ${deco.length} (${deco.join(', ') || '-'}). Batas kanvas: epik 1, stempel 2.`);
  const tooMuch = (sb.epic ?? []).length > 1 || deco.filter((d) => d.startsWith('stempel')).length > 2;
  if (tooMuch) console.log('! Dekorasi melebihi batas kanvas.');
  process.exit(gaps.length || miss.length || long.length || tooMuch ? 2 : 0);
}
process.exit(gaps.length ? 2 : 0);
