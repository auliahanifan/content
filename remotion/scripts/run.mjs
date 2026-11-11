#!/usr/bin/env node
// Pakai (dari folder remotion/):
//   pnpm studio <folder-video>                    buka Remotion Studio untuk video itu
//   pnpm render <folder-video> [--draft] [nama]   render ke <folder-video>/out/<nama|video>.mp4
//   pnpm still  <folder-video> <detik|f<frame>>... PNG per titik waktu ke <folder-video>/out/stills/
// <folder-video> = dates/<YYYY-MM-DD>/<slug> (relatif ke root repo atau absolut), berisi storyboard.json.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repo = path.dirname(here);
const [cmd, dirArg, ...rest] = process.argv.slice(2);
if (!cmd || !dirArg) {
  console.error('pakai: run.mjs <studio|render|still> <dates/YYYY-MM-DD/slug> [opsi]');
  process.exit(1);
}
const dir = [path.resolve(dirArg), path.resolve(repo, dirArg)].find((d) => fs.existsSync(path.join(d, 'storyboard.json')));
if (!dir) {
  console.error(`storyboard.json tidak ditemukan di ${dirArg}`);
  process.exit(1);
}

// file yang dirujuk storyboard (`src`: rekaman di rekam/, gambar bukti) harus ada; rekaman tidak ikut git
const missing = new Set();
const scan = (o) => {
  if (Array.isArray(o)) o.forEach(scan);
  else if (o && typeof o === 'object')
    for (const [k, v] of Object.entries(o)) {
      if (k === 'src' && typeof v === 'string' && !fs.existsSync(path.join(dir, v))) missing.add(v);
      else scan(v);
    }
};
scan(JSON.parse(fs.readFileSync(path.join(dir, 'storyboard.json'), 'utf8')));
if (missing.size) {
  console.error(`File yang dirujuk storyboard tidak ada di ${path.relative(repo, dir)}:\n- ${[...missing].join('\n- ')}\nRekaman layar (rekam/*.mp4, *.mov) di-gitignore: salin dulu ke folder itu.`);
  if (cmd !== 'studio') process.exit(1);
}

// public/video -> folder video aktif
const link = path.join(here, 'public', 'video');
fs.rmSync(link, {force: true, recursive: false});
fs.symlinkSync(dir, link, 'dir');
console.log(`video aktif: ${path.relative(repo, dir)}`);

// browser: REMOTION_BROWSER, atau Chromium Playwright di container cloud; selain itu Remotion mengunduh Chrome Headless Shell sendiri
const pw = fs.existsSync('/opt/pw-browsers')
  ? fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).map((d) => `/opt/pw-browsers/${d}/chrome-headless-shell-linux64/chrome-headless-shell`)
  : [];
const browser = [process.env.REMOTION_BROWSER, ...pw, '/opt/pw-browsers/chromium'].find((p) => p && fs.existsSync(p));
const browserArgs = browser ? [`--browser-executable=${browser}`] : [];

const bin = path.join(here, 'node_modules', '.bin', 'remotion');
const run = (args) => {
  const r = spawnSync(bin, args, {cwd: here, stdio: 'inherit'});
  process.exit(r.status ?? 1);
};

const outDir = path.join(dir, 'out');
if (cmd === 'studio') run(['studio', 'src/index.ts', ...browserArgs, ...rest]);
else if (cmd === 'render') {
  const draft = rest.includes('--draft');
  const name = rest.find((a) => !a.startsWith('--')) ?? (draft ? 'draft' : 'video');
  const quality = draft ? ['--scale=0.5', '--crf=28'] : ['--crf=16'];
  run(['render', 'src/index.ts', 'Video', path.join(outDir, `${name}.mp4`), ...quality, ...browserArgs, ...rest.filter((a) => a.startsWith('--') && a !== '--draft')]);
} else if (cmd === 'still') {
  const times = rest.length ? rest : ['0'];
  fs.mkdirSync(path.join(outDir, 'stills'), {recursive: true});
  let status = 0;
  for (const t of times) {
    const frame = t.startsWith('f') ? Number(t.slice(1)) : Math.round(parseFloat(t) * 30); // detik, atau f<frame>
    const out = path.join(outDir, 'stills', `f${String(frame).padStart(5, '0')}.png`);
    const r = spawnSync(bin, ['still', 'src/index.ts', 'Video', out, `--frame=${frame}`, '--scale=0.5', ...browserArgs], {cwd: here, stdio: 'inherit'});
    status ||= r.status ?? 1;
  }
  process.exit(status);
} else {
  console.error(`perintah tidak dikenal: ${cmd}`);
  process.exit(1);
}
