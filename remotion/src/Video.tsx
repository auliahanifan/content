import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './components/Background';
import {BoardFrame} from './components/BoardFrame';
import {Brand} from './components/Brand';
import {Captions} from './components/Captions';
import {Character} from './components/Character';
import {EpicLayer, epicLevel} from './components/Epic';
import {SceneTransition} from './components/Transition';
import {EPIC_CAPTIONS, GEO} from './layout';
import {C, loadFonts} from './theme';
import {makeTiming, TimingProvider, useTiming} from './timing';
import type {Layout, PixelAsset, SfxName, Storyboard, VideoProps} from './types';

loadFonts();

export const Video: React.FC<VideoProps> = ({storyboard, words, availableProps, pixel}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const timing = useMemo(
    () => (storyboard ? makeTiming(words, storyboard, fps, availableProps) : null),
    [words, storyboard, fps, availableProps],
  );
  if (!storyboard || !timing) {
    return (
      <AbsoluteFill style={{background: C.paper, alignItems: 'center', justifyContent: 'center', fontSize: 48, padding: 80, textAlign: 'center'}}>
        Belum ada video aktif. Jalankan: pnpm studio ../dates/&lt;tanggal&gt;/&lt;slug&gt;
      </AbsoluteFill>
    );
  }
  return (
    <TimingProvider value={timing}>
      <Inner sb={storyboard} fps={fps} duration={durationInFrames} pixel={pixel} />
    </TimingProvider>
  );
};

