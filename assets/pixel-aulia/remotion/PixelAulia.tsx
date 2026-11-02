import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const pixelAuliaFiles = {
  netral: 'characters/netral.png',
  murka: 'reactions/murka.png',
  fokus: 'reactions/fokus.png',
  kaget: 'reactions/kaget.png',
  'percaya-diri': 'reactions/percaya-diri.png',
  sedih: 'reactions/sedih.png',
  semangat: 'reactions/semangat.png',
  bingung: 'reactions/bingung.png',
  lelah: 'reactions/lelah.png',
  'dapat-ide': 'reactions/dapat-ide.png',
} as const;

export type PixelAuliaMood = keyof typeof pixelAuliaFiles;
export type PixelAuliaProps = {
  mood?: PixelAuliaMood;
  size?: number;
  /** Relative to public/. Copy the pack into public/assets/pixel-aulia. */
  assetRoot?: string;
  animate?: boolean;
  style?: React.CSSProperties;
};

/** Mount inside a Sequence to restart the entrance animation on each reaction. */
export const PixelAulia: React.FC<PixelAuliaProps> = ({
  mood = 'netral', size = 720, assetRoot = 'assets/pixel-aulia', animate = true, style,
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
  return <div style={{width: size, height: size, ...style}}>
    <Img
      src={staticFile(`${root}/${pixelAuliaFiles[mood]}`)}
      alt={`Aulia: ${mood}`}
      style={{width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated',
        opacity: animate ? interpolate(frame, [0, Math.max(1, Math.round(fps * 0.15))], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1,
        transform: `translate(${shake}px, ${y}px) scale(${scale})`, transformOrigin: '50% 90%'}}
    />
  </div>;
};
