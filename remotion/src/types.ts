import type {Tone} from './theme';

/** Kata dari ElevenLabs alignment: [teks, mulai detik, selesai detik] */
export type Word = [string, number, number];

export type Pose = 'menjelaskan' | 'menunjuk' | 'berpikir' | 'bingung' | 'terkejut' | 'yakin';

/** Semua `at` adalah indeks kata di words.json (muncul tepat saat kata itu diucapkan). */
export type PropRef = {prop?: string; emoji?: string};

export type Item = PropRef & {
  at?: number;
  text?: string; // *kata* = sorot
  sub?: string;
  subAt?: number;
  label?: string;
  value?: number;
  prefix?: string;
  suffix?: string;
  tone?: Tone;
  strikeAt?: number;
};

export type Ring = {at: number; x: number; y: number; w: number; h: number; tone?: Tone}; // persen

export type Board =
  | {type: 'title'; kicker?: string; text: string; sub?: string; subAt?: number; items?: Item[]}
  | {type: 'props'; kicker?: string; title?: string; items: Item[]}
  | {type: 'list'; kicker?: string; title?: string; items: Item[]}
  | {type: 'stat'; kicker?: string; title?: string; note?: string; items: Item[]}
  | {type: 'counts'; kicker?: string; title?: string; items: Item[]}
  | {type: 'compare'; kicker?: string; title?: string; left: Item; right: Item; op?: string; opAt?: number}
  | {type: 'quote'; kicker?: string; text: string; source?: string; at?: number}
  | {type: 'shot'; kicker?: string; title?: string; src: string; source?: string; rings?: Ring[]};

export type Footer = PropRef & {at: number; text: string; tone?: Tone};

export type Scene = {
  at: number;
  pose?: Pose;
  poses?: {at: number; pose: Pose}[];
  board: Board;
  footer?: Footer;
  dark?: boolean; // penutup gelap
  sfx?: SfxName | null; // default 'swipe' di awal adegan
};

export type SfxName = 'pop' | 'swipe' | 'thud' | 'ding' | 'warn';

export type Storyboard = {
  series: string; // assets/<series>.svg dan <series>-white.svg
  audio?: string; // default tts/final.mp3
  words?: string; // default tts/words.json
  tail?: number; // detik setelah VO selesai, default 1.2
  keywords?: (number | string)[]; // indeks kata atau teks kata (tanpa tanda baca) yang disorot di caption
  captionMerge?: {from: number; to: number; text: string}[]; // gabung kata ucapan jadi satu ejaan, mis. G P T lima koma lima -> GPT-5.5
  captionFix?: Record<string, string>; // ganti ejaan satu kata: {"15": "Endor"}
  seriesLine?: {from: number; to: number}; // logo seri terbang ke tengah
  scenes: Scene[];
  sfx?: {at: number; name: SfxName; volume?: number}[]; // SFX tambahan
  autoSfx?: boolean; // default true: swipe/pop/thud/ding otomatis
};

export type VideoProps = {
  storyboard: Storyboard | null;
  words: Word[];
  availableProps: string[]; // nama props yang sudah ada di assets/props/
};
