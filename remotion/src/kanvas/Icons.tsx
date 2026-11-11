import React from 'react';
import {A, K} from './theme';

/**
 * Ikon vektor gaya Bold Vector: garis navy 5px, isi palet kanvas, sudut membulat.
 * viewBox 96x96. Tambah ikon baru di objek ICONS (nama huruf kecil, tanda hubung).
 */
const S = {stroke: K.ink, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

const ICONS: Record<string, (c: string) => React.ReactNode> = {
  laptop: (c) => (
    <>
      <rect x="18" y="20" width="60" height="42" rx="6" fill={c} {...S} />
      <rect x="26" y="28" width="44" height="26" rx="3" fill={K.card} {...S} strokeWidth={3} />
      <path d="M8 70 H88 L82 78 H14 Z" fill={K.card} {...S} />
    </>
  ),
  phone: (c) => (
    <>
      <rect x="28" y="8" width="40" height="80" rx="9" fill={c} {...S} />
      <rect x="34" y="18" width="28" height="56" rx="3" fill={K.card} {...S} strokeWidth={3} />
      <circle cx="48" cy="81" r="2.5" fill={K.ink} />
    </>
  ),
  folder: (c) => (
    <>
      <path d="M10 26 a6 6 0 0 1 6-6 H38 l8 8 H80 a6 6 0 0 1 6 6 V72 a6 6 0 0 1-6 6 H16 a6 6 0 0 1-6-6 Z" fill={c} {...S} />
      <path d="M10 38 H86" {...S} fill="none" />
    </>
  ),
  file: (c) => (
    <>
      <path d="M24 10 H58 L74 26 V86 H24 Z" fill={K.card} {...S} />
      <path d="M58 10 V26 H74" fill={c} {...S} />
      <path d="M34 46 H64 M34 58 H64 M34 70 H54" {...S} fill="none" strokeWidth={4} />
    </>
  ),
  code: (c) => (
    <>
      <rect x="10" y="16" width="76" height="64" rx="8" fill={c} {...S} />
      <path d="M36 38 L26 48 L36 58 M60 38 L70 48 L60 58 M52 34 L44 62" {...S} stroke={K.card} fill="none" />
    </>
  ),
  film: (c) => (
    <>
      <rect x="10" y="20" width="76" height="56" rx="6" fill={c} {...S} />
      <path d="M10 32 H86 M10 64 H86" {...S} fill="none" />
      {[20, 36, 52, 68].map((x) => (
        <rect key={x} x={x} y="23" width="8" height="6" rx="1" fill={K.card} />
      ))}
      <path d="M42 40 L58 48 L42 56 Z" fill={K.card} {...S} strokeWidth={3} />
    </>
  ),
  book: (c) => (
    <>
      <path d="M48 24 C38 16 22 16 12 20 V78 C22 74 38 74 48 82 C58 74 74 74 84 78 V20 C74 16 58 16 48 24 Z" fill={c} {...S} />
      <path d="M48 24 V82" {...S} fill="none" />
    </>
  ),
  recipe: (c) => (
    <>
      <rect x="18" y="10" width="60" height="76" rx="6" fill={K.card} {...S} />
      <circle cx="34" cy="30" r="6" fill={c} {...S} strokeWidth={3} />
      <path d="M46 30 H66 M28 50 H68 M28 62 H68 M28 74 H54" {...S} fill="none" strokeWidth={4} />
    </>
  ),
  check: (c) => (
    <>
      <circle cx="48" cy="48" r="36" fill={c} {...S} />
      <path d="M30 49 L43 62 L67 36" {...S} stroke={K.card} strokeWidth={8} fill="none" />
    </>
  ),
  cross: (c) => (
    <>
      <circle cx="48" cy="48" r="36" fill={c} {...S} />
      <path d="M34 34 L62 62 M62 34 L34 62" {...S} stroke={K.card} strokeWidth={8} fill="none" />
    </>
  ),
  sparkle: (c) => <path d="M48 8 L56 40 L88 48 L56 56 L48 88 L40 56 L8 48 L40 40 Z" fill={c} {...S} />,
  chat: (c) => (
    <>
      <path d="M12 20 a8 8 0 0 1 8-8 H76 a8 8 0 0 1 8 8 V56 a8 8 0 0 1-8 8 H40 L24 80 V64 H20 a8 8 0 0 1-8-8 Z" fill={c} {...S} />
      <circle cx="34" cy="38" r="4" fill={K.card} />
      <circle cx="48" cy="38" r="4" fill={K.card} />
      <circle cx="62" cy="38" r="4" fill={K.card} />
    </>
  ),
  lock: (c) => (
    <>
      <path d="M30 42 V30 a18 18 0 0 1 36 0 V42" {...S} fill="none" />
      <rect x="20" y="42" width="56" height="42" rx="8" fill={c} {...S} />
      <circle cx="48" cy="62" r="5" fill={K.card} />
    </>
  ),
  money: (c) => (
    <>
      <rect x="8" y="26" width="80" height="46" rx="8" fill={c} {...S} />
      <circle cx="48" cy="49" r="11" fill={K.card} {...S} strokeWidth={3} />
    </>
  ),
  clock: (c) => (
    <>
      <circle cx="48" cy="48" r="36" fill={c} {...S} />
      <path d="M48 26 V48 L62 58" {...S} stroke={K.card} strokeWidth={6} fill="none" />
    </>
  ),
  play: (c) => (
    <>
      <circle cx="48" cy="48" r="36" fill={c} {...S} />
      <path d="M40 32 L64 48 L40 64 Z" fill={K.card} {...S} strokeWidth={3} />
    </>
  ),
  record: (c) => (
    <>
      <rect x="10" y="22" width="56" height="52" rx="8" fill={K.card} {...S} />
      <path d="M66 40 L86 28 V68 L66 56 Z" fill={K.card} {...S} />
      <circle cx="38" cy="48" r="11" fill={c} {...S} strokeWidth={3} />
    </>
  ),
  terminal: (c) => (
    <>
      <rect x="8" y="14" width="80" height="68" rx="8" fill={K.ink} {...S} />
      <path d="M8 28 H88" {...S} stroke={c} fill="none" />
      <path d="M22 44 L32 52 L22 60 M40 62 H58" {...S} stroke={c} fill="none" />
    </>
  ),
  gear: (c) => (
    <>
      <path
        d="M48 8 l6 10 l12-3 l2 12 l11 5 l-5 11 l8 9 l-10 7 l2 12 l-12 1 l-5 11 l-10-7 l-10 7 l-5-11 l-12-1 l2-12 l-10-7 l8-9 l-5-11 l11-5 l2-12 l12 3 Z"
        fill={c}
        {...S}
        strokeWidth={4}
      />
      <circle cx="48" cy="50" r="12" fill={K.card} {...S} strokeWidth={4} />
    </>
  ),
  user: (c) => (
    <>
      <circle cx="48" cy="32" r="16" fill={c} {...S} />
      <path d="M16 86 C16 64 32 56 48 56 C64 56 80 64 80 86 Z" fill={c} {...S} />
    </>
  ),
  team: (c) => (
    <>
      <circle cx="30" cy="36" r="11" fill={K.card} {...S} />
      <circle cx="66" cy="36" r="11" fill={K.card} {...S} />
      <path d="M8 80 C8 64 18 58 30 58 C42 58 52 64 52 80 Z" fill={K.card} {...S} />
      <path d="M44 80 C44 64 54 58 66 58 C78 58 88 64 88 80 Z" fill={K.card} {...S} />
      <circle cx="48" cy="30" r="13" fill={c} {...S} />
      <path d="M24 86 C24 66 36 56 48 56 C60 56 72 66 72 86 Z" fill={c} {...S} />
    </>
  ),
  building: (c) => (
    <>
      <rect x="22" y="12" width="52" height="74" rx="4" fill={c} {...S} />
      {[24, 40, 56].map((y) => (
        <React.Fragment key={y}>
          <rect x="32" y={y} width="10" height="9" rx="1" fill={K.card} />
          <rect x="54" y={y} width="10" height="9" rx="1" fill={K.card} />
        </React.Fragment>
      ))}
      <rect x="42" y="70" width="12" height="16" fill={K.card} {...S} strokeWidth={3} />
    </>
  ),
  gift: (c) => (
    <>
      <rect x="14" y="40" width="68" height="44" rx="4" fill={c} {...S} />
      <rect x="10" y="28" width="76" height="16" rx="4" fill={c} {...S} />
      <path d="M48 28 V84" {...S} stroke={K.card} strokeWidth={8} />
      <path d="M48 28 C40 12 24 16 30 28 M48 28 C56 12 72 16 66 28" {...S} fill="none" />
    </>
  ),
  warning: (c) => (
    <>
      <path d="M48 10 L88 80 H8 Z" fill={c} {...S} />
      <path d="M48 36 V56" {...S} strokeWidth={7} />
      <circle cx="48" cy="68" r="4" fill={K.ink} />
    </>
  ),
  download: (c) => (
    <>
      <path d="M48 12 V58 M30 42 L48 60 L66 42" {...S} strokeWidth={7} stroke={c} fill="none" />
      <path d="M14 66 V82 H82 V66" {...S} fill="none" />
    </>
  ),
  zap: (c) => <path d="M54 6 L18 54 H46 L40 90 L78 40 H50 Z" fill={c} {...S} />,
  node: (c) => (
    <>
      <path d="M48 8 L84 28 V68 L48 88 L12 68 V28 Z" fill={c} {...S} />
      <path d="M38 36 V60 M38 36 L58 60 V36" {...S} stroke={K.card} strokeWidth={5} fill="none" />
    </>
  ),
  chef: (c) => (
    <>
      <path d="M26 50 C12 50 10 30 24 28 C24 14 44 10 48 20 C52 10 72 14 72 28 C86 30 84 50 70 50 Z" fill={K.card} {...S} />
      <rect x="28" y="50" width="40" height="24" rx="4" fill={c} {...S} />
    </>
  ),
};

export const iconNames = Object.keys(ICONS);

export const VIcon: React.FC<{name: string; size: number; color?: string}> = ({name, size, color}) => {
  const draw = ICONS[name];
  if (!draw) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{display: 'block', overflow: 'visible'}}>
      {draw(color ?? A())}
    </svg>
  );
};
