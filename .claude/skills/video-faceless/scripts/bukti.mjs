// Bukti scrapbook untuk elemen kanvas `evidence`: tangkapan layar POLOS (tanpa sorotan) dari judul halaman sampai
// kalimat bukti, plus posisi frasa yang akan distabilo dalam persen gambar (langsung tempel ke `mark.rects`).
// Pakai (setelah `pnpm i` di folder ini, sekali):
//   node bukti.mjs <url> <out.png> "<kalimat bukti>" "<frasa distabilo>" [lebar=440]
// Lebar 440 = tata letak HP, supaya teks besar saat ditempel di video. Teks harus ada persis di halaman.
import puppeteer from 'puppeteer-core';
import { existsSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const [url, out, sentence, phrase, w = '440'] = process.argv.slice(2);
if (!url || !out || !sentence || !phrase) { console.error('pakai: node bukti.mjs <url> <out.png> "<kalimat>" "<frasa>" [lebar]'); process.exit(1); }

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

const b = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: +w, height: 1600, deviceScaleFactor: 3 });
await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const info = await p.evaluate((sentence, phrase) => {
  const norm = (t) => t.replace(/\s+/g, ' ');
  const cands = [...document.querySelectorAll('p,li,td,div,span,blockquote,section')].filter((e) => norm(e.textContent).includes(sentence));
  const el = cands.filter((e) => ![...e.children].some((c) => norm(c.textContent).includes(sentence)))[0];
  if (!el) return { err: 'kalimat tidak ditemukan' };
  // rentang frasa, boleh melintasi beberapa node teks
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = []; let all = '';
  while (walker.nextNode()) { nodes.push([walker.currentNode, all.length]); all += walker.currentNode.textContent; }
  const i = all.indexOf(phrase);
  if (i < 0) return { err: 'frasa tidak ditemukan di kalimat' };
  const at = (k) => { for (let n = nodes.length - 1; n >= 0; n--) if (nodes[n][1] <= k) return [nodes[n][0], k - nodes[n][1]]; };
  const rg = document.createRange();
  rg.setStart(...at(i)); rg.setEnd(...at(i + phrase.length));
  const er = el.getBoundingClientRect();
  const h1 = document.querySelector('h1');
  const hr = h1 && h1.getBoundingClientRect();
  const top = hr && er.top - hr.top < 900 ? hr.top - 20 : er.top - 200;
  const bottom = er.bottom + 22;
  const H = bottom - top, W = window.innerWidth;
  const rects = [...rg.getClientRects()].map((q) => ({ x: +(q.left / W * 100).toFixed(2), y: +((q.top - top) / H * 100).toFixed(2), w: +(q.width / W * 100).toFixed(2), h: +(q.height / H * 100).toFixed(2) }));
  return { clip: { x: 0, y: top + window.scrollY, width: W, height: H }, rects };
}, sentence, phrase);
if (info.err) { console.error(info.err); await b.close(); process.exit(2); }
await p.screenshot({ path: out, clip: info.clip });
await b.close();
console.log(JSON.stringify({ out, rects: info.rects }));
