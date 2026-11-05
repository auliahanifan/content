import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PixelFigure} from '../components/Character';
import {EpicLayer, epicLevel} from '../components/Epic';
import {tokens} from '../components/Captions';
import {FONT_BODY} from '../theme';
import {useTiming} from '../timing';
import type {KChar, KEl, KLine, PixelAsset, Storyboard} from '../types';
import {Element} from './Elements';
import {A, bigCard, FIBRE, FONT_HEAD, GRAIN, K, KGEO, loadPaperFonts, setSeries, SHADOW} from './theme';

export const isKanvas = (sb: Storyboard) => (sb.style ? sb.style === 'kanvas' : !!sb.panels);

type Props = {sb: Storyboard; fps: number; duration: number; pixel: PixelAsset[]};

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Frame selesainya hook (teks raksasa), atau 0 bila storyboard tanpa hook. */
const useHookEnd = () => {
  const {sb, E} = useTiming();
  return sb.hook ? E(sb.hook.until) + 6 : 0;
};

/** Indeks kata kunci (dari `keywords` global). */
const useKeyIdx = () => {
  const {sb, words} = useTiming();
  return useMemo(() => {
    const texts = new Set((sb.keywords ?? []).filter((k): k is string => typeof k === 'string').map(clean));
    const set = new Set<number>();
    (sb.keywords ?? []).forEach((k) => typeof k === 'number' && set.add(k));
    words.forEach((w, i) => texts.has(clean(w[0])) && set.add(i));
    return set;
  }, [sb, words]);
};

/**
 * Mode kanvas v3 Paper Cutout: latar kraft berserat, header, headline kinetik Fraunces (pengganti caption), panggung
 * berisi satu elemen dalam satu waktu dengan kamera pelan dan transisi geser, karakter Paper Cutout dengan gerak idle,
 * dan hook kata jatuh di lembar kertas. Prinsip tetap: yang berubah di layar adalah isi penjelasan, bukan dekorasi.
 */
