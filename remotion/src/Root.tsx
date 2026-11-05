import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Video} from './Video';
import {ComicTest, COMIC_FRAMES} from './comic/ComicTest';
import type {Board, PixelAsset, Storyboard, VideoProps, Word} from './types';

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
  const walk = (els: {prop?: string; icon?: {prop?: string}; items?: unknown[]}[] = []): void =>
    els.forEach((e) => {
      add(e);
      add(e.icon);
      if (Array.isArray(e.items)) walk(e.items as typeof els);
    });
  sb.panels?.forEach((p) => walk(p.items as Parameters<typeof walk>[0]));
  (sb.scenes ?? []).forEach((s) => {
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
  const manifest = await getJson<{assets: PixelAsset[]}>('shared/pixel-aulia/manifest.json');
  const pixel = manifest?.assets ?? [];
  type BoldRaw = {id: string; category: string; file: string; width: number; height: number; alphaBounds: [number, number, number, number]};
  const boldM = await getJson<{assets: BoldRaw[]}>('shared/bold-vector-aulia/manifest.json');
  const bold: PixelAsset[] = (boldM?.assets ?? []).map((a) => ({id: a.id, category: a.category, file: a.file, width: a.width, height: a.height, visibleAlphaBounds: a.alphaBounds, root: 'shared/bold-vector-aulia', smooth: true}));
  if (!sb) return {durationInFrames: FPS * 3, props: {storyboard: null, words: [], availableProps: [], pixel, bold}};
  const words = (await getJson<Word[]>(`video/${sb.words ?? 'tts/words.json'}`)) ?? [];
  const audioSec = await getAudioDurationInSeconds(staticFile(`video/${sb.audio ?? 'tts/final.mp3'}`));
  const names = propNames(sb);
  const ok = await Promise.all(names.map((n) => exists(`shared/props/${n}.png`)));
  const availableProps = names.filter((_, i) => ok[i]);
  const missing = names.filter((_, i) => !ok[i]);
  if (missing.length) console.warn(`[video-karakter] props belum ada (pakai placeholder): ${missing.join(', ')}`);
  return {
    durationInFrames: Math.ceil((audioSec + (sb.tail ?? 1.2)) * FPS),
    props: {storyboard: sb, words, availableProps, pixel, bold},
  };
};

export const Root: React.FC = () => (
  <>
  <Composition id="ComicTest" component={ComicTest} width={1080} height={1920} fps={FPS} durationInFrames={COMIC_FRAMES} />
  <Composition
    id="Video"
    component={Video}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={FPS * 3}
    defaultProps={{storyboard: null, words: [], availableProps: [], pixel: []} as VideoProps}
    calculateMetadata={calculateMetadata}
  />
  </>
);
