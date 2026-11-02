import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {useTiming} from '../timing';

/** Coretan merah yang tertarik dari kiri ke kanan pada kata `at`. */
export const Strike: React.FC<{at?: number; top?: string}> = ({at, top = '50%'}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  if (at === undefined) return null;
  const w = interpolate(frame, [T(at), T(at) + 8], [0, 104], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: '-2%',
        top,
        width: `${w}%`,
        height: 12,
        borderRadius: 6,
        background: C.bad,
        transform: 'rotate(-4deg)',
        transformOrigin: 'left center',
        boxShadow: `0 0 0 4px ${C.paper}`,
      }}
    />
  );
};
