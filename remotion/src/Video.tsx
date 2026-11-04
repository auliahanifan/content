import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BoardFrame} from './components/BoardFrame';
import {Brand} from './components/Brand';
import {Captions} from './components/Captions';
import {Character, type AuraEvent} from './components/Character';
import {EpicLayer, epicLevel} from './components/Epic';
import {fmt, Hud} from './components/Hud';
import {Dust, FxLayer, LootLayer, Pops, Stickers} from './components/Juice';
import {World} from './world/World';
import {Kanvas, isKanvas} from './kanvas/Kanvas';
import {SceneTransition} from './components/Transition';
import {EPIC_CAPTIONS, GEO} from './layout';
import {C, loadFonts} from './theme';
import {makeTiming, TimingProvider, useTiming} from './timing';
import type {Layout, MapName, Mood, PixelAsset, Pop, SfxName, Storyboard, VideoProps} from './types';
import type {Box} from './layout';

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
      {isKanvas(storyboard) ? (
        <Kanvas sb={storyboard} fps={fps} duration={durationInFrames} pixel={pixel} />
      ) : (
        <Inner sb={storyboard} fps={fps} duration={durationInFrames} pixel={pixel} />
      )}
    </TimingProvider>
  );
};

const Inner: React.FC<{sb: Storyboard; fps: number; duration: number; pixel: PixelAsset[]}> = ({sb, fps, duration, pixel}) => {
  const frame = useCurrentFrame();
  const {T, E} = useTiming();
  const assets = useMemo(() => new Map(pixel.map((a) => [a.id, a])), [pixel]);

  const scenes = useMemo(
    () =>
      (sb.scenes ?? []).map((s, i) => {
        const start = i === 0 ? 0 : Math.max(0, T(s.at) - 3);
        const next = (sb.scenes ?? [])[i + 1];
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
        // epik boleh melewati pergantian adegan; transisi adegan itu dilewati (epik jadi transisinya)
        return {e, start, end: start + Math.round((e.dur ?? 1.3) * fps)};
      }),
    [sb, T, fps],
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
  const auras = useMemo<AuraEvent[]>(
    () =>
      (sb.aura ?? []).flatMap((a) => {
        const asset = assets.get(a.effect);
        if (!asset) return [];
        const start = T(a.at) - 1;
        return [{start, end: start + Math.round((a.dur ?? 1.5) * fps), asset, scale: a.scale ?? 1}];
      }),
    [sb, assets, T, fps],
  );
  const layouts = useMemo(() => scenes.map((x) => ({frame: x.start, layout: x.layout})), [scenes]);
  const maps = useMemo(() => {
    let m: MapName = 'padang';
    return scenes.map((x) => {
      m = x.s.map ?? m;
      return {frame: x.start, map: m};
    });
  }, [scenes]);
  const moods = useMemo(() => {
    const out: {start: number; end: number; mood: Mood}[] = scenes.flatMap((x) => (x.s.mood ? [{start: x.start, end: x.end, mood: x.s.mood}] : []));
    (sb.moods ?? []).forEach((m) => out.push({start: T(m.at) - 1, end: T(m.at) + Math.round((m.dur ?? 1.5) * fps), mood: m.mood}));
    return out.sort((a, b) => b.start - a.start); // yang terbaru menang
  }, [scenes, sb, T, fps]);
  // masuk ulang karakter: eksplisit (enter) atau otomatis saat map berganti (dash bareng kamera)
  const enters = useMemo(
    () =>
      scenes.flatMap((x, i) => {
        const kind = x.s.enter ?? (i > 0 && maps[i].map !== maps[i - 1].map ? 'dash' : undefined);
        return kind ? [{frame: x.start, kind}] : [];
      }),
    [scenes, maps],
  );
  const auto = sb.autoJuice !== false;
  const pops = useMemo<Pop[]>(() => {
    const out = [...(sb.pops ?? [])];
    if (auto && sb.meter) {
      let prevV = 0;
      [...sb.meter.steps].sort((a, b) => a.at - b.at).forEach((st) => {
        const d = st.value - prevV;
        prevV = st.value;
        if (d > 0) out.push({at: st.at, text: `+${sb.meter!.prefix ?? ''}${fmt(d, sb.meter!.short)}`, tone: sb.meter!.tone ?? 'bad', x: 860, y: 330, size: 64});
      });
    }
    return out;
  }, [sb, auto]);

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
  const fxAt = (kind: string, len: number) =>
    (sb.fx ?? []).reduce((acc, f) => {
      const d = frame - T(f.at);
      return f.kind === kind && d >= 0 && d < len ? Math.max(acc, 1 - d / len) : acc;
    }, 0);
  const fxShake = fxAt('shake', 14);
  const fxZoom = fxAt('zoom', 18);
  const fxGlitch = fxAt('glitch', 8);
  const shakeAmp = Math.max(activeEpic ? 22 * Math.max(0, 1 - (frame - activeEpic.start) / 18) : 0, fxShake * 26);
  const shakeX = Math.round((random(`x${frame}`) - 0.5) * shakeAmp);
  const shakeY = Math.round((random(`y${frame}`) - 0.5) * shakeAmp);
  const drift = scenes.reduce((acc, x) => acc + (x.i > 0 ? spring({frame: frame - x.start, fps, config: {damping: 20}}) * 70 : 0), 0);

  const sfx = useMemo(() => collectSfx(sb, scenes.map((x) => x.start), T, epics), [sb, scenes, T, epics]);
  const audio = `video/${sb.audio ?? 'tts/final.mp3'}`;
  const capBox = epicLvl > 0.5 ? EPIC_CAPTIONS : GEO[cur.layout].captions;
  const boardBox = (layout: Layout, size?: 'full' | 'sm'): Box => {
    const b = GEO[layout].board;
    return size === 'sm' ? {left: b.left + 110, top: b.top + 20, width: b.width - 220, height: Math.round(b.height * 0.78)} : b;
  };
  const ch = GEO[cur.layout].char;
  // logo putih di map gelap (kota, dungeon), berganti saat dash
  const DARK_MAPS = new Set<MapName>(['kota', 'dungeon']);
  const mapDark = (() => {
    let mi = 0;
    maps.forEach((m, i) => m.frame <= frame && (mi = i));
    const now = DARK_MAPS.has(maps[mi].map) ? 1 : 0;
    const before = mi > 0 && DARK_MAPS.has(maps[mi - 1].map) ? 1 : 0;
    return interpolate(frame, [maps[mi].frame, maps[mi].frame + 12], [before, now], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  })();
  const lootTarget = {x: ch.cx + (ch.flip ? -60 : 60), y: ch.base - ch.h * 0.55};
  const gx = fxGlitch ? Math.round((random(`gl${frame}`) - 0.5) * 40 * fxGlitch) : 0;

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.ink}}>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX + gx}px, ${shakeY}px)`,
          filter: fxGlitch ? `drop-shadow(${10 * fxGlitch}px 0 0 rgba(255,40,90,0.75)) drop-shadow(${-10 * fxGlitch}px 0 0 rgba(40,230,255,0.75))` : undefined,
        }}
      >
        <World maps={maps} moods={moods} night={night} drift={drift} />
        <AbsoluteFill style={{transform: `scale(${kb + punch + fxZoom * 0.08})`, transformOrigin: '50% 45%'}}>
          {scenes
            .filter((x) => frame >= x.start && frame < x.end)
            .map((x) => (
              <BoardFrame key={x.i} scene={x.s} start={x.start} box={boardBox(x.layout, x.s.size)} dim={dim} hidden={epicLvl} />
            ))}
          <Character changes={changes} layouts={layouts} assets={assets} hidden={epicLvl} auras={auras} enters={enters} />
          {auto &&
            scenes.map((x) => {
              const g = GEO[x.layout].char;
              return <Dust key={`d${x.i}`} x={g.cx} y={g.base - 20} d={frame - x.start - (enters.some((e) => e.frame === x.start) ? 8 : 0)} />;
            })}
          <Stickers stickers={sb.stickers ?? []} />
          <LootLayer loot={sb.loot ?? []} target={lootTarget} />
          <Pops pops={pops} origin={{x: ch.cx, y: ch.base - ch.h - 30}} />
          <FxLayer
            origin={{x: ch.cx, y: ch.base - ch.h - 40}}
            fx={[
              ...(sb.fx ?? []),
              ...(auto ? (sb.punch ?? []).map((i) => ({at: i, kind: 'burst' as const, tone: 'sun' as const})) : []),
            ]}
          />
        </AbsoluteFill>
        {epics.map((x, i) => {
          const a = assets.get(x.e.reaction);
          return a ? <EpicLayer key={i} e={x.e} start={x.start} end={x.end} asset={a} /> : null;
        })}
      </AbsoluteFill>
      {scenes.slice(1).map((x) => {
        const underEpic = epics.some((ep) => x.start >= ep.start && x.start <= ep.end + 4);
        return <SceneTransition key={x.i} at={x.start} kind={underEpic ? 'none' : x.transition} />;
      })}
      <Captions box={capBox} size={capBox.width > 800 ? 70 : 64} />
      <Brand dark={Math.max(night, mapDark)} />
      <Hud dim={Math.max(dim, epicLvl)} />
      <Html5Audio src={staticFile(audio)} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.frame)} durationInFrames={Math.round(fps * 1.2)} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.name}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const VOL: Record<SfxName, number> = {
  blip: 0.3, coin: 0.3, power: 0.35, hit: 0.45, select: 0.3, sweep: 0.4, boom: 0.6,
  dash: 0.4, pickup: 0.35, damage: 0.45, glitch: 0.35, levelup: 0.4, pop: 0.3,
};

/** SFX 8-bit otomatis: sweep ganti adegan, blip elemen muncul, coin angka/sorot, hit coretan, select dialog, boom epik. */
const collectSfx = (sb: Storyboard, starts: number[], T: (i: number) => number, epics: {e: {sfx?: SfxName}; start: number}[]) => {
  const ev: {frame: number; name: SfxName; volume: number}[] = [];
  const add = (frame: number, name: SfxName, volume?: number) => ev.push({frame, name, volume: volume ?? VOL[name]});
  if (sb.autoSfx !== false) {
    let map = 'padang';
    (sb.scenes ?? []).forEach((s, i) => {
      const changed = i > 0 && s.map !== undefined && s.map !== map;
      map = s.map ?? map;
      if (s.sfx !== null && i > 0) add(starts[i] - 6, s.sfx ?? (changed || s.enter === 'dash' ? 'dash' : 'sweep'));
      if (s.enter === 'beam') add(starts[i], 'power');
      const b = s.board as {
        type: string;
        at?: number;
        items?: {at?: number; strikeAt?: number; flagAt?: number; flag?: string}[];
        total?: {at?: number; strikeAt?: number; flagAt?: number; flag?: string};
        rings?: {at: number}[];
        left?: {at?: number; strikeAt?: number};
        right?: {at?: number; strikeAt?: number};
        stamp?: {at: number};
        buttonAt?: number;
        hits?: {at: number}[];
        defeatAt?: number;
      };
      b.hits?.forEach((h) => add(T(h.at), 'damage'));
      if (b.defeatAt !== undefined) add(T(b.defeatAt), 'levelup');
      const items = [...(b.items ?? []), ...(b.total ? [b.total] : []), ...(b.left ? [b.left] : []), ...(b.right ? [b.right] : [])];
      const numeric = b.type === 'stat' || b.type === 'counts';
      items.forEach((it) => {
        if (it.at !== undefined && it.at !== s.at) add(T(it.at), numeric ? 'coin' : 'blip');
        if (it.strikeAt !== undefined) add(T(it.strikeAt), 'hit');
      });
      b.rings?.forEach((r) => add(T(r.at), 'coin'));
      (b.items ?? []).forEach((it) => it.flag && add(T(it.flagAt ?? it.at ?? s.at), 'hit'));
      if (b.stamp) add(T(b.stamp.at), 'hit', 0.55);
      if (b.buttonAt !== undefined) add(T(b.buttonAt), 'select');
      if (b.type === 'word') add(T(b.at ?? s.at), 'power');
      if (s.footer) add(T(s.footer.at), 'select');
    });
    epics.forEach((x) => add(x.start, x.e.sfx ?? 'boom'));
    sb.meter?.steps.forEach((st) => add(T(st.at), 'coin'));
    sb.pops?.forEach((p) => add(T(p.at), p.tone === 'good' || p.tone === 'sun' ? 'coin' : 'damage'));
    sb.stickers?.forEach((st) => add(T(st.at), 'pop'));
    sb.loot?.forEach((l) => {
      add(T(l.at), 'blip');
      add(T(l.at) + 16, 'pickup');
    });
    sb.fx?.forEach((f) => add(T(f.at), f.kind === 'glitch' ? 'glitch' : f.kind === 'burst' ? 'power' : 'hit', f.kind === 'zoom' ? 0.25 : undefined));
    if (sb.loop) add(T(sb.loop.until), 'power');
    sb.aura?.forEach((a) => a.sfx !== null && add(T(a.at) - 1, a.sfx ?? 'power'));
  }
  sb.sfx?.forEach((x) => add(T(x.at), x.name, x.volume));
  ev.sort((a, b) => a.frame - b.frame);
  return ev.filter((e, i) => !ev.slice(0, i).some((p) => p.name === e.name && e.frame - p.frame < 3));
};
