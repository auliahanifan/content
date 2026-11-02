import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {C} from '../theme';
import type {MapName} from '../types';

/**
 * Map latar procedural (pixel art dari kotak SVG, tanpa aset). Tiap map = langit + lapisan jauh/tengah/depan
 * yang di-tile horizontal sehingga bisa digulir (side-scroll). `scroll` dalam px dunia; lapisan bergerak
 * dengan faktor parallax berbeda. Papan menutup y 230-1030, jadi detail penting ada di y > 1000 dan tepi kiri/kanan.
 */
const W = 1080;
const FLOOR = 1700; // permukaan lantai; kaki karakter di ~1880

type LayerFn = (tile: number, frame: number) => React.ReactNode;
type MapDef = {sky: string; layers: {f: number; fn: LayerFn; glow?: boolean}[]; particles: {color: string; kind: 'float' | 'ember'}};

/** Tile horizontal: gambar `fn` di beberapa salinan lebar W, bergeser `shift`. */
const Tiled: React.FC<{shift: number; fn: LayerFn; frame: number; glow?: boolean}> = ({shift, fn, frame, glow}) => {
  const off = ((shift % W) + W) % W;
  const base = Math.floor(shift / W);
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      shapeRendering="crispEdges"
      style={{position: 'absolute', inset: 0, overflow: 'visible', filter: glow ? 'drop-shadow(0 0 10px rgba(255,255,255,0.35))' : undefined}}
    >
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${k * W - off} 0)`}>
          {fn(base + k, frame)}
        </g>
      ))}
    </svg>
  );
};

const R: React.FC<{x: number; y: number; w: number; h: number; c: string; o?: number}> = ({x, y, w, h, c, o}) => (
  <rect x={Math.round(x / 4) * 4} y={Math.round(y / 4) * 4} width={Math.round(w / 4) * 4} height={Math.round(h / 4) * 4} fill={c} opacity={o} />
);

const rnd = (k: string) => random(k);

// ---------------- padang (dunia RPG bawaan) ----------------
const Cloud: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y})`}>
    {[[2, 0, 4, 1], [1, 1, 7, 1], [0, 2, 10, 2], [1, 4, 8, 1]].map(([cx, cy, w, h], i) => (
      <rect key={i} x={cx * s * 2} y={cy * s * 2} width={w * s * 2} height={h * s * 2} fill={C.white} opacity={0.95} />
    ))}
  </g>
);

const hillPath = (top: number, amp: number, seed: number, tile: number) => {
  const step = 40;
  let d = `M0 1920 `;
  for (let i = 0; i <= W / step; i++) {
    const k = tile * (W / step) + i;
    const h = Math.round(((Math.sin(k * 0.35 + seed) + Math.sin(k * 0.13 + seed * 3)) * 0.5 * amp) / 20) * 20;
    d += `L${i * step} ${top - h} L${i * step + step} ${top - h} `;
  }
  return d + `L${W} 1920 Z`;
};

const Padang: MapDef = {
  sky: `linear-gradient(${C.daySkyTop}, ${C.daySkyBottom} 70%)`,
  layers: [
    {f: 0.15, fn: (t: number) => [100, 700].map((x, i) => <Cloud key={i} x={x} y={180 + i * 300 + (t % 2) * 120} s={9 - i} />)},
    {f: 0.35, fn: (t: number) => <path d={hillPath(1360, 120, 1, t)} fill={C.hillFar} />},
    {f: 0.7, fn: (t: number) => <path d={hillPath(1520, 90, 2, t)} fill={C.hillNear} />},
    {f: 1, fn: () => <R x={0} y={FLOOR} w={W} h={220} c="#2F7A3A" />},
  ],
  particles: {color: '#FFF6C9', kind: 'float' },
};

