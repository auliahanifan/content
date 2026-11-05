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
/** Map latar procedural (src/world/Maps.tsx). */
export type MapName = 'padang' | 'toko' | 'kantor' | 'kota' | 'dungeon';
/** Latar bereaksi pada emosi kalimat. */
export type Mood = 'bahaya' | 'untung' | 'glitch' | 'fokus';
/** Kulit jendela papan. */
export type Skin = 'window' | 'quest' | 'arcade' | 'item' | 'none';

export type Pop = {at: number; text: string; tone?: Tone; x?: number; y?: number; dur?: number; size?: number};
export type Sticker = {at: number; emoji: string; x?: number; y?: number; dur?: number; size?: number};
export type Fx = {at: number; kind: 'shake' | 'flash' | 'glitch' | 'zoom' | 'burst'; x?: number; y?: number; tone?: Tone};
export type Loot = {at: number; emoji: string; text?: string; x?: number; y?: number};
export type BossHit = {at: number; dmg: number; text?: string};
export type Transition = 'pixel' | 'iris' | 'none';

/** Interupsi epik: layar flash, reaksi besar di tengah, shake, latar malam. */
export type Epic = {at: number; reaction: Reaction; dur?: number; text?: string; color?: Tone; sfx?: SfxName};

/** Bentuk manifest.json Pixel Aulia yang dipakai: ukuran & batas alpha terlihat. */
export type PixelAsset = {id: string; category: string; file: string; width: number; height: number; visibleAlphaBounds: [number, number, number, number]; root?: string; smooth?: boolean};

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

/** Jenis mock UI realistis untuk papan `ui` (layar yang dikenal penonton, bukan ikon abstrak). */
export type UiKind = 'form' | 'checkout' | 'notif' | 'chat' | 'receipt' | 'terminal' | 'email' | 'profile' | 'comments';

/** Satu baris di mock UI. Arti `label`/`text`/`value` per jenis: lihat references/storyboard.md. */
export type UiLine = PropRef & {
  at?: number;
  label?: string;
  text?: string;
  sub?: string;
  value?: string;
  tone?: Tone;
  side?: 'in' | 'out'; // chat: masuk (kiri) / keluar (kanan)
  strikeAt?: number;
  flag?: string; // chip jebakan merah, mis. "tanpa izin"
  flagAt?: number;
};

/** Stempel besar miring di atas papan, mis. "PER", "DENDA". */
export type Stamp = {at: number; text: string; tone?: Tone};

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
      type: 'ui';
      kind: UiKind;
      kicker?: string;
      title?: string;
      app?: string; // nama aplikasi/kontak/pengirim/nama profil
      meta?: string; // jam, subjek, judul form, handle, paket
      note?: string; // bio profil / catatan kecil di bawah
      at?: number; // kartu muncul (default awal adegan)
      items?: UiLine[];
      total?: UiLine; // checkout/receipt
      button?: string; // teks tombol, atau kata kunci yang diketik (comments)
      buttonAt?: number; // tombol ditekan / mulai mengetik
      stamp?: Stamp;
      zoom?: number; // skala kartu, default 1.1; turunkan (mis. 0.9) bila papan penuh atau layout center
    }
  | {type: 'word'; kicker?: string; text: string; sub?: string; subAt?: number; at?: number; tone?: Tone; stamp?: Stamp}
  | {type: 'boss'; kicker?: string; name: string; emoji: string; hp?: number; hits?: BossHit[]; defeatAt?: number; defeatText?: string; title?: string};

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
  map?: MapName; // latar dunia; default mewarisi adegan sebelumnya (awal: padang). Ganti map = kamera dash
  mood?: Mood; // latar bereaksi selama adegan ini
  skin?: Skin; // kulit papan; default window
  size?: 'full' | 'sm'; // sm = papan lebih kecil, dunia lebih terlihat
  enter?: 'dash' | 'beam'; // karakter masuk ulang di awal adegan
};

/** Indikator yang menempel di tengah atas sepanjang video, naik pada tiap step (mis. RISIKO Rp0 -> Rp1,2 M). */
export type Meter = {
  label: string;
  steps: {at: number; value: number}[];
  prefix?: string; // "Rp"
  suffix?: string;
  short?: boolean; // 1.200.000 -> 1,2 jt
  tone?: Tone; // default bad
  from?: number; // indeks kata mulai tampil (default 0)
  to?: number; // indeks kata berhenti tampil (default akhir)
};

/** Progress bar open-loop: janji di awal, hitung mundur detik sampai kata `until` (payoff). */
export type Loop = {text: string; until: number; from?: number; done?: string};

export type SfxName = 'blip' | 'coin' | 'power' | 'hit' | 'select' | 'sweep' | 'boom' | 'dash' | 'pickup' | 'damage' | 'glitch' | 'levelup' | 'pop';

/* ---------- Mode kanvas (default): satu latar, headline dua tingkat, satu panggung ---------- */

/** Ikon: PNG di folder video (`src`), props Pixel Aulia (`prop`), atau emoji yang di-pixel-kan. */
export type KIcon = PropRef & {src?: string; name?: string; color?: Tone}; // name = ikon vektor (src/kanvas/Icons.tsx)

