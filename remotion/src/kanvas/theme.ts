import {continueRender, delayRender} from 'remotion';
import fraunces600 from '@fontsource/fraunces/files/fraunces-latin-600-normal.woff2';
import fraunces800 from '@fontsource/fraunces/files/fraunces-latin-800-normal.woff2';
import caveat700 from '@fontsource/caveat/files/caveat-latin-700-normal.woff2';
import type {Tone} from '../theme';

/**
 * Palet kanvas v3 "Paper Cutout": latar kertas kraft berserat, kartu krem dengan dua lembar kertas berwarna
 * di belakangnya, bayangan lembut (tanpa garis tebal dan bayangan keras), judul Fraunces, kata kunci warna aksen seri.
 * Navy kertas untuk teks, teal dan mustard sebagai warna kertas pendamping.
 */
export const K = {
  bg: '#E9DFCB',
  bg2: '#E1D3B8',
  card: '#FBF6EA',
  paper2: '#F1E6CF',
  ink: '#2F4A73',
  soft: '#5E6B85',
  faint: '#A99E88',
  line: 'rgba(47,74,115,0.16)',
  accent: '#E07A5F', // koral (Bukan Sulap); ditimpa per seri lewat seriesAccent
  teal: '#3E8C93',
  good: '#4F9D69',
  warn: '#E9A93B',
  bad: '#C8553D',
  sun: '#F2C14E',
  sky: '#3E8C93',
  lilac: '#8E7DBE',
  goodSoft: '#DCEBD9',
  badSoft: '#F6DCD3',
  accentSoft: '#F7DDD3',
  sunSoft: '#FBEBC2',
} as const;

/** Warna aksen per seri: gaya sama, aksen beda. */
const SERIES_ACCENT: Record<string, string> = {
  'bukan-sulap': '#E07A5F',
  'sing-murah-wae': '#E9A93B',
  'katanya-nyatanya': '#3E8C93',
  'garapan-weekend': '#7C5CE6',
  'nitip-mas': '#D9488B',
};
let accent: string = K.accent;
export const setSeries = (series?: string) => {
  accent = (series && SERIES_ACCENT[series]) || K.accent;
};
export const A = () => accent;

export const ktone = (t?: Tone): string => {
  switch (t) {
    case 'good':
      return K.good;
    case 'bad':
      return K.bad;
    case 'warn':
      return K.warn;
    case 'sun':
      return K.sun;
    case 'sky':
      return K.sky;
    case 'lilac':
      return K.lilac;
    case 'ink':
      return K.ink;
    default:
      return accent;
  }
};

export const softTone = (t?: Tone): string => {
  switch (t) {
    case 'good':
      return K.goodSoft;
    case 'bad':
      return K.badSoft;
    case 'warn':
    case 'sun':
      return K.sunSoft;
    default:
      return K.accentSoft;
  }
};

/** Tidak ada garis tebal lagi; konstanta dipertahankan supaya tata letak lama tetap terhitung. */
export const OUT = 0;
/** Bayangan kertas lembut untuk elemen kecil. */
export const SHADOW = '0 2px 0 rgba(0,0,0,0.05), 0 10px 16px -8px rgba(60,35,10,0.40)';
/** Kartu utama: lembar krem + dua lembar kertas (aksen, teal) bertumpuk di belakang + bayangan lembut. */
export const stackShadow = () =>
  `0 2px 0 rgba(0,0,0,0.05), 0 18px 26px -12px rgba(60,35,10,0.38), 14px 16px 0 -2px ${accent}, 26px 30px 0 -4px ${K.teal}, 32px 44px 34px -14px rgba(60,35,10,0.40)`;
export const cardSkin = {
  background: K.card,
  border: 'none',
  boxShadow: SHADOW,
  borderRadius: 26,
} as const;
export const bigCard = () => ({...cardSkin, boxShadow: stackShadow(), borderRadius: 28});

export const FONT_HEAD = '"Fraunces", Georgia, serif';
export const FONT_HAND = '"Caveat", "Comic Sans MS", cursive';

/** Serat kertas: noise SVG sebagai data URI (dipakai di latar dan kartu besar). */
const svg = (freq: string, oct: number) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
export const FIBRE = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg('.04 .5', 2))}")`;
export const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg('.9', 3))}")`;

let loaded = false;
export const loadPaperFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const h = delayRender('fraunces');
  Promise.all(
    [
      ['Fraunces', '600', fraunces600],
      ['Fraunces', '800', fraunces800],
      ['Caveat', '700', caveat700],
    ].map(([fam, w, url]) => {
      const f = new FontFace(fam, `url(${url}) format('woff2')`, {weight: w});
      document.fonts.add(f);
      return f.load();
    }),
  ).finally(() => continueRender(h));
};

/**
 * Geometri 1080x1920. Header y 44-214 (logo seri, chip topik, tanda tangan), headline y 236-560, panggung y 580-1450.
 * UI Reels menutup y>1500 dan kanan bawah: tidak ada teks di sana. Karakter Paper Cutout berproporsi realistis,
 * jadi lebih tinggi (800) dan panggung digeser agar tidak tertutup.
 */
export const KGEO = {
  header: {left: 30, top: 44, width: 1010, height: 170},
  headline: {left: 50, top: 236, width: 980, height: 330},
  char: {
    left: {cx: 215, base: 1470, h: 800},
    right: {cx: 865, base: 1470, h: 800},
    corner: {cx: 150, base: 1540, h: 520},
    none: {cx: -340, base: 1470, h: 800},
  },
  stage: {
    left: {left: 440, top: 590, width: 600, height: 860},
    right: {left: 40, top: 590, width: 600, height: 860},
    corner: {left: 40, top: 590, width: 1000, height: 860},
    none: {left: 40, top: 590, width: 1000, height: 860},
  },
} as const;