// ---------------- toko (ruko/warung + jalan) ----------------
const RUKO = ['#F4D06F', '#7FC8A9', '#F28482', '#9DB4E8'];
const AWN = [['#E2445C', '#FFF8E7'], ['#3FBF5F', '#FFF8E7'], ['#FF8A3D', '#FFF8E7'], ['#4F7BFF', '#FFF8E7']];
const Toko: MapDef = {
  sky: 'linear-gradient(#FFB86B, #FFE3B0 65%)',
  layers: [
    {
      f: 0.3,
      fn: (t: number) =>
        [0, 1, 2, 3, 4].map((i) => {
          const h = 300 + Math.round(rnd(`tf${t}${i}`) * 200);
          return (
            <g key={i}>
              <R x={i * 216} y={1450 - h} w={200} h={h + 300} c="#E39B6E" />
              {[0, 1, 2].map((r) => [0, 1].map((c) => <R key={`${r}${c}`} x={i * 216 + 40 + c * 80} y={1450 - h + 40 + r * 90} w={44} h={52} c="#F7C59F" />))}
            </g>
          );
        }),
    },
    {
      f: 0.65,
      fn: (t: number) =>
        [0, 1, 2, 3].map((i) => {
          const k = (t * 4 + i + 400) % 4;
          const h = 560 + Math.round(rnd(`tm${t}${i}`) * 120);
          const x = i * 270;
          const [a, b] = AWN[k];
          return (
            <g key={i}>
              <R x={x + 6} y={FLOOR - h} w={258} h={h} c={RUKO[k]} />
              <R x={x + 6} y={FLOOR - h} w={258} h={28} c={C.ink} o={0.25} />
              {[0, 1].map((c) => <R key={c} x={x + 40 + c * 120} y={FLOOR - h + 70} w={70} h={90} c="#FFF8E7" />)}
              {[0, 1].map((c) => <R key={`f${c}`} x={x + 40 + c * 120} y={FLOOR - h + 70} w={70} h={12} c={C.ink} o={0.3} />)}
              <R x={x + 30} y={FLOOR - 330} w={210} h={46} c={C.ink} />
              <R x={x + 36} y={FLOOR - 324} w={198} h={34} c={k % 2 ? C.sun : C.white} />
              {[0, 1, 2, 3, 4, 5, 6].map((s) => <R key={`a${s}`} x={x + s * 38} y={FLOOR - 270} w={38} h={60} c={s % 2 ? b : a} />)}
              {[0, 1, 2, 3, 4, 5, 6].map((s) => <R key={`s${s}`} x={x + s * 38 + 8} y={FLOOR - 210} w={22} h={12} c={s % 2 ? b : a} />)}
              <R x={x + 30} y={FLOOR - 190} w={210} h={190} c="#3B2F4A" />
              {[0, 1, 2].map((r) =>
                [0, 1, 2, 3, 4].map((c) => (
                  <R key={`b${r}${c}`} x={x + 42 + c * 40} y={FLOOR - 176 + r * 60} w={30} h={36} c={['#FFD23F', '#FF5C39', '#4FB3FF', '#3FBF5F', '#FFFFFF'][(r + c + k) % 5]} />
                )),
              )}
            </g>
          );
        }),
    },
    {
      f: 1,
      fn: (t: number) => (
        <g>
          <R x={0} y={FLOOR} w={W} h={70} c="#CFC6BA" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <R key={i} x={i * 120} y={FLOOR} w={4} h={70} c="#A89F94" />)}
          <R x={0} y={FLOOR + 70} w={W} h={160} c="#4A4A58" />
          {[0, 1, 2, 3, 4].map((i) => <R key={`l${i}`} x={i * 216 + 40} y={FLOOR + 140} w={110} h={12} c={C.sun} />)}
          {[0, 1].map((i) => {
            const x = 140 + i * 560 + Math.round(rnd(`tb${t}${i}`) * 120);
            return (
              <g key={`box${i}`}>
                <R x={x} y={FLOOR - 70} w={90} h={70} c="#C98B4F" />
                <R x={x + 40} y={FLOOR - 70} w={10} h={70} c="#A86B35" />
                <R x={x + 20} y={FLOOR - 130} w={70} h={60} c="#D9A066" />
                <R x={x + 50} y={FLOOR - 130} w={10} h={60} c="#A86B35" />
              </g>
            );
          })}
        </g>
      ),
    },
  ],
  particles: {color: '#FFE9B8', kind: 'float' },
};

