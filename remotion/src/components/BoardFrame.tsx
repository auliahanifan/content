import React from 'react';
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BoardContent} from '../boards/Boards';
import type {Box} from '../layout';
import {C, FONT_BODY, FONT_PIXEL, notch, pixelBox} from '../theme';
import {useTiming} from '../timing';
import type {Scene} from '../types';
import {PIXEL_ROOT} from './Character';

const BAR = 70;

/** Papan = jendela game: title bar (kicker), isi krem bergaris ganda, sudut berundak, bayangan keras. */
export const BoardFrame: React.FC<{scene: Scene; start: number; box: Box; dim: number; hidden: number}> = ({scene, start, box, dim, hidden}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 170, mass: 0.7}});
  const kicker = scene.board.kicker;
  const vis = (1 - dim * 0.85) * (1 - hidden);
  const skin = scene.board.type === 'word' ? 'word' : scene.skin ?? 'window';
  const sk = SKINS[skin];
  if (skin === 'none') {
    // tanpa jendela: isi langsung di dunia, outline putih agar terbaca di latar apa pun
    return (
      <div
        style={{
          position: 'absolute',
          ...box,
          opacity: Math.min(1, s * 2) * vis,
          transform: `scale(${(0.85 + 0.15 * s) * (1 - dim * 0.08)})`,
          filter: `drop-shadow(5px 0 0 ${C.white}) drop-shadow(-5px 0 0 ${C.white}) drop-shadow(0 5px 0 ${C.white}) drop-shadow(0 -5px 0 ${C.white}) drop-shadow(8px 8px 0 ${C.ink})`,
          display: 'flex',
          padding: '20px 30px',
        }}
      >
        <BoardContent b={scene.board} start={start} />
      </div>
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        ...box,
        opacity: Math.min(1, s * 2) * vis,
        transform: `translateY(${Math.round(((1 - s) * 120 + hidden * -80) / 4) * 4}px) scale(${(0.9 + 0.1 * s) * (1 - dim * 0.08)})`,
        filter: `drop-shadow(12px 12px 0 ${C.ink})`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, clipPath: notch(10), ...pixelBox(sk.bg, sk.inner, 8), overflow: 'hidden'}}>
        {skin === 'arcade' && (
          <div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(transparent 0 6px, rgba(27,31,59,0.07) 6px 8px)`, zIndex: 1, pointerEvents: 'none'}} />
        )}
        {skin === 'item' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 120,
              left: `${((frame - start) * 18) % 2400 - 300}px`,
              background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}
        {skin === 'quest' && (
          <div style={{position: 'absolute', right: 34, bottom: 30, width: 72, height: 72, background: C.bad, boxShadow: `0 0 0 6px ${C.ink}, inset -10px -10px 0 #A82A3E`, borderRadius: 4, zIndex: 1}} />
        )}
        {kicker && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: BAR,
              background: sk.bar,
              boxShadow: `inset 0 -8px 0 ${C.ink}, inset 8px 8px 0 ${C.ink}, inset -8px 0 0 ${C.ink}`,
              display: 'flex',
              alignItems: 'center',
              padding: '4px 34px 0',
              gap: 16,
              fontFamily: FONT_PIXEL,
              fontWeight: 700,
              fontSize: 36,
              color: C.white,
              textShadow: `4px 4px 0 ${C.ink}`,
            }}
          >
            {sk.icon && <span style={{color: C.sun}}>{sk.icon}</span>}
            <span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>{kicker}</span>
            {skin === 'item' ? (
              <span style={{color: C.sun, letterSpacing: 2}}>★★★★★</span>
            ) : (
              [C.sun, C.good, C.white].map((c, i) => (
                <span
                  key={i}
                  style={{width: 22, height: 22, background: c, boxShadow: `0 0 0 4px ${C.ink}`, opacity: Math.floor((frame + i * 9) / 14) % 3 === i ? 0.4 : 1}}
                />
              ))
            )}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: 40,
            right: 40,
            top: kicker ? BAR + 26 : 40,
            bottom: scene.footer ? 110 : 40,
            display: 'flex',
          }}
        >
          <BoardContent b={scene.board} start={start} />
        </div>
      </div>
      {scene.footer && <Dialog f={scene.footer} start={start} />}
    </div>
  );
};

/** Kulit papan: warna isi, garis dalam, title bar, ikon kicker. */
const SKINS: Record<string, {bg: string; inner: string; bar: string; icon?: string}> = {
  window: {bg: C.paper, inner: C.frame, bar: C.accent},
  word: {bg: C.ink, inner: C.accent, bar: C.accent},
  quest: {bg: '#F5E1B0', inner: '#B8864B', bar: '#8A5A2B', icon: '!'},
  arcade: {bg: '#E9FFFB', inner: '#2EE6D6', bar: '#FF4FA3', icon: '▶'},
  item: {bg: '#FFF6DA', inner: '#E0A800', bar: '#8B5CF6', icon: '◆'},
  none: {bg: 'transparent', inner: 'transparent', bar: 'transparent'},
};

/** Kotak dialog RPG: potret kecil + teks mengetik + panah berkedip. */
const Dialog: React.FC<{f: NonNullable<Scene['footer']>; start: number}> = ({f}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  const t0 = T(f.at);
  if (frame < t0 - 2) return null;
  const plain = f.text.replace(/\*/g, '');
  const n = Math.min(plain.length, Math.max(0, Math.floor((frame - t0) * 1.4)));
  // sorotan *..* tetap dipertahankan saat mengetik
  const out: React.ReactNode[] = [];
  let k = 0;
  f.text.split(/(\*[^*]+\*)/g).filter(Boolean).forEach((part, i) => {
    const hl = part.startsWith('*');
    const txt = hl ? part.slice(1, -1) : part;
    const shown = txt.slice(0, Math.max(0, n - k));
    k += txt.length;
    if (shown) out.push(<span key={i} style={{color: hl ? C.accent : C.ink}}>{shown}</span>);
  });
  const done = n >= plain.length;
  return (
    <div
      style={{
        position: 'absolute',
        left: 30,
        right: 30,
        bottom: -70,
        height: 150,
        ...pixelBox(C.white, C.sky, 6),
        clipPath: notch(6),
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 28px 0 20px',
      }}
    >
      <div style={{width: 110, height: 110, flexShrink: 0, overflow: 'hidden', position: 'relative', ...pixelBox(C.sun, C.white, 5)}}>
        <Img
          src={staticFile(`${PIXEL_ROOT}/characters/netral.png`)}
          style={{position: 'absolute', width: 330, left: -110, top: -18, imageRendering: 'pixelated'}}
        />
      </div>
      <div style={{flex: 1, fontFamily: FONT_BODY, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: C.ink}}>
        {out}
        {done && Math.floor(frame / 8) % 2 === 0 && <span style={{fontFamily: FONT_PIXEL, color: C.accent, marginLeft: 10}}>▼</span>}
      </div>
    </div>
  );
};
