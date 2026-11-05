import {continueRender, delayRender} from 'remotion';
import pixelify700 from '@fontsource/pixelify-sans/files/pixelify-sans-latin-700-normal.woff2';
import pixelify500 from '@fontsource/pixelify-sans/files/pixelify-sans-latin-500-normal.woff2';
import jakarta600 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2';
import jakarta700 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2';
import jakarta800 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2';
import bricolage700 from '@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2';
import bricolage800 from '@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2';

// Palet retro game: siang RPG (langit, bukit) + malam arcade (navy-ungu), UI jendela krem bergaris tinta.
export const C = {
  ink: '#1B1F3B', // garis & teks utama (senada blazer)
  inkSoft: '#4A4F70',
  paper: '#FFF8E7', // isi jendela dialog
  paperDeep: '#F1E3C2', // slot inventory
  frame: '#E8C978', // garis dalam jendela
  accent: '#FF5C39', // jeruk-merah: title bar, kata kunci
  sun: '#FFD23F', // kuning koin: stabilo, kata aktif
  good: '#3FBF5F',
  bad: '#E2445C',
  warn: '#F59E0B',
  sky: '#4FB3FF',
  lilac: '#8B5CF6',
  white: '#FFFFFF',
  // latar
  daySkyTop: '#5EC2FF',
  daySkyBottom: '#C9EEFF',
  hillFar: '#7FD08A',
  hillNear: '#3E9A4A',
  nightTop: '#0E1030',
  nightBottom: '#2B1B4F',
} as const;

export type Tone = 'accent' | 'good' | 'bad' | 'warn' | 'sky' | 'lilac' | 'sun' | 'ink';
export const tone = (t?: Tone): string => (t ? C[t] : C.accent);

export const FONT_PIXEL = '"Pixelify Sans", monospace';
export const FONT_BODY = '"Plus Jakarta Sans", system-ui, sans-serif';
export const FONT_HEAD = '"Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif';
// alias lama
export const FONT_DISPLAY = FONT_PIXEL;

/** Sudut berundak ala pixel art (potong sudut kotak per langkah `s` px). */
export const notch = (s = 12) =>
  `polygon(0 ${s * 2}px, ${s}px ${s * 2}px, ${s}px ${s}px, ${s * 2}px ${s}px, ${s * 2}px 0, calc(100% - ${s * 2}px) 0, calc(100% - ${s * 2}px) ${s}px, calc(100% - ${s}px) ${s}px, calc(100% - ${s}px) ${s * 2}px, 100% ${s * 2}px, 100% calc(100% - ${s * 2}px), calc(100% - ${s}px) calc(100% - ${s * 2}px), calc(100% - ${s}px) calc(100% - ${s}px), calc(100% - ${s * 2}px) calc(100% - ${s}px), calc(100% - ${s * 2}px) 100%, ${s * 2}px 100%, ${s * 2}px calc(100% - ${s}px), ${s}px calc(100% - ${s}px), ${s}px calc(100% - ${s * 2}px), 0 calc(100% - ${s * 2}px))`;

/** Kotak pixel: garis tinta tebal + garis dalam, tanpa blur. */
export const pixelBox = (bg: string = C.paper, inner: string = C.frame, w = 6) => ({
  background: bg,
  boxShadow: `inset 0 0 0 ${w}px ${C.ink}, inset 0 0 0 ${w * 2}px ${inner}`,
});

// kompatibilitas komponen lama
export const OUTLINE = 6;
export const sticker = (shadow = 8, bg: string = C.paper) => ({
  background: bg,
  border: `${OUTLINE}px solid ${C.ink}`,
  boxShadow: `${shadow}px ${shadow}px 0 ${C.ink}`,
});

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const faces: [string, string, string][] = [
    ['Pixelify Sans', pixelify700, '700'],
    ['Pixelify Sans', pixelify500, '500'],
    ['Plus Jakarta Sans', jakarta600, '600'],
    ['Plus Jakarta Sans', jakarta700, '700'],
    ['Plus Jakarta Sans', jakarta800, '800'],
    ['Bricolage Grotesque', bricolage700, '700'],
    ['Bricolage Grotesque', bricolage800, '800'],
  ];
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(([family, url, weight]) => {
      const f = new FontFace(family, `url(${url}) format('woff2')`, {weight});
      document.fonts.add(f);
      return f.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