// ---------------- kantor ----------------
const Kantor: MapDef = {
  sky: 'linear-gradient(#DCEBFA, #EEF5FD)',
  layers: [
    {
      f: 0.25,
      fn: (t: number) =>
        [0, 1].map((i) => (
          <g key={i}>
            <R x={i * 540 + 40} y={1000} w={460} h={560} c="#FFFFFF" />
            <R x={i * 540 + 60} y={1020} w={420} h={520} c="#9CC9F5" />
            {[0, 1, 2, 3, 4].map((b) => {
              const h = 140 + Math.round(rnd(`kb${t}${i}${b}`) * 260);
              return <R key={b} x={i * 540 + 70 + b * 82} y={1540 - h} w={70} h={h} c={b % 2 ? '#6FA8E0' : '#5B93CF'} />;
            })}
            <R x={i * 540 + 266} y={1020} w={8} h={520} c="#FFFFFF" />
            <R x={i * 540 + 60} y={1270} w={420} h={8} c="#FFFFFF" />
          </g>
        )),
    },
    {
      f: 0.6,
      fn: (t: number, frame: number) =>
        [0, 1].map((i) => {
          const x = i * 540;
          const flick = Math.floor(frame / 10 + i) % 3;
          return (
            <g key={i}>
              <R x={x + 40} y={FLOOR - 170} w={300} h={24} c="#8D6E63" />
              <R x={x + 60} y={FLOOR - 146} w={20} h={146} c="#6D4C41" />
              <R x={x + 300} y={FLOOR - 146} w={20} h={146} c="#6D4C41" />
              <R x={x + 110} y={FLOOR - 330} w={170} h={130} c={C.ink} />
              <R x={x + 122} y={FLOOR - 318} w={146} h={100} c="#4FB3FF" />
              {[0, 1, 2].map((l) => <R key={l} x={x + 134} y={FLOOR - 304 + l * 26} w={l === flick ? 120 : 80} h={10} c="#DDF0FF" />)}
              <R x={x + 186} y={FLOOR - 200} w={20} h={30} c={C.ink} />
              <R x={x + 400} y={FLOOR - 120} w={70} h={120} c="#C1693C" />
              {[[-20, -60], [10, -110], [40, -70], [0, -160], [30, -190]].map(([dx, dy], l) => (
                <R key={`p${l}`} x={x + 400 + dx + 15} y={FLOOR - 120 + dy} w={50} h={60} c={l % 2 ? '#3E9A4A' : '#5BBF6A'} />
              ))}
              {t % 2 === 0 && i === 1 && (
                <g>
                  <R x={x + 40} y={FLOOR - 640} w={300} h={200} c="#FFFFFF" />
                  <R x={x + 40} y={FLOOR - 640} w={300} h={12} c={C.ink} o={0.4} />
                  {[0, 1, 2, 3, 4, 5].map((n) => <R key={n} x={x + 64 + (n % 3) * 90} y={FLOOR - 610 + Math.floor(n / 3) * 80} w={64} h={60} c={['#FFD23F', '#FF8FB1', '#7FD08A'][n % 3]} />)}
                </g>
              )}
            </g>
          );
        }),
    },
    {
      f: 1,
      fn: () => (
        <g>
          <R x={0} y={FLOOR} w={W} h={220} c="#C89B6D" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5].map((c) => <R key={`${r}${c}`} x={c * 180 + (r % 2) * 90} y={FLOOR + r * 56} w={4} h={56} c="#A97C50" />))}
          {[0, 1, 2, 3].map((r) => <R key={`h${r}`} x={0} y={FLOOR + r * 56} w={W} h={4} c="#A97C50" />)}
        </g>
      ),
    },
  ],
  particles: {color: '#FFFFFF', kind: 'float' },
};

