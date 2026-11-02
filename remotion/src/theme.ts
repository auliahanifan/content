import {continueRender, delayRender} from 'remotion';
import bricolage800 from '@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2';
import bricolage700 from '@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2';
import jakarta600 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2';
import jakarta700 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2';
import jakarta800 from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2';

// Palet "kartun hangat": krem kertas, tinta navy (senada blazer Aulia), jeruk sebagai aksen utama.
export const C = {
  bg: '#FFF3E3', // krem kertas
  bgDeep: '#FBE3C4',
  paper: '#FFFFFF',
  ink: '#1B1F3B', // garis & teks utama
  inkSoft: '#5A5F7A', // teks sekunder (kontras AA di atas putih/krem)
  accent: '#FF6A3D', // jeruk: kata kunci, sorotan utama
  sun: '#FFC83D', // stabilo
  good: '#12A085', // benar / hemat
  bad: '#E2445C', // salah / bahaya / coretan
  warn: '#F59E0B', // peringatan / perlu izin
  sky: '#5BB8FF',
  lilac: '#A78BFA',
  night: '#1B1F3B', // latar penutup
} as const;

export type Tone = 'accent' | 'good' | 'bad' | 'warn' | 'sky' | 'lilac' | 'sun' | 'ink';
export const tone = (t?: Tone): string => (t ? C[t] : C.accent);

export const FONT_DISPLAY = '"Bricolage Grotesque", system-ui, sans-serif';
export const FONT_BODY = '"Plus Jakarta Sans", system-ui, sans-serif';

// garis kartun: outline tinta + bayangan keras, senada outline ilustrasi karakter
export const OUTLINE = 6;
export const sticker = (shadow = 12, bg: string = C.paper) => ({
  background: bg,
  border: `${OUTLINE}px solid ${C.ink}`,
  boxShadow: `${shadow}px ${shadow}px 0 ${C.ink}`,
});

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const faces: [string, string, string][] = [
    ['Bricolage Grotesque', bricolage800, '800'],
    ['Bricolage Grotesque', bricolage700, '700'],
    ['Plus Jakarta Sans', jakarta600, '600'],
    ['Plus Jakarta Sans', jakarta700, '700'],
    ['Plus Jakarta Sans', jakarta800, '800'],
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
