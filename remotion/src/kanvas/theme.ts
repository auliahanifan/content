import type {Tone} from '../theme';

/**
 * Palet kanvas v2 "terang, berani": tinta navy tebal (senada outline Bold Vector Aulia), kartu putih
 * bergaris navy dengan bayangan keras, kobalt untuk aksen, stabilo kuning untuk kata kunci,
 * mint = benar/hemat, amber = peringatan, koral = bahaya/coretan.
 */
export const K = {
  bg: '#F2F4FA',
  dot: '#CBD3E4',
  card: '#FFFFFF',
  ink: '#141B3D',
  soft: '#4A5478',
  faint: '#8A93AD',
  line: '#141B3D',
  accent: '#2F5BEA',
  good: '#0FA874',
  warn: '#F29D0B',
  bad: '#EF4351',
  sun: '#FFD84D',
  sky: '#38A6F5',
  lilac: '#7C5CF0',
  goodSoft: '#DDF6EC',
  badSoft: '#FDE3E5',
  accentSoft: '#E2E9FD',
  sunSoft: '#FFF3C4',
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

/** Bayangan keras ala stiker vektor + garis navy. */
export const OUT = 4;
export const SHADOW = `7px 8px 0 ${K.ink}`;
export const cardSkin = {
  background: K.card,
  border: `${OUT}px solid ${K.ink}`,
  boxShadow: SHADOW,
  borderRadius: 28,
} as const;

/**
 * Geometri 1080x1920. Header y 44-214 (logo seri, chip topik, tanda tangan), headline y 236-560, panggung y 580-1450.
 * UI Reels menutup y>1500 dan kanan bawah: tidak ada teks di sana.
 */
export const KGEO = {
  header: {left: 30, top: 44, width: 1010, height: 170},
  headline: {left: 50, top: 236, width: 980, height: 330},
  char: {
    left: {cx: 205, base: 1450, h: 640},
    right: {cx: 875, base: 1450, h: 640},
    corner: {cx: 140, base: 1520, h: 400},
    none: {cx: -320, base: 1450, h: 640},
  },
  stage: {
    left: {left: 380, top: 590, width: 670, height: 860},
    right: {left: 30, top: 590, width: 670, height: 860},
    corner: {left: 40, top: 590, width: 1000, height: 860},
    none: {left: 40, top: 590, width: 1000, height: 860},
  },
} as const;