// ---------------- kota (pasar digital senja) ----------------
const NEON = ['#FF4FA3', '#2EE6D6', '#FFD23F', '#8B5CF6'];
const neonShape = (kind: number, x: number, y: number, c: string, s = 12) => {
  const shapes = [
    // hati
    ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'],
    // keranjang
    ['1000000', '1111111', '0111110', '0111110', '0010100'],
    // play
    ['1100', '1111', '1111', '1100'],
    // gelembung chat
    ['111111', '111111', '111111', '011000'],
  ][kind];
  return shapes.flatMap((row, r) => [...row].map((v, k) => (v === '1' ? <rect key={`${kind}${r}${k}${x}`} x={x + k * s} y={y + r * s} width={s} height={s} fill={c} /> : null)));
};
const Kota: MapDef = {
  sky: 'linear-gradient(#1F1747, #5B2A7A 45%, #FF7A59 85%)',
  layers: [
    {
      f: 0.25,
      fn: (t: number, frame: number) =>
        [0, 1, 2, 3, 4, 5].map((i) => {
          const h = 500 + Math.round(rnd(`kf${t}${i}`) * 450);
          const x = i * 180;
          return (
            <g key={i}>
              <R x={x + 10} y={1500 - h} w={160} h={h + 200} c="#2E2160" />
              {[...Array(Math.floor(h / 70))].map((_, r) =>
                [0, 1, 2].map((c) => {
                  const on = rnd(`kw${t}${i}${r}${c}${Math.floor(frame / 45)}`) > 0.45;
                  return <R key={`${r}${c}`} x={x + 30 + c * 46} y={1500 - h + 30 + r * 70} w={26} h={34} c={on ? '#FFD86B' : '#3D2D78'} />;
                }),
              )}
            </g>
          );
        }),
    },
    {
      f: 0.6,
      glow: true,
      fn: (t: number, frame: number) =>
        [0, 1, 2].map((i) => {
          const x = i * 360;
          const k = (t * 3 + i + 300) % 4;
          const on = Math.floor(frame / 6 + i * 5) % 23 !== 0;
          return (
            <g key={i}>
              <R x={x + 40} y={FLOOR - 520} w={150} h={520} c="#1B1438" />
              <R x={x + 52} y={FLOOR - 500} w={126} h={220} c={NEON[(k + 1) % 4]} o={0.25} />
              <R x={x + 210} y={FLOOR - 300} w={120} h={300} c="#241A4A" />
              <g opacity={on ? 1 : 0.25}>{neonShape(k, x + 70, FLOOR - 470, NEON[k], 14)}</g>
            </g>
          );
        }),
    },
    {
      f: 1,
      fn: (_t: number, frame: number) => (
        <g>
          <R x={0} y={FLOOR} w={W} h={60} c="#3A2D63" />
          <R x={0} y={FLOOR + 60} w={W} h={160} c="#160F2E" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <R key={i} x={i * 180 + ((frame * 2) % 180) - 90} y={FLOOR + 110 + (i % 2) * 40} w={90} h={8} c={NEON[i % 2]} o={0.55} />
          ))}
        </g>
      ),
    },
  ],
  particles: {color: '#2EE6D6', kind: 'float' },
};