type KBase = {
  at?: number; // muncul (indeks kata); default awal panel
  out?: number; // memudar habis (tetap memakan tempat)
  dimAt?: number; // meredup ke 30% agar fokus pindah
  w?: number; // lebar px (default otomatis)
};

export type KStep = {at: number; text: string};

export type KEl = KBase &
  (
    | {kind: 'card'; tag?: string; title?: string; text?: string; value?: string; tone?: Tone; icon?: KIcon; strikeAt?: number; swap?: {at: number; value: string; tone?: Tone}; stamp?: Stamp}
    | {kind: 'icon'; icon: KIcon; size?: number; label?: string; labelAt?: number; tone?: Tone}
    | {kind: 'chip'; text: string; tone?: Tone}
    | {kind: 'big'; text: string; sub?: string; subAt?: number; tone?: Tone}
    | {kind: 'flow'; items: (KIcon & {at?: number; label?: string; tone?: Tone})[]; op?: string; size?: number}
    | {kind: 'checklist'; title?: string; items: {at?: number; text: string; doneAt?: number; tone?: Tone; strikeAt?: number}[]}
    | ({kind: 'ui'; ui: UiKind} & Omit<Extract<Board, {type: 'ui'}>, 'type' | 'at' | 'kind'>)
    | {kind: 'shot'; src: string; source?: string; rings?: Ring[]}
    | {kind: 'phone'; src: string; from?: number; rate?: number; rings?: Ring[]; steps?: KStep[]}
    | {kind: 'stepper'; items: KStep[]}
    | {kind: 'row'; items: KEl[]; op?: string; gap?: number}
    | {kind: 'illus'; name: 'flipbook' | 'recipe-code' | 'render' | 'skill-folder' | 'tiers' | 'screenrec' | 'doors' | 'recipe-kitchen'; steps?: number[]; labels?: string[]}
    | {kind: 'evidence'; src: string; source?: string; mark?: {at: number; rects: {x: number; y: number; w: number; h: number}[]}; note?: {at: number; text: string; x?: number; y?: number}}
    | {kind: 'chatsim'; app?: string; items: {at: number; side: 'user' | 'ai'; text?: string; artifact?: string}[]}
  );

/** Posisi Pixel Aulia di kanvas. left/right: di samping panggung; corner: kecil di kiri bawah (tutorial); none: tanpa karakter. */
export type KChar = 'left' | 'right' | 'corner' | 'none';

export type KPanel = {
  at: number; // panel mulai (panel pertama selalu frame 0)
  char?: KChar; // default mewarisi panel sebelumnya (awal: left)
  pose?: Pose | Reaction;
  layout?: 'column' | 'row'; // susunan elemen; default column
  gap?: number;
  zoom?: number; // perkecil bila isi panggung terpotong
  topic?: string; // ganti chip topik di header mulai panel ini
  items: KEl[];
  sfx?: SfxName | null; // default 'sweep' pelan saat panel berganti
};

/**
 * Satu baris headline = potongan ucapan dari kata `from` sampai `to` (default sebelum baris berikutnya).
 * Kata `from`..`split-1` = baris pengantar kecil, `split`..`to` = frasa inti besar (muncul saat diucapkan).
 */
export type KLine = {from: number; to?: number; split?: number; key?: number[]; setup?: string; punch?: string};

export type Storyboard = {
  style?: 'kanvas' | 'game'; // default: kanvas bila ada `panels`, game bila ada `scenes`
  character?: 'paper' | 'bold' | 'pixel'; // kanvas: paket karakter, default paper (Paper Cutout Aulia)
  hook?: {until: number; items?: KEl[]}; // kanvas: hook teks raksasa sampai kata `until`, dengan benda kunci
  topic?: string; // chip header kanvas, mis. "Bukan Sulap · dasar agent"
  lines?: KLine[]; // kanvas: headline (pengganti caption kata per kata)
  panels?: KPanel[]; // kanvas: isi panggung
  poses?: {at: number; pose: Pose | Reaction}[]; // kanvas: ganti pose di tengah panel
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
  meter?: Meter;
  loop?: Loop;
  pops?: Pop[]; // damage number / angka melayang
  stickers?: Sticker[]; // emoji pixel meletup
  fx?: Fx[]; // shake, flash, glitch, zoom, burst
  loot?: Loot[]; // item terbang dari papan ke karakter
  moods?: {at: number; mood: Mood; dur?: number}[]; // latar bereaksi sesaat (detik, default 1.5)
  autoJuice?: boolean; // default true: debu, burst di punch, damage number dari meter
  scenes?: Scene[]; // mode game
  sfx?: {at: number; name: SfxName; volume?: number}[]; // SFX tambahan
  autoSfx?: boolean; // default true: sweep/blip/hit/select otomatis
};

export type VideoProps = {
  storyboard: Storyboard | null;
  words: Word[];
  availableProps: string[]; // nama props yang sudah ada di assets/props/
  pixel: PixelAsset[]; // manifest Pixel Aulia
  bold?: PixelAsset[]; // manifest paket karakter kanvas (default Paper Cutout Aulia)
};
