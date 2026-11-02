import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './components/Background';
import {BoardFrame, EXIT} from './components/BoardFrame';
import {Brand} from './components/Brand';
import {Captions} from './components/Captions';
import {Character} from './components/Character';
import {C, loadFonts} from './theme';
import {makeTiming, TimingProvider, useTiming} from './timing';
import type {Pose, SfxName, Storyboard, VideoProps} from './types';

loadFonts();

const HUES = [C.accent, C.sky, C.good, C.lilac, C.warn];

export const Video: React.FC<VideoProps> = ({storyboard, words, availableProps}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const timing = useMemo(
    () => (storyboard ? makeTiming(words, storyboard, fps, availableProps) : null),
    [words, storyboard, fps, availableProps],
  );
  if (!storyboard || !timing || words.length === 0) {
    return (
      <AbsoluteFill style={{background: C.bg, alignItems: 'center', justifyContent: 'center', fontSize: 48, padding: 80, textAlign: 'center'}}>
        Belum ada video aktif. Jalankan: pnpm studio ../dates/&lt;tanggal&gt;/&lt;slug&gt;
      </AbsoluteFill>
    );
  }
  return (
    <TimingProvider value={timing}>
      <Inner sb={storyboard} fps={fps} duration={durationInFrames} />
    </TimingProvider>
  );
};

const Inner: React.FC<{sb: Storyboard; fps: number; duration: number}> = ({sb, fps, duration}) => {
  const frame = useCurrentFrame();
  const {T, E} = useTiming();

  const scenes = sb.scenes.map((s, i) => {
    const start = i === 0 ? 0 : Math.max(0, T(s.at) - 3);
    const next = sb.scenes[i + 1];
    const end = next ? Math.max(0, T(next.at) - 3) : duration;
    return {s, start, end, i};
  });
  const cur = scenes.find((x) => frame >= x.start && frame < x.end) ?? scenes[scenes.length - 1];

  // penutup gelap: transisi warna 12 frame
  const darkTarget = (x: (typeof scenes)[number]) => (x.s.dark ? 1 : 0);
  const prev = scenes[cur.i - 1];
  const dark = interpolate(frame, [cur.start, cur.start + 12], [prev ? darkTarget(prev) : 0, darkTarget(cur)], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // perubahan pose
  const changes = useMemo(() => {
    const out: {frame: number; pose: Pose}[] = [];
    scenes.forEach(({s, start}) => {
      if (s.pose) out.push({frame: start, pose: s.pose});
      s.poses?.forEach((p) => out.push({frame: T(p.at), pose: p.pose}));
    });
    if (!out.length || out[0].frame > 0) out.unshift({frame: 0, pose: 'menjelaskan'});
    return out.sort((a, b) => a.frame - b.frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sb]);

  // seriesLine meredupkan papan
  let dim = 0;
  if (sb.seriesLine) {
    dim = interpolate(frame, [T(sb.seriesLine.from), T(sb.seriesLine.from) + 8, E(sb.seriesLine.to) + 4, E(sb.seriesLine.to) + 14], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  const sfx = useMemo(() => collectSfx(sb, scenes.map((x) => x.start), T), [sb]); // eslint-disable-line react-hooks/exhaustive-deps
  const audio = `video/${sb.audio ?? 'tts/final.mp3'}`;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Background dark={dark} hue={HUES[cur.i % HUES.length]} />
      {scenes
        .filter((x) => frame >= x.start && frame < x.end)
        .map((x) => (
          <BoardFrame key={x.i} scene={x.s} start={x.start} end={x.end} dim={dim} index={x.i} />
        ))}
      <Character changes={changes} audio={audio} />
      <Captions dark={dark} />
      <Brand dark={dark} />
      <Html5Audio src={staticFile(audio)} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={s.frame} durationInFrames={Math.round(fps * 1.2)} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.name}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const VOL: Record<SfxName, number> = {pop: 0.35, swipe: 0.45, thud: 0.5, ding: 0.4, warn: 0.4};

/** SFX otomatis: swipe saat ganti adegan, pop saat elemen muncul, thud saat coretan, ding saat footer. */
const collectSfx = (sb: Storyboard, starts: number[], T: (i: number) => number) => {
  const ev: {frame: number; name: SfxName; volume: number}[] = [];
  const add = (frame: number, name: SfxName, volume?: number) => ev.push({frame, name, volume: volume ?? VOL[name]});
  if (sb.autoSfx !== false) {
    sb.scenes.forEach((s, i) => {
      if (s.sfx !== null && i > 0) add(starts[i], s.sfx ?? 'swipe');
      const b = s.board as {items?: {at?: number; strikeAt?: number; subAt?: number}[]; rings?: {at: number}[]; left?: {at?: number; strikeAt?: number}; right?: {at?: number; strikeAt?: number}};
      const items = [...(b.items ?? []), ...(b.left ? [b.left] : []), ...(b.right ? [b.right] : [])];
      items.forEach((it) => {
        if (it.at !== undefined && it.at !== s.at) add(T(it.at), 'pop');
        if (it.strikeAt !== undefined) add(T(it.strikeAt), 'thud');
      });
      b.rings?.forEach((r) => add(T(r.at), 'pop'));
      if (s.footer) add(T(s.footer.at), 'ding');
    });
  }
  sb.sfx?.forEach((x) => add(T(x.at), x.name, x.volume));
  // buang duplikat yang terlalu rapat (< 3 frame, nama sama)
  ev.sort((a, b) => a.frame - b.frame);
  return ev.filter((e, i) => !ev.slice(0, i).some((p) => p.name === e.name && e.frame - p.frame < 3));
};