// ---------------- dungeon (server room ceria) ----------------
const Dungeon: MapDef = {
  sky: 'linear-gradient(#211A38, #2E2550)',
  layers: [
    {
      f: 0.3,
      fn: () =>
        [...Array(20)].map((_, r) =>
          [...Array(10)].map((__, c) => <R key={`${r}${c}`} x={c * 112 + (r % 2) * 56 - 56} y={r * 76 + 280} w={104} h={68} c={(r + c) % 3 ? '#3B3158' : '#453A66'} />),
        ),
    },
    {
      f: 0.6,
      fn: (t: number, frame: number) =>
        [0, 1, 2].map((i) => {
          const x = i * 360;
          const fl = Math.floor(frame / 3 + i * 7) % 3;
          return (
            <g key={i}>
              <R x={x + 30} y={FLOOR - 600} w={160} h={600} c="#151832" />
              <R x={x + 38} y={FLOOR - 592} w={144} h={584} c="#1F2445" />
              {[...Array(9)].map((_, r) => (
                <g key={r}>
                  <R x={x + 50} y={FLOOR - 570 + r * 62} w={120} h={44} c="#2A3060" />
                  {[0, 1, 2].map((l) => {
                    const on = rnd(`led${t}${i}${r}${l}${Math.floor(frame / 8)}`) > 0.35;
                    return <R key={l} x={x + 60 + l * 22} y={FLOOR - 556 + r * 62} w={12} h={12} c={on ? ['#3FBF5F', '#2EE6D6', '#E2445C'][(l + r) % 3] : '#151832'} />;
                  })}
                </g>
              ))}
              <R x={x + 250} y={FLOOR - 420} w={16} h={110} c="#7A4E2D" />
              <R x={x + 238} y={FLOOR - 450 - fl * 8} w={40} h={40 + fl * 8} c="#2EE6D6" />
              <R x={x + 248} y={FLOOR - 470 - fl * 10} w={20} h={30} c="#C9FFFA" />
              <R x={x + 220} y={FLOOR - 110} w={110} h={110} c="#8A5A2B" />
              <R x={x + 220} y={FLOOR - 110} w={110} h={20} c="#6B421E" />
              <R x={x + 262} y={FLOOR - 76} w={26} h={30} c={C.sun} />
            </g>
          );
        }),
    },
    {
      f: 1,
      fn: () => (
        <g>
          <R x={0} y={FLOOR} w={W} h={220} c="#4A4066" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <R key={`${r}${c}`} x={c * 160 + (r % 2) * 80} y={FLOOR + r * 56} w={6} h={56} c="#3A3154" />))}
          {[0, 1, 2, 3].map((r) => <R key={`h${r}`} x={0} y={FLOOR + r * 56} w={W} h={6} c="#3A3154" />)}
        </g>
      ),
    },
  ],
  particles: {color: '#2EE6D6', kind: 'ember' },
};

export const MAPS: Record<MapName, MapDef> = {padang: Padang, toko: Toko, kantor: Kantor, kota: Kota, dungeon: Dungeon};

/** Satu map lengkap pada posisi gulir `scroll` (px). */
export const MapView: React.FC<{name: MapName; scroll: number; frame: number}> = ({name, scroll, frame}) => {
  const m = MAPS[name] ?? Padang;
  return (
    <AbsoluteFill style={{background: m.sky}}>
      {m.layers.map((l, i) => (
        <Tiled key={i} shift={scroll * l.f} fn={l.fn} frame={frame} glow={l.glow} />
      ))}
      <Ambient color={m.particles.color} kind={m.particles.kind} frame={frame} scroll={scroll} />
    </AbsoluteFill>
  );
};

/** Partikel ambien: debu cahaya melayang (float) atau bara naik (ember). */
const Ambient: React.FC<{color: string; kind: 'float' | 'ember'; frame: number; scroll: number}> = ({color, kind, frame, scroll}) => (
  <>
    {[...Array(26)].map((_, i) => {
      const sp = 0.6 + rnd(`as${i}`) * 1.4;
      const x0 = rnd(`ax${i}`) * 1180;
      const y0 = rnd(`ay${i}`) * 1920;
      const y = kind === 'ember' ? (((y0 - frame * sp * 3) % 1920) + 1920) % 1920 : y0 + Math.sin(frame / (20 + i) + i) * 30;
      const x = (((x0 - scroll * 0.8 - frame * sp * (kind === 'float' ? 0.6 : 0.2)) % 1180) + 1180) % 1180 - 50;
      const s = rnd(`az${i}`) > 0.75 ? 12 : 6;
      const tw = 0.35 + 0.5 * Math.abs(Math.sin(frame / (8 + (i % 6)) + i));
      return <div key={i} style={{position: 'absolute', left: Math.round(x / 6) * 6, top: Math.round(y / 6) * 6, width: s, height: s, background: color, opacity: tw}} />;
    })}
  </>
);
