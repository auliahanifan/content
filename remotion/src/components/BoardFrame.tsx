import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BoardContent} from '../boards/Boards';
import {C, FONT_BODY, FONT_DISPLAY, sticker} from '../theme';
import {popStyle, usePop, useTiming} from '../timing';
import type {Scene} from '../types';
import {Prop} from './Prop';
import {Rich} from './Rich';

export const EXIT = 8;
export const BOARD = {left: 50, top: 230, width: 980, height: 800};

/** Papan konsep: masuk dengan spring + miring, keluar terangkat. Kicker = tab di atas papan. */
export const BoardFrame: React.FC<{scene: Scene; start: number; end: number; dim: number; index: number}> = ({scene, start, end, dim, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - start, fps, config: {damping: 13, stiffness: 140, mass: 0.8}});
  const e = interpolate(frame, [end - EXIT, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const side = index % 2 === 0 ? 1 : -1;
  const kicker = scene.board.kicker;
  return (
    <div
      style={{
        position: 'absolute',
        ...BOARD,
        opacity: Math.min(1, s * 2) * (1 - e) * (1 - dim * 0.85),
        transform: `translateY(${(1 - s) * 180 - e * 90}px) rotate(${(1 - s) * -5 * side + e * 4 * side}deg) scale(${(0.9 + 0.1 * s) * (1 - dim * 0.08)})`,
      }}
    >
      <div
        style={{
          ...sticker(14),
          boxShadow: `14px 14px 0 ${scene.dark ? C.accent : C.ink}`,
          position: 'absolute',
          inset: 0,
          borderRadius: 48,
          padding: scene.footer ? '56px 48px 130px' : '56px 48px 48px',
          boxSizing: 'border-box',
          display: 'flex',
        }}
      >
        <BoardContent b={scene.board} start={start} />
      </div>
      {kicker && (
        <div
          style={{
            ...sticker(6, C.accent),
            position: 'absolute',
            left: 48,
            top: -34,
            padding: '8px 26px',
            borderRadius: 999,
            fontFamily: FONT_BODY,
            fontWeight: 800,
            fontSize: 34,
            color: C.paper,
            rotate: '-2deg',
          }}
        >
          {kicker}
        </div>
      )}
      {scene.footer && <FooterBanner f={scene.footer} start={start} />}
    </div>
  );
};

const FooterBanner: React.FC<{f: NonNullable<Scene['footer']>; start: number}> = ({f, start}) => {
  const {T} = useTiming();
  const {p, visible} = usePop(f.at, start, {damping: 9, stiffness: 200, mass: 0.6});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 26,
        display: 'flex',
        justifyContent: 'center',
        ...popStyle(p, visible, 30),
      }}
    >
      <div
        style={{
          ...sticker(8, C.sun),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '14px 34px 14px 18px',
          borderRadius: 999,
          rotate: '-1.5deg',
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 52,
          color: C.ink,
        }}
      >
        {(f.prop || f.emoji) && <Prop prop={f.prop} emoji={f.emoji} size={86} bg={C.paper} />}
        <Rich text={f.text} from={T(f.at)} marker={C.paper} />
      </div>
    </div>
  );
};
