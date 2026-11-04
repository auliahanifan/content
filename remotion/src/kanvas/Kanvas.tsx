import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PixelFigure} from '../components/Character';
import {EpicLayer, epicLevel} from '../components/Epic';
import {tokens} from '../components/Captions';
import {FONT_BODY} from '../theme';
import {useTiming} from '../timing';
import type {KChar, KEl, KLine, PixelAsset, SfxName, Storyboard} from '../types';
import {VOL} from '../Video';
import {Element} from './Elements';
import {K, KGEO} from './theme';

export const isKanvas = (sb: Storyboard) => (sb.style ? sb.style === 'kanvas' : !!sb.panels);

type Props = {sb: Storyboard; fps: number; duration: number; pixel: PixelAsset[]};

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');

/**
 * Mode kanvas: satu latar mist bergrid titik sepanjang video, header (logo seri + chip topik + tanda tangan),
 * headline dua tingkat di atas (pengganti caption), satu panggung yang isinya tumbuh, Pixel Aulia diam di samping.
 * Prinsip: yang berubah di layar adalah isi penjelasan, bukan dekorasi.
 */
export const Kanvas: React.FC<Props> = ({sb, fps, duration, pixel}) => {
  const frame = useCurrentFrame();
  const {T, E} = useTiming();
  const assets = useMemo(() => new Map(pixel.map((a) => [a.id, a])), [pixel]);
  const panels = useMemo(() => {
    let char: KChar = 'left';
    const list = sb.panels ?? [];
    return list.map((p, i) => {
      char = p.char ?? char;
      const start = i === 0 ? 0 : Math.max(0, T(p.at) - 3);
      const end = list[i + 1] ? Math.max(0, T(list[i + 1].at) - 3) : duration;
      return {p, i, start, end, char};
    });
  }, [sb, T, duration]);
  const cur = panels.find((x) => frame >= x.start && frame < x.end) ?? panels[panels.length - 1];

  const epics = useMemo(
    () =>
      (sb.epic ?? []).map((e) => {
        const start = T(e.at) - 1;
        return {e, start, end: start + Math.round((e.dur ?? 1.3) * fps)};
      }),
    [sb, T, fps],
  );
  const epicLvl = Math.max(0, ...epics.map((x) => epicLevel(frame, x.start, x.end)));

  let dim = 0;
  if (sb.seriesLine) {
    dim = interpolate(frame, [T(sb.seriesLine.from), T(sb.seriesLine.from) + 8, E(sb.seriesLine.to) + 4, E(sb.seriesLine.to) + 14], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  const hide = Math.max(epicLvl, dim);
  const sfx = useMemo(() => kanvasSfx(sb, panels.map((x) => x.start), T, epics.map((x) => x.start)), [sb, panels, T, epics]);

  return (
    <AbsoluteFill style={{background: K.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: `radial-gradient(${K.dot} 2.4px, transparent 2.6px)`, backgroundSize: '44px 44px', backgroundPosition: '22px 22px'}} />
      <Header topic={latestTopic(sb, panels, frame)} />
      <Headline />
      <AbsoluteFill style={{opacity: 1 - hide}}>
        {panels
          .filter((x) => frame >= x.start - 1 && frame < x.end + 6)
          .map((x) => (
            <Panel key={x.i} x={x} />
          ))}
        <KChar panels={panels} assets={assets} />
      </AbsoluteFill>
      {sb.seriesLine && dim > 0 && <SeriesBig dim={dim} />}
      {epics.map((x, i) => {
        const a = assets.get(x.e.reaction);
        return a ? <EpicLayer key={i} e={x.e} start={x.start} end={x.end} asset={a} /> : null;
      })}
      <Html5Audio src={staticFile(`video/${sb.audio ?? 'tts/final.mp3'}`)} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.frame)} durationInFrames={Math.round(fps * 1.2)} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.name}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const latestTopic = (sb: Storyboard, panels: {p: {topic?: string}; start: number}[], frame: number) => {
  let t = sb.topic;
  panels.forEach((x) => x.start <= frame && x.p.topic && (t = x.p.topic));
  return t;
};

/* ---------- header ---------- */

const Header: React.FC<{topic?: string}> = ({topic}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sb, T} = useTiming();
  const g = KGEO.header;
  const enter = spring({frame, fps, config: {damping: 200}});
  // janji (open loop): chip berubah jadi hitung mundur + garis progres di dasar header, lalu "Ini dia" saat dibayar
  const loop = sb.loop;
  let chip = topic ?? '';
  let chipBg: string = K.ink;
  let prog = -1;
  if (loop) {
    const a = T(loop.from ?? 0);
    const b = T(loop.until);
    if (frame >= a && frame < b) {
      chip = `${loop.text} · ${Math.ceil((b - frame) / fps)} dtk`;
      chipBg = K.accent;
      prog = (frame - a) / Math.max(1, b - a);
    } else if (frame >= b && frame < b + fps * 1.6) {
      chip = loop.done ?? 'Ini dia 👇';
      chipBg = K.good;
      prog = 1;
    }
  }
  const fill = prog >= 0 ? `linear-gradient(90deg, ${chipBg} ${prog * 100}%, ${K.ink} ${prog * 100}%)` : chipBg;
  return (
    <div
      style={{
        position: 'absolute',
        left: g.left,
        top: g.top,
        width: g.width,
        height: g.height,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -20}px)`,
      }}
    >
      <Img src={staticFile(`shared/${sb.series}.svg`)} style={{width: g.height * 1.15, height: g.height, objectFit: 'contain', objectPosition: 'left center'}} />
      <div style={{flex: 1}} />
      {chip && (
        <div style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: 30, color: K.card, background: fill, borderRadius: 999, padding: '14px 28px', whiteSpace: 'nowrap', maxWidth: 600, overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 6px 18px rgba(27,31,59,0.12)'}}>
          {chip}
        </div>
      )}
      <Img src={staticFile('shared/logo-signature-black.svg')} style={{height: 64, width: 120, objectFit: 'contain', objectPosition: 'right center'}} />
    </div>
  );
};

/* ---------- headline dua tingkat ---------- */

type Built = {from: number; to: number; split: number; setup: string; punch: {text: string; key: boolean}[]; punchOverride?: string};

const buildLines = (lines: KLine[], toks: ReturnType<typeof tokens>, keyIdx: Set<number>): Built[] =>
  lines.map((l, i) => {
    const to = l.to ?? (lines[i + 1] ? lines[i + 1].from - 1 : toks[toks.length - 1].last);
    const mine = toks.filter((t) => t.first >= l.from && t.first <= to);
    const n = mine.length;
    const split = l.split ?? (n <= 3 ? l.from : mine[n - Math.min(5, Math.ceil(n * 0.5))].first);
    const setupToks = mine.filter((t) => t.first < split);
    const punchToks = mine.filter((t) => t.first >= split);
    const keys = new Set([...(l.key ?? []), ...keyIdx]);
    // baris pengantar dibatasi 9 kata terakhir agar tidak jadi paragraf
    const st = setupToks.length > 9 ? setupToks.slice(-9) : setupToks;
    let setup = l.setup ?? `${setupToks.length > 9 ? '...' : ''}${st.map((t) => t.text).join(' ')}`;
    if (setup && !/[.,?!:;…]$/.test(setup)) setup += '...';
    return {
      from: l.from,
      to,
      split,
      setup,
      punch: punchToks.map((t) => ({text: t.text, key: keys.has(t.first)})),
      punchOverride: l.punch,
    };
  });

/** `*kata*` di override punch = kata aksen. */
const parsePunch = (s: string) => s.split(/(\*[^*]+\*)/g).filter(Boolean).flatMap((part) => (part.startsWith('*') ? [{text: part.slice(1, -1), key: true}] : [{text: part.trim(), key: false}].filter((x) => x.text)));

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sb, words, T, E} = useTiming();
  const built = useMemo(() => {
    const toks = tokens(words, sb);
    const texts = new Set((sb.keywords ?? []).filter((k): k is string => typeof k === 'string').map(clean));
    const keyIdx = new Set<number>();
    (sb.keywords ?? []).forEach((k) => typeof k === 'number' && keyIdx.add(k));
    words.forEach((w, i) => texts.has(clean(w[0])) && keyIdx.add(i));
    return buildLines(sb.lines ?? [], toks, keyIdx);
  }, [sb, words]);
  const g = KGEO.headline;
  let li = -1;
  built.forEach((b, i) => frame >= T(b.from) - 2 && (li = i));
  const b = built[li];
  if (!b) return null;
  // baris terakhir hilang 0,6 dtk setelah kata terakhirnya bila tidak ada baris lanjutan
  const fadeOut = li === built.length - 1 ? interpolate(frame, [E(b.to) + fps * 0.6, E(b.to) + fps * 0.6 + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const sIn = spring({frame: frame - (T(b.from) - 2), fps, config: {damping: 200, stiffness: 200}});
  const pStart = T(b.split) - 2;
  const pIn = spring({frame: frame - pStart, fps, config: {damping: 14, stiffness: 210, mass: 0.6}});
  const punch = b.punchOverride ? parsePunch(b.punchOverride) : b.punch;
  const len = punch.map((p) => p.text).join(' ').length;
  const size = len > 40 ? 58 : len > 30 ? 68 : len > 20 ? 80 : 94;
  return (
    <div
      style={{
        position: 'absolute',
        left: g.left,
        top: g.top,
        width: g.width,
        height: g.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        fontFamily: FONT_BODY,
        textAlign: 'center',
        opacity: fadeOut,
      }}
    >
      <div style={{fontSize: 46, fontWeight: 600, color: K.soft, lineHeight: 1.25, minHeight: 58, opacity: sIn, transform: `translateY(${(1 - sIn) * 14}px)`}}>{b.setup}</div>
      {frame >= pStart && (
        <div style={{fontSize: size, fontWeight: 800, color: K.ink, lineHeight: 1.12, letterSpacing: -0.5, opacity: Math.min(1, pIn * 1.5), transform: `scale(${0.9 + 0.1 * pIn})`, textWrap: 'balance', maxWidth: g.width}}>
          {punch.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && ' '}
              <span style={p.key ? {color: K.accent, textDecoration: 'underline dotted', textDecorationThickness: 6, textUnderlineOffset: 14, textDecorationColor: K.accent} : undefined}>{p.text}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- panggung ---------- */

const Panel: React.FC<{x: {p: NonNullable<Storyboard['panels']>[number]; start: number; end: number; char: KChar}}> = ({x}) => {
  const frame = useCurrentFrame();
  const g = KGEO.stage[x.char];
  const first = x.start === 0;
  const inP = first ? 1 : interpolate(frame, [x.start, x.start + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outP = interpolate(frame, [x.end, x.end + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: g.left,
        top: g.top,
        width: g.width,
        height: g.height,
        display: 'flex',
        flexDirection: x.p.layout === 'row' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: x.p.gap ?? 34,
        opacity: inP * (1 - outP),
        transform: `translateY(${(1 - inP) * 40 - outP * 40}px)`,
      }}
    >
      {x.p.items.map((el: KEl, i: number) => (
        <div key={i} style={{zoom: x.p.zoom ?? 1, maxWidth: '100%'}}>
          <Element el={el} panelStart={x.start} stageW={g.width / (x.p.zoom ?? 1)} />
        </div>
      ))}
    </div>
  );
};

/* ---------- karakter ---------- */

const KChar: React.FC<{panels: {p: {pose?: string}; start: number; char: KChar}[]; assets: Map<string, PixelAsset>}> = ({panels, assets}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sb, T} = useTiming();
  const changes = useMemo(() => {
    const out: {frame: number; pose: string}[] = [];
    panels.forEach((x) => x.p.pose && out.push({frame: x.start, pose: x.p.pose}));
    (sb.poses ?? []).forEach((p) => out.push({frame: T(p.at), pose: p.pose}));
    if (!out.length || out[0].frame > 0) out.unshift({frame: 0, pose: 'menunjuk'});
    return out.sort((a, b) => a.frame - b.frame);
  }, [panels, sb, T]);
  let ci = 0;
  changes.forEach((c, i) => c.frame <= frame && (ci = i));
  const pose = changes[ci];
  const prevPose = changes[ci - 1];
  const fade = prevPose ? interpolate(frame - pose.frame, [0, 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;

  let pi = 0;
  panels.forEach((x, i) => x.start <= frame && (pi = i));
  const from = KGEO.char[panels[Math.max(0, pi - 1)]?.char ?? 'left'];
  const to = KGEO.char[panels[pi]?.char ?? 'left'];
  const m = pi === 0 ? 1 : spring({frame: frame - panels[pi].start, fps, config: {damping: 200, stiffness: 120}});
  const cx = interpolate(m, [0, 1], [from.cx, to.cx]);
  const base = interpolate(m, [0, 1], [from.base, to.base]);
  const h = interpolate(m, [0, 1], [from.h, to.h]);
  const flip = (m < 0.5 ? panels[Math.max(0, pi - 1)]?.char : panels[pi]?.char) === 'right';
  const enter = spring({frame: frame - 4, fps, config: {damping: 200, stiffness: 110}});
  const asset = assets.get(pose.pose) ?? assets.get('netral');
  const prevAsset = prevPose ? assets.get(prevPose.pose) : undefined;
  if (!asset) return null;
  return (
    <div style={{position: 'absolute', left: cx, top: base, width: 0, height: 0, opacity: enter}}>
      <div style={{position: 'absolute', left: -h * 0.22, top: -h * 0.03, width: h * 0.44, height: h * 0.06, borderRadius: '50%', background: 'rgba(27,31,59,0.12)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `scaleX(${flip ? -1 : 1})`}}>
        {prevAsset && fade < 1 && <PixelFigure asset={prevAsset} h={h} opacity={1 - fade} />}
        <PixelFigure asset={asset} h={h} opacity={fade} />
      </div>
    </div>
  );
};

/* ---------- kalimat khas seri ---------- */

const SeriesBig: React.FC<{dim: number}> = ({dim}) => {
  const {sb} = useTiming();
  return (
    <div style={{position: 'absolute', left: 140, top: 640, width: 800, height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: dim, transform: `scale(${0.85 + 0.15 * dim})`}}>
      <Img src={staticFile(`shared/${sb.series}.svg`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
    </div>
  );
};

/* ---------- SFX pelan otomatis ---------- */

const walk = (els: KEl[], f: (e: KEl) => void) =>
  els.forEach((e) => {
    f(e);
    if (e.kind === 'row') walk(e.items, f);
  });

const kanvasSfx = (sb: Storyboard, starts: number[], T: (i: number) => number, epicStarts: number[]) => {
  const ev: {frame: number; name: SfxName; volume: number}[] = [];
  const add = (frame: number, name: SfxName, k = 0.55) => ev.push({frame, name, volume: VOL[name] * k});
  if (sb.autoSfx !== false) {
    (sb.panels ?? []).forEach((p, i) => {
      if (i > 0 && p.sfx !== null) add(starts[i] - 4, p.sfx ?? 'sweep', 0.45);
      walk(p.items, (e) => {
        if (e.at !== undefined && e.kind !== 'row') add(T(e.at), 'blip');
        if (e.kind === 'card') {
          if (e.strikeAt !== undefined) add(T(e.strikeAt), 'hit');
          if (e.swap) add(T(e.swap.at), 'coin', 0.8);
          if (e.stamp) add(T(e.stamp.at), 'hit', 1);
        }
        if (e.kind === 'checklist') e.items.forEach((it) => {
          if (it.at !== undefined) add(T(it.at), 'blip', 0.4);
          if (it.doneAt !== undefined) add(T(it.doneAt), 'select', 0.7);
          if (it.strikeAt !== undefined) add(T(it.strikeAt), 'hit');
        });
        if (e.kind === 'flow') e.items.forEach((it) => it.at !== undefined && add(T(it.at), 'blip', 0.45));
        if (e.kind === 'stepper' || (e.kind === 'phone' && e.steps)) (e.kind === 'stepper' ? e.items : e.steps ?? []).forEach((s) => add(T(s.at), 'select', 0.6));
        if ((e.kind === 'shot' || e.kind === 'phone') && e.rings) e.rings.forEach((r) => add(T(r.at), 'coin', 0.5));
      });
    });
    epicStarts.forEach((s) => add(s, 'boom', 0.8));
    if (sb.loop) add(T(sb.loop.until), 'power', 0.7);
  }
  sb.sfx?.forEach((x) => ev.push({frame: T(x.at), name: x.name, volume: x.volume ?? VOL[x.name]}));
  ev.sort((a, b) => a.frame - b.frame);
  return ev.filter((e, i) => !ev.slice(0, i).some((p) => p.name === e.name && e.frame - p.frame < 4));
};
