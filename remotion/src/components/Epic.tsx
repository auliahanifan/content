import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_PIXEL, tone} from '../theme';
import type {Epic as EpicT, PixelAsset} from '../types';
import {PixelFigure} from './Character';

/**
 * Level interupsi epik untuk latar & penyembunyian papan/presenter: masuk 4 frame, keluar berupa potongan
 * (tanpa crossfade agar tidak terlihat dua gambar bertumpuk).
 */
export const epicLevel = (frame: number, start: number, end: number) =>
  frame >= end ? 0 : interpolate(frame, [start - 1, start + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Reaksi anime besar di tengah: flash, garis kecepatan berputar, zoom-in, teks pixel raksasa. */
export const EpicLayer: React.FC<{e: EpicT; start: number; end: number; asset: PixelAsset}> = ({e, start, end, asset}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lvl = epicLevel(frame, start, end);
  if (lvl <= 0) return null;
  const col = tone(e.color ?? 'accent');
  const z = spring({frame: frame - start, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});
  const flash = interpolate(frame, [start, start + 5], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // keluar: 3 frame terakhir membesar + memutih, lalu potong
  const out = interpolate(frame, [end - 3, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const txt = spring({frame: frame - start - 4, fps, config: {damping: 8, stiffness: 220, mass: 0.5}});
  const [x0, y0, x1, y1] = asset.visibleAlphaBounds;
  // muat reaksi ke kotak 1000x1000 (aura ikut terhitung)
  const fit = Math.min(1000 / (x1 - x0), 1000 / (y1 - y0));
  return (
    <AbsoluteFill style={{opacity: lvl, transform: `scale(${1 + out * 0.12})`}}>
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 4}deg at 50% 46%, ${col}55 0deg 6deg, transparent 6deg 18deg)`,
          imageRendering: 'pixelated',
        }}
      />
      <div style={{position: 'absolute', left: 540, top: 1310, width: 0, height: 0, transform: `scale(${1.35 - 0.35 * z})`, transformOrigin: '0 -500px'}}>
        <PixelFigure asset={asset} h={(y1 - y0) * fit} />
      </div>
      {e.text && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 200,
            textAlign: 'center',
            fontFamily: FONT_PIXEL,
            fontWeight: 700,
            fontSize: e.text.length > 6 ? 150 : 190,
            lineHeight: 1,
            color: C.sun,
            WebkitTextStroke: `16px ${C.ink}`,
            paintOrder: 'stroke fill',
            textShadow: `10px 10px 0 ${col}`,
            transform: `scale(${Math.max(0, txt)}) rotate(-4deg)`,
            opacity: frame >= start + 4 ? 1 : 0,
          }}
        >
          {e.text}
        </div>
      )}
      <AbsoluteFill style={{background: C.white, opacity: Math.max(flash, out * 0.9)}} />
    </AbsoluteFill>
  );
};
