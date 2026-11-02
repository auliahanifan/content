import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/** Kertas krem dengan grid titik yang bergeser pelan dan dua gumpalan warna. `dark` 0..1 = penutup. */
export const Background: React.FC<{dark: number; hue: string}> = ({dark, hue}) => {
  const frame = useCurrentFrame();
  const shift = frame * 0.6;
  const dot = dark > 0.5 ? 'rgba(255,255,255,0.10)' : 'rgba(27,31,59,0.10)';
  return (
    <AbsoluteFill style={{background: mix(C.bg, C.night, dark)}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dot} 3px, transparent 3.5px)`,
          backgroundSize: '44px 44px',
          backgroundPosition: `${shift}px ${shift * 0.5}px`,
        }}
      />
      <Blob x={860 + Math.sin(frame / 50) * 30} y={300 + Math.cos(frame / 60) * 24} r={340} color={hue} opacity={0.22 * (1 - dark) + 0.12 * dark} />
      <Blob x={120 + Math.cos(frame / 70) * 26} y={1180 + Math.sin(frame / 55) * 30} r={420} color={C.sun} opacity={0.2 * (1 - dark)} />
    </AbsoluteFill>
  );
};

const Blob: React.FC<{x: number; y: number; r: number; color: string; opacity: number}> = ({x, y, r, color, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: color,
      opacity,
      filter: 'blur(40px)',
    }}
  />
);

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  const c = A.map((v, i) => Math.round(interpolate(t, [0, 1], [v, B[i]])));
  return `rgb(${c.join(',')})`;
};