const Inner: React.FC<{sb: Storyboard; fps: number; duration: number; pixel: PixelAsset[]}> = ({sb, fps, duration, pixel}) => {
  const frame = useCurrentFrame();
  const {T, E} = useTiming();
  const assets = useMemo(() => new Map(pixel.map((a) => [a.id, a])), [pixel]);

  const scenes = useMemo(
    () =>
      sb.scenes.map((s, i) => {
        const start = i === 0 ? 0 : Math.max(0, T(s.at) - 3);
        const next = sb.scenes[i + 1];
        const end = next ? Math.max(0, T(next.at) - 3) : duration;
        const layout: Layout = s.layout ?? (i % 2 ? 'right' : 'left');
        const transition = s.transition ?? (i % 2 ? 'pixel' : 'iris');
        return {s, start, end, i, layout, transition};
      }),
    [sb, duration, T],
  );
  const cur = scenes.find((x) => frame >= x.start && frame < x.end) ?? scenes[scenes.length - 1];

  const epics = useMemo(
    () =>
      (sb.epic ?? []).map((e) => {
        const start = T(e.at) - 1;
        // selesai sebelum transisi adegan berikutnya mulai menutup layar
        const next = scenes.find((x) => x.start > start);
        const cap = next ? next.start - 8 : Infinity;
        return {e, start, end: Math.min(start + Math.round((e.dur ?? 1.3) * fps), cap)};
      }),
    [sb, T, fps, scenes],
  );
  const epicLvl = Math.max(0, ...epics.map((x) => epicLevel(frame, x.start, x.end)));
  const activeEpic = epics.find((x) => frame >= x.start - 1 && frame <= x.end);

  // malam: adegan dark (transisi 12 frame) atau interupsi epik
  const prev = scenes[cur.i - 1];
  const darkScene = interpolate(frame, [cur.start, cur.start + 12], [prev?.s.dark ? 1 : 0, cur.s.dark ? 1 : 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const night = Math.max(darkScene, epicLvl);

  const changes = useMemo(() => {
    const out: {frame: number; pose: string}[] = [];
    scenes.forEach(({s, start}) => {
      if (s.pose) out.push({frame: start, pose: s.pose});
      s.poses?.forEach((p) => out.push({frame: T(p.at), pose: p.pose}));
    });
    if (!out.length || out[0].frame > 0) out.unshift({frame: 0, pose: 'netral'});
    return out.sort((a, b) => a.frame - b.frame);
  }, [scenes, T]);
  const layouts = useMemo(() => scenes.map((x) => ({frame: x.start, layout: x.layout})), [scenes]);

  let dim = 0;
  if (sb.seriesLine) {
    dim = interpolate(frame, [T(sb.seriesLine.from), T(sb.seriesLine.from) + 8, E(sb.seriesLine.to) + 4, E(sb.seriesLine.to) + 14], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // kamera: zoom pelan per adegan + punch-in pada kata + shake saat epik
  const kb = interpolate(frame, [cur.start, cur.end], [1, 1.035], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const punch = (sb.punch ?? []).reduce((acc, i) => {
    const d = frame - T(i);
    return d < 0 || d > 20 ? acc : acc + 0.06 * Math.exp(-d / 5);
  }, 0);
  const shakeAmp = activeEpic ? 22 * Math.max(0, 1 - (frame - activeEpic.start) / 18) : 0;
  const shakeX = Math.round((random(`x${frame}`) - 0.5) * shakeAmp);
  const shakeY = Math.round((random(`y${frame}`) - 0.5) * shakeAmp);
  const drift = scenes.reduce((acc, x) => acc + (x.i > 0 ? spring({frame: frame - x.start, fps, config: {damping: 20}}) * 70 : 0), 0);

  const sfx = useMemo(() => collectSfx(sb, scenes.map((x) => x.start), T, epics), [sb, scenes, T, epics]);
  const audio = `video/${sb.audio ?? 'tts/final.mp3'}`;
  const capBox = epicLvl > 0.5 ? EPIC_CAPTIONS : GEO[cur.layout].captions;

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.ink}}>
      <AbsoluteFill style={{transform: `translate(${shakeX}px, ${shakeY}px)`}}>
        <Background night={night} drift={drift} />
        <AbsoluteFill style={{transform: `scale(${kb + punch})`, transformOrigin: '50% 45%'}}>
          {scenes
            .filter((x) => frame >= x.start && frame < x.end)
            .map((x) => (
              <BoardFrame key={x.i} scene={x.s} start={x.start} box={GEO[x.layout].board} dim={dim} hidden={epicLvl} />
            ))}
          <Character changes={changes} layouts={layouts} assets={assets} audio={audio} hidden={epicLvl} />
        </AbsoluteFill>
        {epics.map((x, i) => {
          const a = assets.get(x.e.reaction);
          return a ? <EpicLayer key={i} e={x.e} start={x.start} end={x.end} asset={a} /> : null;
        })}
      </AbsoluteFill>
      {scenes.slice(1).map((x) => (
        <SceneTransition key={x.i} at={x.start} kind={x.transition} />
      ))}
      <Captions box={capBox} size={capBox.width > 800 ? 70 : 64} />
      <Brand dark={night} />
      <Html5Audio src={staticFile(audio)} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.frame)} durationInFrames={Math.round(fps * 1.2)} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.name}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const VOL: Record<SfxName, number> = {blip: 0.3, coin: 0.3, power: 0.35, hit: 0.45, select: 0.3, sweep: 0.4, boom: 0.6};

/** SFX 8-bit otomatis: sweep ganti adegan, blip elemen muncul, coin angka/sorot, hit coretan, select dialog, boom epik. */
const collectSfx = (sb: Storyboard, starts: number[], T: (i: number) => number, epics: {e: {sfx?: SfxName}; start: number}[]) => {
  const ev: {frame: number; name: SfxName; volume: number}[] = [];
  const add = (frame: number, name: SfxName, volume?: number) => ev.push({frame, name, volume: volume ?? VOL[name]});
  if (sb.autoSfx !== false) {
    sb.scenes.forEach((s, i) => {
      if (s.sfx !== null && i > 0) add(starts[i] - 6, s.sfx ?? 'sweep');
      const b = s.board as {type: string; items?: {at?: number; strikeAt?: number}[]; rings?: {at: number}[]; left?: {at?: number; strikeAt?: number}; right?: {at?: number; strikeAt?: number}};
      const items = [...(b.items ?? []), ...(b.left ? [b.left] : []), ...(b.right ? [b.right] : [])];
      const numeric = b.type === 'stat' || b.type === 'counts';
      items.forEach((it) => {
        if (it.at !== undefined && it.at !== s.at) add(T(it.at), numeric ? 'coin' : 'blip');
        if (it.strikeAt !== undefined) add(T(it.strikeAt), 'hit');
      });
      b.rings?.forEach((r) => add(T(r.at), 'coin'));
      if (s.footer) add(T(s.footer.at), 'select');
    });
    epics.forEach((x) => add(x.start, x.e.sfx ?? 'boom'));
  }
  sb.sfx?.forEach((x) => add(T(x.at), x.name, x.volume));
  ev.sort((a, b) => a.frame - b.frame);
  return ev.filter((e, i) => !ev.slice(0, i).some((p) => p.name === e.name && e.frame - p.frame < 3));
};
