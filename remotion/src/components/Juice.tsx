import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_PIXEL, tone} from '../theme';
import {useTiming} from '../timing';
import type {Fx, Loot, Pop, Sticker} from '../types';
import {Prop} from './Prop';

/**
 * "Juice" ala game: damage number, stiker emoji pixel, flash/burst, dan loot terbang ke karakter.
 * Posisi default memakai titik aman di tepi papan (tidak menutupi isi papan, caption, atau HUD).
 */
// pop default muncul di atas kepala karakter (di luar papan), bergeser kiri-kanan bergantian
const POP_OFFSETS = [0, -110, 110, -40];
const STICKER_SPOTS = [
  {x: 960, y: 1000},
  {x: 120, y: 1000},
  {x: 950, y: 300},
  {x: 130, y: 300},
  {x: 990, y: 650},
  {x: 90, y: 650},
];

/** Angka/teks melayang naik ala damage number RPG. */
export const Pops: React.FC<{pops: Pop[]; origin: {x: number; y: number}}> = ({pops, origin}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  return (
    <>
      {pops.map((p, i) => {
        const t0 = T(p.at);
        const d = frame - t0;
        const dur = Math.round((p.dur ?? 1.1) * fps);
        if (d < 0 || d > dur) return null;
        const spot = p.x !== undefined ? {x: p.x, y: p.y ?? 600} : {x: Math.min(940, Math.max(140, origin.x + POP_OFFSETS[i % POP_OFFSETS.length])), y: origin.y};
        const s = spring({frame: d, fps, config: {damping: 7, stiffness: 260, mass: 0.5}});
        const rise = interpolate(d, [0, dur], [0, -170]);
        const op = interpolate(d, [dur - 8, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const col = tone(p.tone ?? 'bad');
        const size = p.size ?? (p.text.length > 8 ? 76 : 96);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: spot.x,
              top: spot.y + Math.round(rise / 4) * 4,
              transform: `translate(-50%, -50%) scale(${s}) rotate(${i % 2 ? 6 : -6}deg)`,
              opacity: op,
              fontFamily: FONT_PIXEL,
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              color: col === C.sun ? C.sun : C.white,
              WebkitTextStroke: `12px ${C.ink}`,
              paintOrder: 'stroke fill',
              textShadow: `6px 6px 0 ${col}`,
              zIndex: 12,
            }}
          >
            {p.text}
          </div>
        );
      })}
    </>
  );
};

/** Stiker emoji pixel yang meletup, bergoyang kecil, lalu menyusut. */
export const Stickers: React.FC<{stickers: Sticker[]}> = ({stickers}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  return (
    <>
      {stickers.map((st, i) => {
        const t0 = T(st.at);
        const d = frame - t0;
        const dur = Math.round((st.dur ?? 1.4) * fps);
        if (d < 0 || d > dur) return null;
        const spot = st.x !== undefined ? {x: st.x, y: st.y ?? 600} : STICKER_SPOTS[i % STICKER_SPOTS.length];
        const s = spring({frame: d, fps, config: {damping: 8, stiffness: 240, mass: 0.5}});
        const out = interpolate(d, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const rot = (i % 2 ? 1 : -1) * (8 + Math.sin(d / 3) * 6);
        const size = st.size ?? 190;
        return (
          <div key={i} style={{position: 'absolute', left: spot.x - size / 2, top: spot.y - size / 2, transform: `scale(${s * out}) rotate(${rot}deg)`, zIndex: 11}}>
            <div style={{filter: `drop-shadow(5px 5px 0 ${C.ink})`}}>
              <Prop emoji={st.emoji} size={size} slot={false} />
            </div>
          </div>
        );
      })}
    </>
  );
};

/** Ledakan bintang pixel dari satu titik. */
const Burst: React.FC<{x: number; y: number; d: number; color: string; n?: number}> = ({x, y, d, color, n = 14}) => {
  if (d < 0 || d > 22) return null;
  return (
    <>
      {[...Array(n)].map((_, i) => {
        const a = (i / n) * Math.PI * 2 + random(`ba${i}`) * 0.4;
        const r = (1 - Math.exp(-d / 6)) * (140 + random(`br${i}`) * 120);
        const s = i % 3 === 0 ? 24 : 12;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.round((x + Math.cos(a) * r) / 6) * 6,
              top: Math.round((y + Math.sin(a) * r) / 6) * 6,
              width: s,
              height: s,
              background: i % 2 ? color : C.white,
              boxShadow: `0 0 0 4px ${C.ink}`,
              opacity: interpolate(d, [14, 22], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              zIndex: 12,
            }}
          />
        );
      })}
    </>
  );
};

