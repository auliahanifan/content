import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/**
 * Latar dunia game. night=0: siang RPG (langit, awan pixel, bukit berundak, parallax).
 * night=1: malam arcade (bintang berkedip, grid lantai). Keduanya dibaurkan untuk transisi.
 */
export const Background: React.FC<{night: number; drift: number}> = ({night, drift}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(${C.daySkyTop}, ${C.daySkyBottom} 70%)`, opacity: 1 - night}}>
        {CLOUDS.map((c, i) => (
          <Cloud key={i} x={((c.x - frame * c.v - drift * c.v * 3) % 1500 + 1500) % 1500 - 250} y={c.y} s={c.s} />
        ))}
        <Hills color={C.hillFar} top={1360} step={40} amp={120} shift={-(frame * 0.4 + drift * 1.5)} seed={1} />
        <Hills color={C.hillNear} top={1520} step={40} amp={90} shift={-(frame * 0.9 + drift * 3)} seed={2} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1700, bottom: 0, background: '#2F7A3A'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(${C.nightTop}, ${C.nightBottom})`, opacity: night}}>
        {STARS.map((s, i) => {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / (6 + (i % 5)) + i));
          return <div key={i} style={{position: 'absolute', left: s.x, top: s.y, width: s.s, height: s.s, background: i % 7 === 0 ? C.sun : C.white, opacity: tw}} />;
        })}
        <Grid frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CLOUDS = [
  {x: 100, y: 180, s: 10, v: 0.5},
  {x: 700, y: 330, s: 8, v: 0.35},
  {x: 1250, y: 520, s: 12, v: 0.6},
  {x: 400, y: 760, s: 7, v: 0.3},
];

const STARS = new Array(70).fill(0).map((_, i) => ({
  x: Math.round(random(`sx${i}`) * 1080 / 6) * 6,
  y: Math.round(random(`sy${i}`) * 1300 / 6) * 6,
  s: random(`ss${i}`) > 0.8 ? 12 : 6,
}));

/** Awan pixel dari kotak-kotak. */
const Cloud: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
  const cells = [
    [2, 0, 4, 1], [1, 1, 7, 1], [0, 2, 10, 2], [1, 4, 8, 1],
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      {cells.map(([cx, cy, w, h], i) => (
        <div key={i} style={{position: 'absolute', left: cx * s * 2, top: cy * s * 2, width: w * s * 2, height: h * s * 2, background: C.white, opacity: 0.95}} />
      ))}
    </div>
  );
};

/** Bukit berundak (tinggi dikuantisasi per `step`). */
const Hills: React.FC<{color: string; top: number; step: number; amp: number; shift: number; seed: number}> = ({color, top, step, amp, shift, seed}) => {
  const cols = Math.ceil(1080 / step) + 2;
  const off = ((shift % step) + step) % step;
  const base = Math.floor(-shift / step);
  const pts: string[] = [];
  for (let i = 0; i < cols; i++) {
    const k = base + i;
    const h = Math.round(((Math.sin(k * 0.35 + seed) + Math.sin(k * 0.13 + seed * 3)) * 0.5 * amp) / 20) * 20;
    const x0 = i * step - step + off;
    pts.push(`${x0}px ${top - h}px`, `${x0 + step}px ${top - h}px`);
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color,
        clipPath: `polygon(-100px 1920px, ${pts.join(', ')}, 1200px 1920px)`,
      }}
    />
  );
};

const Grid: React.FC<{frame: number}> = ({frame}) => {
  const lines = [];
  const horizon = 1300;
  for (let i = 0; i < 12; i++) {
    const t = ((i + (frame % 30) / 30) / 12) ** 2;
    lines.push(<div key={`h${i}`} style={{position: 'absolute', left: 0, right: 0, top: horizon + t * 620, height: 4, background: C.lilac, opacity: 0.25 + t * 0.5}} />);
  }
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: horizon, bottom: 0, background: 'linear-gradient(rgba(139,92,246,0.25), rgba(255,92,57,0.15))'}} />
      {lines}
    </>
  );
};
