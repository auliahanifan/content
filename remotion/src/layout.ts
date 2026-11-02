import type {Layout} from './types';

export type Box = {left: number; top: number; width: number; height: number};
export type Geo = {board: Box; captions: Box; char: {cx: number; base: number; h: number; flip: boolean}};

/**
 * Tata letak 1080x1920. UI Reels menutup y>1500 dan sisi kanan bawah; teks penting tidak ditaruh di sana.
 * left/right: papan atas, karakter di sisi bawah, caption di sisi lain. center: papan lebih pendek, caption di bawahnya.
 */
export const GEO: Record<Layout, Geo> = {
  left: {
    board: {left: 50, top: 230, width: 980, height: 800},
    captions: {left: 530, top: 1120, width: 480, height: 320},
    char: {cx: 270, base: 1880, h: 800, flip: false},
  },
  right: {
    board: {left: 50, top: 230, width: 980, height: 800},
    captions: {left: 70, top: 1120, width: 480, height: 320},
    char: {cx: 800, base: 1880, h: 800, flip: true},
  },
  center: {
    board: {left: 50, top: 230, width: 980, height: 640},
    captions: {left: 70, top: 890, width: 940, height: 210},
    char: {cx: 540, base: 1890, h: 740, flip: false},
  },
};

/** Saat interupsi epik: caption di bawah reaksi. */
export const EPIC_CAPTIONS: Box = {left: 70, top: 1330, width: 940, height: 170};
