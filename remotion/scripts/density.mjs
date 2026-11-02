#!/usr/bin/env node
// Cek kepadatan visual: daftar jeda tanpa kejadian di layar lebih dari batas (default 2 detik).
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
const lim = Number(limArg ?? 2);
const sb = JSON.parse(fs.readFileSync(path.join(dir, 'storyboard.json'), 'utf8'));
const words = JSON.parse(fs.readFileSync(path.join(dir, sb.words ?? 'tts/words.json'), 'utf8'));
const t = (i) => words[Math.max(0, Math.min(words.length - 1, i))][1];
const ev = []; // [detik, label]
const add = (i, label) => i !== undefined && i !== null && ev.push([t(i), label]);

sb.scenes.forEach((s, k) => {
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
sb.epic?.forEach((e) => add(e.at, `epik ${e.reaction}`));
sb.aura?.forEach((a) => add(a.at, `aura ${a.effect}`));
sb.punch?.forEach((i) => add(i, 'punch'));
sb.pops?.forEach((p) => add(p.at, `pop ${p.text}`));
sb.stickers?.forEach((p) => add(p.at, `stiker ${p.emoji}`));
sb.fx?.forEach((f) => add(f.at, f.kind));
sb.loot?.forEach((l) => add(l.at, `loot ${l.emoji}`));
sb.moods?.forEach((m) => add(m.at, `mood ${m.mood}`));
sb.meter?.steps.forEach((m) => add(m.at, 'meter'));
if (sb.loop) add(sb.loop.until, 'loop selesai');
sb.sfx?.forEach((x) => add(x.at, `sfx ${x.name}`));

ev.sort((a, b) => a[0] - b[0]);
const end = words[words.length - 1][2];
const times = [0, ...ev.map((e) => e[0]), end];
const gaps = [];
for (let i = 1; i < times.length; i++) if (times[i] - times[i - 1] > lim) gaps.push([times[i - 1], times[i]]);
const ctx = (a, b) => words.filter((w) => w[1] >= a && w[1] < b).map((w) => w[0]).join(' ');
const idx = (sec) => words.findIndex((w) => w[1] >= sec);
console.log(`${ev.length} kejadian dalam ${end.toFixed(1)} dtk (rata-rata tiap ${(end / Math.max(1, ev.length)).toFixed(2)} dtk). Batas jeda: ${lim} dtk.`);
if (!gaps.length) console.log('Tidak ada jeda kosong. ✓');
for (const [a, b] of gaps) console.log(`- ${a.toFixed(1)}-${b.toFixed(1)} dtk (${(b - a).toFixed(1)} dtk, kata ${idx(a)}-${idx(b) - 1}): "${ctx(a, b)}"`);
process.exit(gaps.length ? 2 : 0);