/** Flash putih dan burst (shake, zoom, glitch ditangani kamera di Video.tsx). */
export const FxLayer: React.FC<{fx: Fx[]; origin: {x: number; y: number}}> = ({fx, origin}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  return (
    <>
      {fx.map((f, i) => {
        const d = frame - T(f.at);
        if (f.kind === 'flash' && d >= 0 && d < 6) {
          return <AbsoluteFill key={i} style={{background: C.white, opacity: interpolate(d, [0, 6], [0.85, 0]), zIndex: 30}} />;
        }
        if (f.kind === 'burst') return <Burst key={i} x={f.x ?? origin.x} y={f.y ?? origin.y} d={d} color={tone(f.tone ?? 'sun')} />;
        return null;
      })}
    </>
  );
};

/** Item terbang dari papan ke karakter (loot), lalu "+teks" di atas kepala. */
export const LootLayer: React.FC<{loot: Loot[]; target: {x: number; y: number}}> = ({loot, target}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  return (
    <>
      {loot.map((l, i) => {
        const d = frame - T(l.at);
        if (d < 0 || d > 44) return null;
        const x0 = l.x ?? 540;
        const y0 = l.y ?? 640;
        const p = Math.min(1, d / 16);
        const e = 1 - (1 - p) ** 2;
        const x = x0 + (target.x - x0) * e;
        const y = y0 + (target.y - y0) * e - Math.sin(p * Math.PI) * 260;
        const arrived = d >= 16;
        const sz = arrived ? interpolate(d, [16, 24], [130, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 130;
        const label = arrived && l.text;
        const lo = interpolate(d, [16, 22, 38, 44], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <React.Fragment key={i}>
            {sz > 2 && (
              <div style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, transform: `rotate(${d * 14}deg)`, zIndex: 13, filter: `drop-shadow(4px 4px 0 ${C.ink})`}}>
                <Prop emoji={l.emoji} size={sz} slot={false} />
              </div>
            )}
            <Burst x={target.x} y={target.y} d={d - 16} color={C.sun} n={10} />
            {label && (
              <div
                style={{
                  position: 'absolute',
                  left: target.x,
                  top: target.y - 120 - (d - 16) * 3,
                  transform: 'translateX(-50%)',
                  opacity: lo,
                  fontFamily: FONT_PIXEL,
                  fontWeight: 700,
                  fontSize: 64,
                  color: C.sun,
                  WebkitTextStroke: `10px ${C.ink}`,
                  paintOrder: 'stroke fill',
                  whiteSpace: 'nowrap',
                  zIndex: 13,
                }}
              >
                {l.text}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

/** Debu pixel di kaki saat karakter masuk / dash. */
export const Dust: React.FC<{x: number; y: number; d: number}> = ({x, y, d}) => {
  if (d < 0 || d > 18) return null;
  return (
    <>
      {[...Array(8)].map((_, i) => {
        const dir = i % 2 ? 1 : -1;
        const r = (1 - Math.exp(-d / 5)) * (60 + i * 18);
        const s = Math.max(6, Math.round((30 - d * 1.4) / 6) * 6);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.round((x + dir * r) / 6) * 6,
              top: Math.round((y - (i % 3) * 18 - d * 1.5) / 6) * 6,
              width: s,
              height: s,
              background: '#F1E3C2',
              boxShadow: `0 0 0 4px ${C.ink}`,
              opacity: interpolate(d, [10, 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}
          />
        );
      })}
    </>
  );
};
