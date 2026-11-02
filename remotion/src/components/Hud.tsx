import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_BODY, FONT_PIXEL, pixelBox, tone} from '../theme';
import {useTiming} from '../timing';
import type {Loop, Meter} from '../types';

/**
 * HUD di tengah atas, di antara logo seri (kiri) dan tanda tangan (kanan):
 * - meter: indikator taruhan yang naik pada tiap step ("RISIKO Rp0" -> "Rp1,2 M")
 * - loop: progress bar janji ("Prompt-nya di akhir · 12 dtk") yang menghitung mundur ke payoff
 */
export const HUD_BOX = {left: 432, top: 78, width: 344};

export const fmt = (v: number, short?: boolean) => {
  const id = (n: number, d = 0) => n.toLocaleString('id-ID', {maximumFractionDigits: d});
  if (!short) return id(Math.round(v));
  const units: [number, string][] = [
    [1e12, ' T'],
    [1e9, ' M'],
    [1e6, ' jt'],
    [1e3, ' rb'],
  ];
  for (const [u, s] of units) if (Math.abs(v) >= u) return id(v / u, v / u < 10 ? 1 : 0) + s;
  return id(Math.round(v));
};

const MeterPill: React.FC<{m: Meter; dim: number}> = ({m, dim}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T, E} = useTiming();
  const from = T(m.from ?? 0);
  const to = m.to === undefined ? Infinity : E(m.to) + 10;
  if (frame < from || frame > to + 8) return null;
  const steps = [...m.steps].sort((a, b) => a.at - b.at);
  let idx = -1;
  steps.forEach((st, i) => frame >= T(st.at) && (idx = i));
  const prev = idx > 0 ? steps[idx - 1].value : 0;
  const target = idx >= 0 ? steps[idx].value : 0;
  const t0 = idx >= 0 ? T(steps[idx].at) : from;
  const s = idx >= 0 ? spring({frame: frame - t0, fps, config: {damping: 30, stiffness: 90}}) : 1;
  const v = prev + (target - prev) * Math.min(1, s);
  const bump = idx >= 0 ? Math.max(0, 1 - (frame - t0) / 10) : 0;
  const col = tone(m.tone ?? 'bad');
  const appear = spring({frame: frame - from, fps, config: {damping: 14}});
  const out = interpolate(frame, [to, to + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        ...pixelBox(C.ink, col, 5),
        opacity: Math.min(1, appear * 2) * out * (1 - dim * 0.85),
        transform: `scale(${(0.8 + 0.2 * appear) * (1 + bump * 0.12)})`,
        height: 92,
        padding: '0 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span style={{fontFamily: FONT_PIXEL, fontWeight: 700, fontSize: 28, color: C.paper, letterSpacing: 1, borderBottom: `5px solid ${col}`}}>{m.label}</span>
      <span
        style={{
          flex: 1,
          textAlign: 'right',
          fontFamily: FONT_PIXEL,
          fontWeight: 700,
          fontSize: 50,
          color: bump > 0.4 ? C.sun : C.white,
          whiteSpace: 'nowrap',
        }}
      >
        {m.prefix}
        {fmt(v, m.short)}
        {m.suffix}
      </span>
    </div>
  );
};

const LoopBar: React.FC<{l: Loop; dim: number}> = ({l, dim}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  const from = T(l.from ?? 0);
  const until = T(l.until);
  const hideAt = until + Math.round(fps * 1.6);
  if (frame < from || frame > hideAt) return null;
  const done = frame >= until;
  const prog = interpolate(frame, [from, until], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const left = Math.max(0, Math.ceil((until - frame) / fps));
  const out = interpolate(frame, [hideAt - 8, hideAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pop = done ? spring({frame: frame - until, fps, config: {damping: 8, stiffness: 220, mass: 0.5}}) : 1;
  // isi bar bertahap per 4% agar terasa pixel
  const w = Math.round(prog * 25) * 4;
  return (
    <div style={{position: 'relative', height: 48, opacity: out * (1 - dim * 0.85), transform: `scale(${done ? 0.9 + 0.1 * pop : 1})`, ...pixelBox(C.paper, C.frame, 4)}}>
      <div style={{position: 'absolute', left: 4, top: 4, bottom: 4, width: `calc(${w}% - 8px)`, background: done ? C.good : C.sun}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '0 14px',
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 21,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{done ? l.done ?? 'Ini dia 👇' : l.text}</span>
        {!done && <span style={{fontFamily: FONT_PIXEL, flexShrink: 0}}>{left} dtk</span>}
      </div>
    </div>
  );
};

export const Hud: React.FC<{dim: number}> = ({dim}) => {
  const {sb} = useTiming();
  if (!sb.meter && !sb.loop) return null;
  return (
    <div style={{position: 'absolute', ...HUD_BOX, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 15}}>
      {sb.meter && <MeterPill m={sb.meter} dim={dim} />}
      {sb.loop && <LoopBar l={sb.loop} dim={dim} />}
    </div>
  );
};
