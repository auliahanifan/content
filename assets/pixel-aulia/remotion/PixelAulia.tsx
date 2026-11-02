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
} as const;

export const pixelAuliaEffects = {
  'aura-emas': 'effects/aura-emas.png',
  'petir-biru': 'effects/petir-biru.png',
  'impact-ungu': 'effects/impact-ungu.png',
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
  const energetic = mood === 'murka' || mood === 'semangat';
  const shake = animate && energetic ? Math.round(Math.sin(seconds * 65) * 3) : 0;
  const hover = animate && (mood === 'percaya-diri' || mood === 'dapat-ide')
    ? Math.round(Math.sin(seconds * Math.PI * 2) * 6) : 0;
  const y = Math.round((1 - entrance) * 36) + hover;
  const scale = 0.9 + entrance * 0.1;
  const root = assetRoot.replace(/^\/+|\/+$/g, '');
  const pulse = animate ? 1 + Math.sin(seconds * Math.PI * 4) * 0.025 : 1;
  return <div style={{width: size, height: size, position: 'relative', isolation: 'isolate', ...style}}>
    {effect && <Img
      src={staticFile(`${root}/${pixelAuliaEffects[effect]}`)}
      alt=""
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
        imageRendering: 'pixelated', opacity: Math.min(1, Math.max(0, entrance)),
        transform: `translate(${effectOffsetX}px, ${effectOffsetY}px) scale(${effectScale * pulse})`,
        pointerEvents: 'none'}}
    />}
    <Img
      src={staticFile(`${root}/${pixelAuliaFiles[mood]}`)}
      alt={`Aulia: ${mood}`}
      style={{position: 'relative', width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated',
        opacity: animate ? interpolate(frame, [0, Math.max(1, Math.round(fps * 0.15))], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1,
        transform: `translate(${shake}px, ${y}px) scale(${scale})`, transformOrigin: '50% 90%'}}
    />
  </div>;
};
