import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {useTiming} from '../timing';

/** Coretan merah tebal bergaya pixel, tertarik dari kiri ke kanan pada kata `at`. */
export const Strike: React.FC<{at?: number; top?: string}> = ({at, top = '50%'}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  if (at === undefined) return null;
  const w = Math.round(interpolate(frame, [T(at), T(at) + 6], [0, 104], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) / 8) * 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: '-2%',
        top,
        width: `${w}%`,
        height: 14,
        background: C.bad,
        boxShadow: `0 0 0 4px ${C.ink}`,
        transform: 'rotate(-3deg)',
        transformOrigin: 'left center',
      }}
    />
  );
};
