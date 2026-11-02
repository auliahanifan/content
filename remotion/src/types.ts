import type {Tone} from './theme';

/** Kata dari ElevenLabs alignment: [teks, mulai detik, selesai detik] */
export type Word = [string, number, number];

/** Pose presenter Pixel Aulia (assets/pixel-aulia/characters). */
export type Pose =
  | 'netral' | 'menjelaskan' | 'menunjuk' | 'berpikir' | 'setuju' | 'menyapa' | 'stop'
  | 'laptop' | 'smartphone' | 'presentasi' | 'mencatat' | 'ngopi' | 'facepalm';
/** Reaksi anime (assets/pixel-aulia/reactions), aura sudah menyatu. */
export type Reaction =
  | 'murka' | 'fokus' | 'kaget' | 'percaya-diri' | 'sedih' | 'semangat'
  | 'bingung' | 'lelah' | 'dapat-ide' | 'tertawa' | 'skeptis' | 'menang'
  | 'panik' | 'malu' | 'mode-jenius'
  // Anime Metafora (lihat assets/pixel-aulia/concepts-vol4.json)
  | 'deadline-samurai' | 'raja-multitasking' | 'ditelan-algoritma' | 'dompet-kritis' | 'mode-biksu'
  | 'bangkit-lagi' | 'otak-overload' | 'pawang-ai' | 'eksekusi-meteor';
export type Effect =
  | 'aura-emas' | 'petir-biru' | 'impact-ungu' | 'portal-hijau' | 'speedlines-merah'
  | 'partikel-bintang' | 'cincin-deadline' | 'sayap-phoenix' | 'badai-notifikasi';

/** Mini-epik: efek terpisah di belakang presenter, presenter tetap di tempat. */
export type Aura = {at: number; effect: Effect; dur?: number; scale?: number; sfx?: SfxName | null};
export type Layout = 'left' | 'right' | 'center';
export type Transition = 'pixel' | 'iris' | 'none';

/** Interupsi epik: layar flash, reaksi besar di tengah, shake, latar malam. */
export type Epic = {at: number; reaction: Reaction; dur?: number; text?: string; color?: Tone; sfx?: SfxName};

/** Bentuk manifest.json Pixel Aulia yang dipakai: ukuran & batas alpha terlihat. */
export type PixelAsset = {id: string; category: string; file: string; width: number; height: number; visibleAlphaBounds: [number, number, number, number]};

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
  | {type: 'shot'; kicker?: string; title?: string; src: string; source?: string; rings?: Ring[]}
  | {
      type: 'chat';
      kicker?: string;
      name: string; // nama pengirim di header chat
      emoji?: string; // avatar pengirim
      prop?: string;
      messages: {at?: number; text: string; me?: boolean; time?: string}[]; // me = gelembung kanan (kita)
      stamp?: {at: number; text: string; tone?: Tone}; // stempel miring yang menimpa
      note?: string; // catatan kecil di bawah (mis. dramatisasi)
    };

export type Footer = PropRef & {at: number; text: string; tone?: Tone};

export type Scene = {
  at: number;
  pose?: Pose | Reaction; // reaksi juga boleh sebagai pose kecil di tempat
  poses?: {at: number; pose: Pose | Reaction}[];
  board: Board;
  footer?: Footer;
  dark?: boolean; // latar malam arcade (penutup)
  layout?: Layout; // posisi karakter; default bergantian left/right
  transition?: Transition; // transisi masuk; default bergantian pixel/iris
  sfx?: SfxName | null; // default 'sweep' di awal adegan
};

export type SfxName = 'blip' | 'coin' | 'power' | 'hit' | 'select' | 'sweep' | 'boom';

export type Storyboard = {
  series: string; // assets/<series>.svg dan <series>-white.svg
  audio?: string; // default tts/final.mp3
  words?: string; // default tts/words.json
  tail?: number; // detik setelah VO selesai, default 1.2
  keywords?: (number | string)[]; // indeks kata atau teks kata (tanpa tanda baca) yang disorot di caption
  captionMerge?: {from: number; to: number; text: string}[]; // gabung kata ucapan jadi satu ejaan, mis. G P T lima koma lima -> GPT-5.5
  captionFix?: Record<string, string>; // ganti ejaan satu kata: {"15": "Endor"}
  seriesLine?: {from: number; to: number}; // logo seri terbang ke tengah
  epic?: Epic[]; // 2-4 per video, di punchline
  aura?: Aura[]; // mini-epik 3-5 per video
  punch?: number[]; // indeks kata: kamera punch-in
  scenes: Scene[];
  sfx?: {at: number; name: SfxName; volume?: number}[]; // SFX tambahan
  autoSfx?: boolean; // default true: sweep/blip/hit/select otomatis
};

export type VideoProps = {
  storyboard: Storyboard | null;
  words: Word[];
  availableProps: string[]; // nama props yang sudah ada di assets/props/
  pixel: PixelAsset[]; // manifest Pixel Aulia
};