export const Kanvas: React.FC<Props> = ({sb, fps, duration, pixel}) => {
  loadPaperFonts();
  setSeries(sb.series);
  const frame = useCurrentFrame();
  const {T, E} = useTiming();
  const hookEnd = useHookEnd();
  const assets = useMemo(() => new Map(pixel.map((a) => [a.id, a])), [pixel]);
  const panels = useMemo(() => {
    let char: KChar = 'left';
    const list = sb.panels ?? [];
    return list.map((p, i) => {
      char = p.char ?? char;
      const start = i === 0 ? Math.max(0, hookEnd - 6) : Math.max(0, T(p.at) - 3);
      const end = list[i + 1] ? Math.max(0, T(list[i + 1].at) - 3) : duration;
      return {p, i, start, end, char};
    });
  }, [sb, T, duration, hookEnd]);

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
    dim = interpolate(frame, [T(sb.seriesLine.from), T(sb.seriesLine.from) + 8, E(sb.seriesLine.to) + 4, E(sb.seriesLine.to) + 14], [0, 1, 1, 0], clamp);
  }
  const hide = Math.max(epicLvl, dim);
  const sfx = useMemo(() => kanvasSfx(sb, panels.map((x) => x.start), T, epics.map((x) => x.start), hookEnd), [sb, panels, T, epics, hookEnd]);

  // kamera: dorong pelan per panel + goyang halus + tendangan pada kata `punch`
  let pi = 0;
  panels.forEach((x, i) => x.start <= frame && (pi = i));
  const curP = panels[pi];
  const push = curP ? interpolate(frame, [curP.start, curP.end], [0, 1], clamp) : 0;
  const kick = (sb.punch ?? []).reduce((acc, i) => {
    const d = frame - T(i);
    return d < 0 || d > 24 ? acc : acc + 0.05 * Math.exp(-d / 6) * Math.min(1, d / 3);
  }, 0);
  const cam = 1 + push * 0.035 + kick;
  const dx = Math.sin(frame / 95) * 7;
  const dy = Math.cos(frame / 120) * 5;

  return (
    <AbsoluteFill style={{background: K.bg, overflow: 'hidden'}}>
      <Backdrop />
      <Header topic={latestTopic(sb, panels, frame)} />
      <Headline />
      <AbsoluteFill style={{opacity: 1 - hide, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: '540px 1020px'}}>
        {panels
          .filter((x) => frame >= x.start - 1 && frame < x.end + 10)
          .map((x) => (
            <Panel key={x.i} x={x} />
          ))}
        <KChar panels={panels} assets={assets} hookEnd={hookEnd} />
      </AbsoluteFill>
      {sb.hook && frame < hookEnd + 14 && <HookLayer />}
      {sb.seriesLine && dim > 0 && <SeriesBig dim={dim} />}
      {epics.map((x, i) => {
        const a = assets.get(x.e.reaction);
        return a ? <EpicLayer key={i} e={x.e} start={x.start} end={x.end} asset={a} /> : null;
      })}
      <Html5Audio src={staticFile(`video/${sb.audio ?? 'tts/final.mp3'}`)} />
      <AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.12, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.frame)} durationInFrames={Math.round(fps * 1.6)} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.file}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- latar: grid titik + dua bulatan warna yang bergeser pelan ---------- */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const a = frame / 220;
  return (
    <>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${K.bg}, ${K.bg2})`}} />
      <AbsoluteFill style={{backgroundImage: FIBRE, opacity: 0.3, mixBlendMode: 'multiply', backgroundPosition: `${Math.sin(a) * 8}px ${frame * 0.12}px`}} />
      <div style={{position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', left: -300 + Math.sin(a) * 50, top: 120 + Math.cos(a) * 40, background: 'radial-gradient(circle, rgba(255,248,230,0.55), transparent 62%)'}} />
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -420 + Math.cos(a * 0.8) * 40, top: 1100 + Math.sin(a * 0.8) * 40, background: 'radial-gradient(circle, rgba(62,140,147,0.12), transparent 65%)'}} />
    </>
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
  const loop = sb.loop;
  let chip = topic ?? '';
  let chipBg: string = K.ink;
  let prog = -1;
  if (loop) {
    const a = T(loop.from ?? 0);
    const b = T(loop.until);
    if (frame >= a && frame < b) {
      chip = `${loop.text} · ${Math.ceil((b - frame) / fps)} dtk`;
      chipBg = A();
      prog = (frame - a) / Math.max(1, b - a);
    } else if (frame >= b && frame < b + fps * 1.6) {
      chip = loop.done ?? 'Ini dia 👇';
      chipBg = K.good;
      prog = 1;
    }
  }
  const fill = prog >= 0 ? `linear-gradient(90deg, ${chipBg} ${prog * 100}%, ${K.ink} ${prog * 100}%)` : chipBg;
  return (
    <div style={{position: 'absolute', left: g.left, top: g.top, width: g.width, height: g.height, display: 'flex', alignItems: 'center', gap: 18, opacity: enter, transform: `translateY(${(1 - enter) * -20}px)`}}>
      <Img src={staticFile(`shared/${sb.series}.svg`)} style={{width: g.height * 1.15, height: g.height, objectFit: 'contain', objectPosition: 'left center'}} />
      <div style={{flex: 1}} />
      {chip && (
        <div style={{fontFamily: FONT_BODY, fontWeight: 800, fontSize: 28, color: K.card, background: fill, borderRadius: 14, padding: '13px 28px', whiteSpace: 'nowrap', maxWidth: 600, overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: SHADOW}}>
          {chip}
        </div>
      )}
      <Img src={staticFile('shared/logo-signature-black.svg')} style={{height: 64, width: 120, objectFit: 'contain', objectPosition: 'right center'}} />
    </div>
  );
};

/* ---------- headline dua tingkat, kata inti masuk satu per satu ---------- */

type BTok = {text: string; key: boolean; first: number};
type Built = {from: number; to: number; split: number; setup: string; punch: BTok[]; punchOverride?: string};

const buildLines = (lines: KLine[], toks: ReturnType<typeof tokens>, keyIdx: Set<number>): Built[] =>
  lines.map((l, i) => {
    const to = l.to ?? (lines[i + 1] ? lines[i + 1].from - 1 : toks[toks.length - 1].last);
    const mine = toks.filter((t) => t.first >= l.from && t.first <= to);
    const n = mine.length;
    const split = l.split ?? (n <= 3 ? l.from : mine[n - Math.min(5, Math.ceil(n * 0.5))].first);
    const setupToks = mine.filter((t) => t.first < split);
    const punchToks = mine.filter((t) => t.first >= split);
    const keys = new Set([...(l.key ?? []), ...keyIdx]);
    const st = setupToks.length > 9 ? setupToks.slice(-9) : setupToks;
    let setup = l.setup ?? `${setupToks.length > 9 ? '...' : ''}${st.map((t) => t.text).join(' ')}`;
    if (setup && !/[.,?!:;…]$/.test(setup)) setup += '...';
    return {from: l.from, to, split, setup, punch: punchToks.map((t) => ({text: t.text, key: keys.has(t.first), first: t.first})), punchOverride: l.punch};
  });

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sb, words, T, E} = useTiming();
  const keyIdx = useKeyIdx();
  const hookEnd = useHookEnd();
  const built = useMemo(() => buildLines(sb.lines ?? [], tokens(words, sb), keyIdx), [sb, words, keyIdx]);
  const g = KGEO.headline;
  let li = -1;
  built.forEach((b, i) => frame >= T(b.from) - 2 && (li = i));
  const b = built[li];
  if (!b || frame < hookEnd - 4 || (sb.hook && b.to <= sb.hook.until)) return null;
  const fadeOut = li === built.length - 1 ? interpolate(frame, [E(b.to) + fps * 0.6, E(b.to) + fps * 0.6 + 6], [1, 0], clamp) : 1;
  const lineStart = Math.max(T(b.from) - 2, hookEnd - 4);
  const sIn = spring({frame: frame - lineStart, fps, config: {damping: 200, stiffness: 220}});
  const punch: BTok[] = b.punchOverride ? b.punchOverride.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) => ({text: part.replace(/\*/g, '').trim(), key: part.startsWith('*'), first: b.split})).filter((x) => x.text) : b.punch;
  const len = punch.map((p) => p.text).join(' ').length;
  const size = len > 40 ? 62 : len > 30 ? 74 : len > 20 ? 88 : 104;
  return (
    <div style={{position: 'absolute', left: g.left, top: g.top, width: g.width, height: g.height, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', opacity: fadeOut}}>
      <div style={{fontFamily: FONT_HEAD, fontSize: 44, fontWeight: 600, color: K.soft, lineHeight: 1.25, minHeight: 56, opacity: sIn, transform: `translateY(${(1 - sIn) * 16}px)`}}>{b.setup}</div>
      <div style={{fontFamily: FONT_HEAD, fontSize: size, fontWeight: 800, color: K.ink, lineHeight: 1.06, letterSpacing: -1.5, textWrap: 'balance', maxWidth: g.width}}>
        {punch.map((p, i) => {
          const st = Math.max(T(p.first) - 2, lineStart);
          const vis = frame >= st;
          const pp = spring({frame: frame - st, fps, config: {damping: 13, stiffness: 230, mass: 0.55}});
          const sweep = interpolate(frame, [st + 2, st + 9], [0, 100], clamp);
          return (
            <React.Fragment key={i}>
              {i > 0 && ' '}
              <span
                style={{
                  display: 'inline-block',
                  opacity: vis ? Math.min(1, pp * 1.6) : 0,
                  transform: `translateY(${(1 - pp) * 34}px) scale(${0.9 + 0.1 * pp})`,
                  color: p.key && sweep > 30 ? A() : undefined,
                  padding: p.key ? '0 6px' : 0,
                  backgroundImage: p.key ? `linear-gradient(${K.accentSoft}, ${K.accentSoft})` : undefined,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: p.key ? `${sweep}% 22%` : undefined,
                  backgroundPosition: '0 92%',
                  borderRadius: 4,
                }}
              >
                {p.text}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- hook: huruf kertas potong untuk kata kunci ---------- */

const CUT = ['accent', K.sun, K.teal, K.ink, '#E9B872'];
const CutLetters: React.FC<{text: string; seed: number}> = ({text, seed}) => (
  <>
    {[...text].map((ch, j) => {
      const c = CUT[(j + seed) % CUT.length];
      const bg = c === 'accent' ? A() : c;
      const dark = bg === K.ink || bg === K.teal || bg === A();
      return (
        <span key={j} style={{display: 'inline-block', background: bg, color: dark ? K.card : K.ink, padding: '0 0.08em 0.06em', margin: '0 0.025em', borderRadius: 8, boxShadow: SHADOW, transform: `rotate(${[-5, 4, -3, 6, -4, 3, -6][(j + seed) % 7]}deg)`}}>
          {ch}
        </span>
      );
    })}
  </>
);

/* ---------- hook: teks raksasa jatuh per kata di atas lembar kertas + benda kunci, lalu mengecil ---------- */

const HookLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sb, words, T} = useTiming();
  const keyIdx = useKeyIdx();
  const hookEnd = useHookEnd();
  const toks = useMemo(() => tokens(words, sb).filter((t) => t.first <= (sb.hook?.until ?? -1)), [words, sb]);
  if (!sb.hook) return null;
  const exit = spring({frame: frame - (hookEnd - 6), fps, config: {damping: 16, stiffness: 140}});
  const chars = toks.map((t) => t.text).join(' ').length;
  const size = chars > 55 ? 90 : chars > 30 ? 112 : 136;
  const burst = frame / 2;
  return (
    <AbsoluteFill style={{opacity: 1 - exit, transform: `translateY(${-exit * 260}px) scale(${1 - exit * 0.45})`, transformOrigin: '540px 400px'}}>
      <div style={{position: 'absolute', left: 40, right: 40, top: 250, height: 700, ...bigCard(), transform: `rotate(${-1.2 + Math.sin(burst / 40) * 0.3}deg)`}} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 300, height: 600, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '10px 26px', fontFamily: FONT_HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.02, color: K.ink, letterSpacing: -2, textAlign: 'center'}}>
        {toks.map((t, i) => {
          const st = T(t.first) - 2;
          const vis = frame >= st;
          const p = spring({frame: frame - st, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
          const key = keyIdx.has(t.first);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: vis ? 1 : 0,
                transform: `translateY(${(1 - p) * -40}px) scale(${interpolate(p, [0, 1], [1.35, 1])}) rotate(${(1 - p) * (i % 2 ? 4 : -4)}deg)`,
                letterSpacing: key ? 0 : undefined,
              }}
            >
              {key ? <CutLetters text={t.text} seed={i} /> : t.text}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1010, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        {(sb.hook.items ?? []).map((el: KEl, i: number) => (
          <Element key={i} el={el} panelStart={0} stageW={960} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- panggung ---------- */

const Panel: React.FC<{x: {p: NonNullable<Storyboard['panels']>[number]; start: number; end: number; char: KChar; i: number}}> = ({x}) => {
  const frame = useCurrentFrame();
  const g = KGEO.stage[x.char];
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const inP = interpolate(frame, [x.start, x.start + 10], [0, 1], {...clamp, easing: ease});
  const outP = interpolate(frame, [x.end, x.end + 9], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const dir = x.i % 2 ? -1 : 1;
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
        opacity: Math.min(inP * 1.4, 1) * (1 - outP),
        transform: `translateX(${(1 - inP) * 160 * dir - outP * 180 * dir}px) rotate(${(1 - inP) * 2 * dir}deg)`,
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

/* ---------- karakter: posisi per panel, gerak idle, ganti pose dengan pop ---------- */

const KChar: React.FC<{panels: {p: {pose?: string}; start: number; char: KChar}[]; assets: Map<string, PixelAsset>; hookEnd: number}> = ({panels, assets, hookEnd}) => {
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
  const popP = spring({frame: frame - pose.frame, fps, config: {damping: 10, stiffness: 240, mass: 0.6}});

  let pi = 0;
  panels.forEach((x, i) => x.start <= frame && (pi = i));
  const from = KGEO.char[panels[Math.max(0, pi - 1)]?.char ?? 'left'];
  const to = KGEO.char[panels[pi]?.char ?? 'left'];
  const m = pi === 0 ? 1 : spring({frame: frame - panels[pi].start, fps, config: {damping: 18, stiffness: 120}});
  const cx = interpolate(m, [0, 1], [from.cx, to.cx]);
  const base = interpolate(m, [0, 1], [from.base, to.base]);
  const h = interpolate(m, [0, 1], [from.h, to.h]);
  const flip = (m < 0.5 ? panels[Math.max(0, pi - 1)]?.char : panels[pi]?.char) === 'right';
  // masuk setelah hook: meluncur dari bawah
  const enter = spring({frame: frame - Math.max(4, hookEnd - 4), fps, config: {damping: 14, stiffness: 120}});
  const bob = Math.sin((frame / fps) * Math.PI * 0.8) * 5;
  const breathe = 1 + Math.sin((frame / fps) * Math.PI * 0.8 + 1) * 0.008;
  const asset = assets.get(pose.pose) ?? assets.get('netral');
  if (!asset) return null;
  const squash = interpolate(popP, [0, 1], [0.9, 1]);
  return (
    <div style={{position: 'absolute', left: cx, top: base + (1 - enter) * 700, width: 0, height: 0, opacity: Math.min(1, enter * 2)}}>
      <div style={{position: 'absolute', left: -h * 0.24, top: -h * 0.03, width: h * 0.48, height: h * 0.06, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(60,35,10,0.34), transparent)', transform: `scaleX(${1 - bob / 120})`}} />
      <div style={{position: 'absolute', left: 0, top: bob - 6, transform: `scaleX(${flip ? -1 : 1}) scale(${squash * breathe}, ${(2 - squash) * breathe})`, transformOrigin: '0 0', filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.08)) drop-shadow(8px 18px 16px rgba(60,35,10,0.32))'}}>
        <PixelFigure asset={asset} h={h} />
      </div>
    </div>
  );
};

/* ---------- kalimat khas seri ---------- */

const SeriesBig: React.FC<{dim: number}> = ({dim}) => {
  const {sb} = useTiming();
  return (
    <div style={{position: 'absolute', left: 140, top: 640, width: 800, height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: dim, transform: `scale(${0.8 + 0.2 * dim}) rotate(${(1 - dim) * -6}deg)`}}>
      <Img src={staticFile(`shared/${sb.series}.svg`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
    </div>
  );
};

/* ---------- SFX modern otomatis (public/sfx/v2, dibuat dengan ElevenLabs Sound Effects) ---------- */

type Ev = {frame: number; file: string; volume: number};

const walk = (els: KEl[], f: (e: KEl) => void) =>
  els.forEach((e) => {
    f(e);
    if (e.kind === 'row') walk(e.items, f);
  });

const kanvasSfx = (sb: Storyboard, starts: number[], T: (i: number) => number, epicStarts: number[], hookEnd: number) => {
  // kanvas v3: minimal. pop = kartu/elemen baru, tick = butir checklist/chat/langkah, soft-hit = satu aksen di hook.
  const ev: Ev[] = [];
  const add = (frame: number, name: 'pop' | 'tick' | 'soft-hit', volume: number) => frame >= 0 && ev.push({frame, file: `v2/${name}`, volume});
  if (sb.autoSfx !== false) {
    if (sb.hook) {
      add(T(0) - 2, 'soft-hit', 0.55);
      walk(sb.hook.items ?? [], (e) => e.at !== undefined && add(T(e.at), 'pop', 0.26));
    }
    (sb.panels ?? []).forEach((p, i) => {
      if (i > 0 && p.sfx !== null) add(starts[i] + 2, 'pop', 0.24);
      walk(p.items, (e) => {
        if (e.at !== undefined && e.kind !== 'row' && e.kind !== 'chatsim') add(T(e.at), 'pop', 0.24);
        if (e.kind === 'card') {
          if (e.strikeAt !== undefined) add(T(e.strikeAt), 'tick', 0.32);
          if (e.swap) add(T(e.swap.at), 'tick', 0.32);
          if (e.stamp) add(T(e.stamp.at), 'pop', 0.3);
        }
        if (e.kind === 'icon' && e.labelAt !== undefined) add(T(e.labelAt), 'tick', 0.28);
        if (e.kind === 'checklist')
          e.items.forEach((it) => {
            if (it.at !== undefined) add(T(it.at), 'tick', 0.28);
            if (it.doneAt !== undefined) add(T(it.doneAt), 'tick', 0.34);
            if (it.strikeAt !== undefined) add(T(it.strikeAt), 'tick', 0.3);
          });
        if (e.kind === 'flow') e.items.forEach((it) => it.at !== undefined && add(T(it.at), 'pop', 0.24));
        if (e.kind === 'stepper' || (e.kind === 'phone' && e.steps)) (e.kind === 'stepper' ? e.items : e.steps ?? []).forEach((st) => add(T(st.at), 'tick', 0.3));
        if (e.kind === 'illus' && e.name === 'render' && e.steps?.[2] !== undefined) add(T(e.steps[2]), 'pop', 0.26);
        if (e.kind === 'illus' && e.name === 'doors' && e.steps) {
          if (e.steps[0] !== undefined) add(T(e.steps[0]) + 4, 'pop', 0.26);
          if (e.steps[1] !== undefined) add(T(e.steps[1]), 'tick', 0.32);
        }
        if (e.kind === 'illus' && e.name === 'recipe-kitchen' && e.steps) {
          if (e.steps[1] !== undefined) add(T(e.steps[1]), 'tick', 0.3);
          if (e.steps[2] !== undefined) add(T(e.steps[2]), 'pop', 0.28);
        }
        if (e.kind === 'evidence') {
          if (e.mark) add(T(e.mark.at), 'tick', 0.32);
          if (e.note) add(T(e.note.at), 'tick', 0.28);
        }
        if (e.kind === 'chatsim') e.items.forEach((m) => add(T(m.at), 'tick', 0.28));
        if ((e.kind === 'shot' || e.kind === 'phone') && e.rings) e.rings.forEach((r) => add(T(r.at), 'tick', 0.28));
      });
    });
    epicStarts.forEach((st) => add(st, 'soft-hit', 0.5));
    if (sb.loop) add(T(sb.loop.until), 'pop', 0.3);
  }
  ev.sort((a, b) => a.frame - b.frame);
  // buang duplikat berdekatan dan batasi satu suara per 4 frame
  const out: Ev[] = [];
  ev.forEach((e) => {
    if (out.some((p) => e.frame - p.frame < 4)) return;
    out.push(e);
  });
  return out;
};
