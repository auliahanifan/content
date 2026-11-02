import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import type {Transition as T} from '../types';

export const TRANS = 16; // frame total; tertutup penuh di tengah (saat adegan berganti)

const CELL = 120;
const COLS = 9;
const ROWS = 16;
const THR = new Array(COLS * ROWS).fill(0).map((_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return ((c + r) / (COLS + ROWS - 2)) * 0.8 + random(`t${i}`) * 0.2;
});

/** Transisi game: mosaik pixel diagonal atau iris bulat. `at` = frame pergantian adegan. */
export const SceneTransition: React.FC<{at: number; kind: T}> = ({at, kind}) => {
  const frame = useCurrentFrame();
  const half = TRANS / 2;
  if (kind === 'none' || frame < at - half || frame > at + half) return null;
  const closing = frame <= at;
  const p = closing
    ? interpolate(frame, [at - half, at], [0, 1])
    : interpolate(frame, [at, at + half], [1, 0]);
  if (kind === 'iris') {
    const r = (1 - p) * 1300;
    return (
      <AbsoluteFill
        style={{
          background: C.ink,
          WebkitMaskImage: `radial-gradient(circle at 50% 45%, transparent ${r}px, black ${r + 1}px)`,
          maskImage: `radial-gradient(circle at 50% 45%, transparent ${r}px, black ${r + 1}px)`,
        }}
      />
    );
  }
  return (
    <AbsoluteFill>
      {THR.map((t, i) =>
        (closing ? p >= t : p > t) ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (i % COLS) * CELL,
              top: Math.floor(i / COLS) * CELL,
              width: CELL,
              height: CELL,
              background: ((i % COLS) + Math.floor(i / COLS)) % 2 ? C.ink : '#262B52',
            }}
          />
        ) : null,
      )}
    </AbsoluteFill>
  );
};
