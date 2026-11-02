import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const pixelAuliaFiles = {
  netral: 'characters/netral.png',
  menjelaskan: 'characters/menjelaskan.png',
  menunjuk: 'characters/menunjuk.png',
  berpikir: 'characters/berpikir.png',
  setuju: 'characters/setuju.png',
  menyapa: 'characters/menyapa.png',
  stop: 'characters/stop.png',
  laptop: 'characters/laptop.png',
  smartphone: 'characters/smartphone.png',
  presentasi: 'characters/presentasi.png',
  mencatat: 'characters/mencatat.png',
  ngopi: 'characters/ngopi.png',
  facepalm: 'characters/facepalm.png',
  murka: 'reactions/murka.png',
  fokus: 'reactions/fokus.png',
  kaget: 'reactions/kaget.png',
  'percaya-diri': 'reactions/percaya-diri.png',
  sedih: 'reactions/sedih.png',
  semangat: 'reactions/semangat.png',
  bingung: 'reactions/bingung.png',
  lelah: 'reactions/lelah.png',
  'dapat-ide': 'reactions/dapat-ide.png',
  tertawa: 'reactions/tertawa.png',
  skeptis: 'reactions/skeptis.png',
  menang: 'reactions/menang.png',
  panik: 'reactions/panik.png',
  malu: 'reactions/malu.png',
  'mode-jenius': 'reactions/mode-jenius.png',
  'deadline-samurai': 'reactions/deadline-samurai.png',
  'raja-multitasking': 'reactions/raja-multitasking.png',
  'ditelan-algoritma': 'reactions/ditelan-algoritma.png',
  'dompet-kritis': 'reactions/dompet-kritis.png',
  'mode-biksu': 'reactions/mode-biksu.png',
  'bangkit-lagi': 'reactions/bangkit-lagi.png',
  'otak-overload': 'reactions/otak-overload.png',
  'pawang-ai': 'reactions/pawang-ai.png',
  'eksekusi-meteor': 'reactions/eksekusi-meteor.png',
} as const;

export const pixelAuliaEffects = {
  'aura-emas': 'effects/aura-emas.png',
  'petir-biru': 'effects/petir-biru.png',
  'impact-ungu': 'effects/impact-ungu.png',
  'portal-hijau': 'effects/portal-hijau.png',
  'speedlines-merah': 'effects/speedlines-merah.png',
  'partikel-bintang': 'effects/partikel-bintang.png',
  'cincin-deadline': 'effects/cincin-deadline.png',
  'sayap-phoenix': 'effects/sayap-phoenix.png',
  'badai-notifikasi': 'effects/badai-notifikasi.png',
} as const;

export type PixelAuliaMood = keyof typeof pixelAuliaFiles;
export type PixelAuliaEffect = keyof typeof pixelAuliaEffects;
export type PixelAuliaProps = {
  mood?: PixelAuliaMood;
  size?: number;
  /** Relative to public/. Copy the pack into public/assets/pixel-aulia. */
  assetRoot?: string;
  animate?: boolean;
  /** Optional standalone VFX layer behind the character. */
  effect?: PixelAuliaEffect;
  effectScale?: number;
  effectOffsetX?: number;
  effectOffsetY?: number;
  style?: React.CSSProperties;
};

/** Mount inside a Sequence to restart the entrance animation on each reaction. */
export const PixelAulia: React.FC<PixelAuliaProps> = ({
  mood = 'netral', size = 720, assetRoot = 'assets/pixel-aulia', animate = true,
  effect, effectScale = 1.15, effectOffsetX = 0, effectOffsetY = 0, style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = animate ? spring({frame, fps, config: {damping: 16, stiffness: 180}}) : 1;
  const seconds = frame / fps;
  const energetic = ['murka', 'semangat', 'panik', 'deadline-samurai', 'ditelan-algoritma', 'otak-overload', 'eksekusi-meteor'].includes(mood);
  const shake = animate && energetic ? Math.round(Math.sin(seconds * 65) * 3) : 0;
  const hover = animate && ['percaya-diri', 'dapat-ide', 'mode-jenius', 'raja-multitasking', 'mode-biksu', 'bangkit-lagi', 'pawang-ai'].includes(mood)
    ? Math.round(Math.sin(seconds * Math.PI * 2) * 6) : 0;
  const y = Math.round((1 - entrance) * 36) + hover;
  const scale = 0.9 + entrance * 0.1;
  // Whole-image motion only: the illustration's internal limbs/VFX stay flattened.
  const meteor = mood === 'eksekusi-meteor';
  const suction = animate && mood === 'ditelan-algoritma';
  const entryX = meteor ? Math.round((1 - entrance) * -size * 0.55) : 0;
  const entryY = meteor ? Math.round((1 - entrance) * -size * 0.4) : 0;
  const wobble = suction ? Math.sin(seconds * 8) * 4 : 0;
  const strike = animate && mood === 'deadline-samurai' ? (1 - entrance) * -18 : 0;
  const suctionScale = suction ? 1 + Math.sin(seconds * 4) * 0.035 : 1;
  const root = assetRoot.replace(/^\/+|\/+$/g, '');
  const pulse = animate ? 1 + Math.sin(seconds * Math.PI * 4) * 0.025 : 1;
  const effectRotation = animate && effect === 'cincin-deadline' ? seconds * 12 : 0;
  return <div style={{width: size, height: size, position: 'relative', isolation: 'isolate', ...style}}>
    {effect && <Img
      src={staticFile(`${root}/${pixelAuliaEffects[effect]}`)}
      alt=""
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
        imageRendering: 'pixelated', opacity: Math.min(1, Math.max(0, entrance)),
        transform: `translate(${effectOffsetX}px, ${effectOffsetY}px) rotate(${effectRotation}deg) scale(${effectScale * pulse})`,
        pointerEvents: 'none'}}
    />}
    <Img
      src={staticFile(`${root}/${pixelAuliaFiles[mood]}`)}
      alt={`Aulia: ${mood}`}
      style={{position: 'relative', width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated',
        opacity: animate ? interpolate(frame, [0, Math.max(1, Math.round(fps * 0.15))], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1,
        transform: `translate(${shake + entryX}px, ${y + entryY}px) rotate(${strike + wobble}deg) scale(${scale * suctionScale})`, transformOrigin: '50% 90%'}}
    />
  </div>;
};
