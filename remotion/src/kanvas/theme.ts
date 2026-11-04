import type {Tone} from '../theme';

/**
 * Palet kanvas = design system faceless Aulia: latar mist, kartu putih, kobalt untuk kata kunci,
 * mint = benar/hemat, amber = peringatan, koral = bahaya/coretan. Tinta senada blazer Pixel Aulia.
 */
export const K = {
  bg: '#EEF2F7',
  dot: '#C9D2E1',
  card: '#FFFFFF',
  ink: '#1B1F3B',
  soft: '#5B6380',
  faint: '#8F95A6',
  line: '#DDE3EE',
  accent: '#2F5BEA',
  good: '#12A06D',
  warn: '#D98A06',
  bad: '#E5484D',
  sun: '#F2B705',
  sky: '#2E9BEF',
  lilac: '#7C5CF0',
  goodSoft: '#E3F6EE',
  badSoft: '#FDE8E8',
  accentSoft: '#E5ECFD',
} as const;

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
      return K.accent;
  }
};

export const SHADOW = '0 14px 36px rgba(27,31,59,0.10), 0 2px 6px rgba(27,31,59,0.06)';

/**
 * Geometri 1080x1920. Header y 44-214 (logo seri, chip topik, tanda tangan), headline y 236-536, panggung y 560-1440.
 * UI Reels menutup y>1500 dan kanan bawah: tidak ada teks di sana.
 */
export const KGEO = {
  header: {left: 30, top: 44, width: 1010, height: 170},
  headline: {left: 50, top: 236, width: 980, height: 300},
  char: {
    left: {cx: 210, base: 1400, h: 600},
    right: {cx: 870, base: 1400, h: 600},
    corner: {cx: 128, base: 1530, h: 300},
    none: {cx: -300, base: 1400, h: 600},
  },
  stage: {
    left: {left: 380, top: 560, width: 670, height: 880},
    right: {left: 30, top: 560, width: 670, height: 880},
    corner: {left: 40, top: 560, width: 1000, height: 880},
    none: {left: 40, top: 560, width: 1000, height: 880},
  },
} as const;
