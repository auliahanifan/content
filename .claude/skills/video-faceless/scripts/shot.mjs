// Screenshot bukti dari halaman sumber, kalimat disorot. Pakai (setelah `pnpm i` di folder ini, sekali):
//   node shot.mjs <url> <out.png> "<potongan teks yang disorot>" [lebar=1080] [teks-sorot-lain ...]
// Potongan teks harus ada persis di halaman (spasi dinormalisasi). Hasil: PNG DPR 2, dipotong di sekitar elemen.
import puppeteer from 'puppeteer-core';
import { existsSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const [url, out, snip, w = '1080', ...more] = process.argv.slice(2);
if (!url || !out || !snip) { console.error('pakai: node shot.mjs <url> <out.png> "<teks>" [lebar]'); process.exit(1); }
// Chrome: env CHROME, cache HyperFrames (Mac), atau Chromium Playwright di container cloud (sama dengan bukti.mjs)
const findChrome = () => {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME;
  const hf = join(homedir(), '.cache/hyperframes/chrome/chrome-headless-shell');
  if (existsSync(hf)) { const v = readdirSync(hf).sort().pop(); const s = readdirSync(join(hf, v))[0]; return join(hf, v, s, 'chrome-headless-shell'); }
  if (existsSync('/opt/pw-browsers')) {
    const d = readdirSync('/opt/pw-browsers').find((x) => x.startsWith('chromium_headless_shell-'));
    if (d) return `/opt/pw-browsers/${d}/chrome-headless-shell-linux64/chrome-headless-shell`;
  }
  throw new Error('Chrome tidak ditemukan; set env CHROME');
};
const exe = findChrome();

const b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: +w, height: 1400, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
const info = await p.evaluate((snips) => {
  const HL = 'background:#FFE7B3;outline:4px solid #FFB224;border-radius:6px;box-decoration-break:clone;padding:6px 10px';
  const norm = e => e.textContent.replace(/\s+/g, ' ');
  const deepest = s => {
    const all = [...document.querySelectorAll('p,li,td,div,span,section,h1,h2,h3')].filter(e => norm(e).includes(s));
    return all.filter(e => ![...e.children].some(c => norm(c).includes(s)))[0];
  };
  const els = snips.map(deepest);
  if (!els[0]) return { err: 'teks tidak ditemukan' };
  els.forEach(e => e && e.setAttribute('style', (e.getAttribute('style') || '') + ';' + HL));
  els[0].scrollIntoView({ block: 'center' });
  const r = els[0].getBoundingClientRect();
  return { y: Math.max(0, r.top + window.scrollY - 170), h: Math.min(r.height + 340, 900) };
}, [snip, ...more]);
if (info.err) { console.error(info.err); await b.close(); process.exit(2); }
await p.screenshot({ path: out, clip: { x: 0, y: info.y, width: +w, height: info.h } });
await b.close();
console.log('ok', out, JSON.stringify(info));
