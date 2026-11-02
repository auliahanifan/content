import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Video} from './Video';
import type {Board, Storyboard, VideoProps, Word} from './types';

export const FPS = 30;

const getJson = async <T,>(path: string): Promise<T | null> => {
  const res = await fetch(`${staticFile(path)}?t=${Date.now()}`);
  if (!res.ok) return null;
  return (await res.json()) as T;
};

const exists = async (path: string) => {
  try {
    const res = await fetch(staticFile(path), {method: 'HEAD'});
    return res.ok;
  } catch {
    return false;
  }
};

const propNames = (sb: Storyboard) => {
  const names = new Set<string>();
  const add = (x?: {prop?: string}) => x?.prop && names.add(x.prop);
  sb.scenes.forEach((s) => {
    add(s.footer);
    const b = s.board as Board & {items?: {prop?: string}[]; left?: {prop?: string}; right?: {prop?: string}};
    b.items?.forEach(add);
    add(b.left);
    add(b.right);
  });
  return [...names];
};

/** Membaca public/video/storyboard.json (folder video aktif, lihat scripts/run.mjs). */
const calculateMetadata: CalculateMetadataFunction<VideoProps> = async () => {
  const sb = await getJson<Storyboard>('video/storyboard.json');
  if (!sb) return {durationInFrames: FPS * 3, props: {storyboard: null, words: [], availableProps: []}};
  const words = (await getJson<Word[]>(`video/${sb.words ?? 'tts/words.json'}`)) ?? [];
  const audioSec = await getAudioDurationInSeconds(staticFile(`video/${sb.audio ?? 'tts/final.mp3'}`));
  const names = propNames(sb);
  const ok = await Promise.all(names.map((n) => exists(`shared/props/${n}.png`)));
  const availableProps = names.filter((_, i) => ok[i]);
  const missing = names.filter((_, i) => !ok[i]);
  if (missing.length) console.warn(`[video-karakter] props belum ada (pakai placeholder): ${missing.join(', ')}`);
  return {
    durationInFrames: Math.ceil((audioSec + (sb.tail ?? 1.2)) * FPS),
    props: {storyboard: sb, words, availableProps},
  };
};

export const Root: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={FPS * 3}
    defaultProps={{storyboard: null, words: [], availableProps: []} as VideoProps}
    calculateMetadata={calculateMetadata}
  />
);
