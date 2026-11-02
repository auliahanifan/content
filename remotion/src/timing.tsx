import React, {createContext, useContext} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Storyboard, Word} from './types';

type Timing = {
  words: Word[];
  sb: Storyboard;
  available: Set<string>;
  /** frame saat kata ke-i mulai diucapkan (sedikit lebih awal agar terasa sinkron) */
  T: (i: number) => number;
  /** frame saat kata ke-i selesai */
  E: (i: number) => number;
};

const Ctx = createContext<Timing | null>(null);
export const TimingProvider = Ctx.Provider;

export const LEAD = 2; // frame lebih awal dari suara

export const makeTiming = (words: Word[], sb: Storyboard, fps: number, available: string[]): Timing => {
  const clampI = (i: number) => Math.max(0, Math.min(words.length - 1, i));
  return {
    words,
    sb,
    available: new Set(available),
    T: (i) => Math.max(0, Math.round(words[clampI(i)][1] * fps) - LEAD),
    E: (i) => Math.round(words[clampI(i)][2] * fps),
  };
};

export const useTiming = () => {
  const t = useContext(Ctx);
  if (!t) throw new Error('TimingProvider hilang');
  return t;
};

/** Progres 0..1 (spring, bisa overshoot) sejak kata `at` atau frame absolut `fromFrame`. */
export const usePop = (at: number | undefined, fallbackFrame = 0, config = {damping: 11, stiffness: 190, mass: 0.6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  const start = at === undefined ? fallbackFrame : T(at);
  return {p: spring({frame: frame - start, fps, config}), visible: frame >= start, start};
};

export const popStyle = (p: number, visible: boolean, dy = 40): React.CSSProperties => ({
  opacity: visible ? Math.min(1, p * 1.6) : 0,
  transform: `translateY(${(1 - p) * dy}px) scale(${0.6 + 0.4 * p})`,
});
