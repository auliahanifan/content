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
      <div style={{position: 'absolute', inset: 0, clipPath: notch(10), ...pixelBox(C.paper, C.frame, 8), overflow: 'hidden'}}>
        {kicker && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: BAR,
              background: C.accent,
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
            <span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>{kicker}</span>
            {[C.sun, C.good, C.white].map((c, i) => (
              <span key={i} style={{width: 22, height: 22, background: c, boxShadow: `0 0 0 4px ${C.ink}`}} />
            ))}
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
