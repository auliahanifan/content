import React from 'react';
import {Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {UiMock} from '../boards/Mock';
import {Prop} from '../components/Prop';
import {FONT_BODY, type Tone} from '../theme';
import {useTiming} from '../timing';
import type {Board, KEl, KIcon, KStep, Ring, Stamp} from '../types';
import {K, ktone, SHADOW} from './theme';

/** Progres muncul (spring) dari frame `start`; `visible` false sebelum itu (tempat tetap dipesan). */
const useIn = (start: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - start, fps, config: {damping: 15, stiffness: 170, mass: 0.7}});
  return {p, visible: frame >= start};
};

const inStyle = (p: number, visible: boolean, dy = 28): React.CSSProperties => ({
  opacity: visible ? Math.min(1, p * 1.5) : 0,
  transform: `translateY(${(1 - p) * dy}px) scale(${0.94 + 0.06 * p})`,
});

const Icon: React.FC<{icon: KIcon; size: number}> = ({icon, size}) =>
  icon.src ? (
    <Img src={staticFile(`video/${icon.src}`)} style={{width: size, height: size, objectFit: 'contain'}} />
  ) : (
    <Prop prop={icon.prop} emoji={icon.emoji} size={size} slot={false} />
  );

/** Coretan koral tipis yang tertarik dari kiri, untuk harga/klaim yang dibatalkan. */
const KStrike: React.FC<{at?: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  if (at === undefined) return null;
  const w = interpolate(frame, [T(at), T(at) + 7], [0, 104], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: '-2%', top: '52%', width: `${w}%`, height: 8, borderRadius: 4, background: K.bad, transform: 'rotate(-4deg)', transformOrigin: 'left center'}} />;
};

/** Stempel miring (mis. GRATIS!) yang jatuh dari besar ke ukuran normal. */
const KStamp: React.FC<{s?: Stamp}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  if (!s) return null;
  const start = T(s.at);
  if (frame < start) return null;
  const p = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
  const col = ktone(s.tone ?? 'good');
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 76,
          color: col,
          border: `8px solid ${col}`,
          borderRadius: 18,
          padding: '4px 30px',
          background: 'rgba(255,255,255,0.92)',
          transform: `rotate(-9deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`,
          opacity: Math.min(1, p * 2),
          letterSpacing: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {s.text}
      </div>
    </div>
  );
};

const Rings: React.FC<{rings?: Ring[]}> = ({rings}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  return (
    <>
      {(rings ?? []).map((r, i) => {
        const o = interpolate(frame, [T(r.at), T(r.at) + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: `${r.w}%`,
              height: `${r.h}%`,
              border: `7px solid ${ktone(r.tone ?? 'bad')}`,
              borderRadius: 18,
              opacity: o,
              transform: `scale(${1.15 - 0.15 * o})`,
            }}
          />
        );
      })}
    </>
  );
};

const Chip: React.FC<{text: string; tone?: Tone; size?: number; solid?: boolean}> = ({text, tone: t, size = 28, solid = true}) => {
  const col = t ? ktone(t) : K.ink;
  return (
    <div
      style={{
        display: 'inline-flex',
        fontFamily: FONT_BODY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        padding: `${size * 0.32}px ${size * 0.7}px`,
        borderRadius: 999,
        background: solid ? col : 'transparent',
        color: solid ? K.card : col,
        border: solid ? 'none' : `3px solid ${col}`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const cardBox = (w?: number): React.CSSProperties => ({
  position: 'relative',
  width: w,
  maxWidth: '100%',
  background: K.card,
  borderRadius: 30,
  boxShadow: SHADOW,
  border: `2px solid ${K.line}`,
  fontFamily: FONT_BODY,
  color: K.ink,
});

const Card: React.FC<{el: Extract<KEl, {kind: 'card'}>}> = ({el}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  const swapped = el.swap && frame >= T(el.swap.at);
  const sw = el.swap ? interpolate(frame, [T(el.swap.at), T(el.swap.at) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const accent = el.tone ? ktone(el.tone) : undefined;
  return (
    <div style={{...cardBox(el.w ?? 640), padding: '34px 40px', display: 'flex', gap: 30, alignItems: 'center', borderColor: accent ?? K.line, borderWidth: accent ? 4 : 2}}>
      {el.icon && <Icon icon={el.icon} size={150} />}
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, flex: 1}}>
        {el.tag && (
          <div>
            <Chip text={el.tag} size={26} />
          </div>
        )}
        {el.title && <div style={{fontSize: 50, fontWeight: 800, lineHeight: 1.12}}>{el.title}</div>}
        {el.text && <div style={{fontSize: 36, fontWeight: 600, color: K.soft, lineHeight: 1.3}}>{el.text}</div>}
        {el.value && (
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap'}}>
            <div style={{position: 'relative', fontSize: 80, fontWeight: 800, lineHeight: 1.05, color: swapped ? K.faint : accent ?? K.ink}}>
              {el.value}
              <KStrike at={el.strikeAt ?? el.swap?.at} />
            </div>
            {el.swap && swapped && (
              <div style={{opacity: sw, transform: `scale(${0.7 + 0.3 * sw})`}}>
                <Chip text={el.swap.value} tone={el.swap.tone ?? 'good'} size={44} />
              </div>
            )}
          </div>
        )}
      </div>
      <KStamp s={el.stamp} />
    </div>
  );
};

const LabeledIcon: React.FC<{icon: KIcon; size: number; label?: string; labelAt?: number; tone?: Tone; start: number}> = ({icon, size, label, labelAt, tone: t, start}) => {
  const {T} = useTiming();
  const lab = useIn(labelAt === undefined ? start + 4 : T(labelAt));
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <Icon icon={icon} size={size} />
      {label && (
        <div style={inStyle(lab.p, lab.visible, 14)}>
          <Chip text={label} tone={t} size={34} />
        </div>
      )}
    </div>
  );
};

const Flow: React.FC<{el: Extract<KEl, {kind: 'flow'}>; start: number}> = ({el, start}) => {
  const {T} = useTiming();
  const size = el.size ?? (el.items.length > 2 ? 150 : 200);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center'}}>
      {el.items.map((it, i) => (
        <FlowNode key={i} first={i === 0} op={el.op ?? '→'} start={it.at === undefined ? start : T(it.at)}>
          <LabeledIcon icon={it} size={size} label={it.label} tone={it.tone} start={it.at === undefined ? start : T(it.at)} />
        </FlowNode>
      ))}
    </div>
  );
};

const FlowNode: React.FC<{first: boolean; op: string; start: number; children: React.ReactNode}> = ({first, op, start, children}) => {
  const {p, visible} = useIn(start);
  return (
    <>
      {!first && <div style={{...inStyle(p, visible, 0), fontFamily: FONT_BODY, fontWeight: 800, fontSize: 64, color: K.faint}}>{op}</div>}
      <div style={inStyle(p, visible)}>{children}</div>
    </>
  );
};

const Check: React.FC<{done: boolean; p: number; tone?: Tone}> = ({done, p, tone: t}) => (
  <div
    style={{
      width: 58,
      height: 58,
      borderRadius: '50%',
      flexShrink: 0,
      border: done ? 'none' : `4px solid ${K.line}`,
      background: done ? ktone(t ?? 'good') : 'transparent',
      color: K.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 32,
      fontWeight: 800,
      transform: done ? `scale(${0.6 + 0.4 * p})` : undefined,
    }}
  >
    {done ? '✓' : ''}
  </div>
);

const Checklist: React.FC<{el: Extract<KEl, {kind: 'checklist'}>; start: number}> = ({el, start}) => (
  <div style={{...cardBox(el.w ?? 640), padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24}}>
    {el.title && <div style={{fontSize: 34, fontWeight: 700, color: K.soft, lineHeight: 1.25}}>{el.title}</div>}
    {el.items.map((it, i) => (
      <CheckRow key={i} it={it} start={start} />
    ))}
  </div>
);

const CheckRow: React.FC<{it: Extract<KEl, {kind: 'checklist'}>['items'][number]; start: number}> = ({it, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  const {p, visible} = useIn(it.at === undefined ? start : T(it.at));
  const done = it.doneAt !== undefined && frame >= T(it.doneAt);
  const dp = it.doneAt === undefined ? 0 : spring({frame: frame - T(it.doneAt), fps, config: {damping: 10, stiffness: 220}});
  return (
    <div style={{...inStyle(p, visible, 16), display: 'flex', gap: 20, alignItems: 'center'}}>
      {it.doneAt !== undefined ? <Check done={done} p={dp} tone={it.tone} /> : <div style={{width: 16, height: 16, borderRadius: 8, background: ktone(it.tone), flexShrink: 0, margin: '0 17px'}} />}
      <div style={{position: 'relative', fontSize: 40, fontWeight: 700, lineHeight: 1.22, color: K.ink}}>
        {it.text}
        <KStrike at={it.strikeAt} />
      </div>
    </div>
  );
};

const Shot: React.FC<{el: Extract<KEl, {kind: 'shot'}>}> = ({el}) => (
  <div style={{...cardBox(el.w ?? 660), padding: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
    <div style={{position: 'relative', borderRadius: 20, overflow: 'hidden'}}>
      <Img src={staticFile(`video/${el.src}`)} style={{display: 'block', width: '100%'}} />
      <Rings rings={el.rings} />
    </div>
    {el.source && <div style={{fontSize: 22, fontWeight: 600, color: K.faint, padding: '0 8px 4px'}}>{el.source}</div>}
  </div>
);

const isVideo = (src: string) => /\.(mp4|mov|webm|m4v)$/i.test(src);

/** Bingkai HP berisi rekaman layar asli (mp4 di folder video) atau gambar. */
const Phone: React.FC<{el: Extract<KEl, {kind: 'phone'}>; start: number}> = ({el, start}) => {
  const {fps} = useVideoConfig();
  const w = el.w ?? 420;
  const h = Math.round(w * 2.05);
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: w * 0.13, background: K.ink, padding: w * 0.035, boxShadow: SHADOW, flexShrink: 0}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.1, overflow: 'hidden', background: '#0B0E1A'}}>
        {isVideo(el.src) ? (
          <Sequence from={start} layout="none">
            <OffthreadVideo
              src={staticFile(`video/${el.src}`)}
              trimBefore={Math.round((el.from ?? 0) * fps)}
              playbackRate={el.rate ?? 1}
              muted
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </Sequence>
        ) : (
          <Img src={staticFile(`video/${el.src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
        )}
        <Rings rings={el.rings} />
      </div>
    </div>
  );
};

/** Langkah bernomor: yang sudah lewat dicentang mint, yang aktif kobalt dan teksnya tebal. */
const Stepper: React.FC<{items: KStep[]; w?: number}> = ({items, w}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  let cur = -1;
  items.forEach((s, i) => frame >= T(s.at) && (cur = i));
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: w ?? 330, fontFamily: FONT_BODY}}>
      {items.map((s, i) => {
        const shown = frame >= T(s.at) - 2;
        const done = i < cur;
        const active = i === cur;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: shown ? 1 : 0.35}}>
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                background: done ? K.good : active ? K.accent : K.card,
                color: done || active ? K.card : K.faint,
                border: done || active ? 'none' : `3px solid ${K.line}`,
                transform: active ? 'scale(1.12)' : undefined,
              }}
            >
              {done ? '✓' : i + 1}
            </div>
            <div style={{fontSize: active ? 36 : 30, fontWeight: active ? 800 : 600, color: active ? K.ink : K.soft, lineHeight: 1.2}}>{shown ? s.text : ''}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Satu elemen panggung. `panelStart` = frame panel mulai; elemen muncul di `at` (atau sedikit setelah panel). */
export const Element: React.FC<{el: KEl; panelStart: number; stageW: number}> = ({el, panelStart, stageW}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  const start = el.at === undefined ? panelStart + 4 : T(el.at);
  const {p, visible} = useIn(start);
  let op = 1;
  if (el.dimAt !== undefined) op = interpolate(frame, [T(el.dimAt), T(el.dimAt) + 6], [1, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (el.out !== undefined) op = Math.min(op, interpolate(frame, [T(el.out), T(el.out) + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  const body = (() => {
    switch (el.kind) {
      case 'card':
        return <Card el={el} />;
      case 'icon':
        return <LabeledIcon icon={el.icon} size={el.size ?? 300} label={el.label} labelAt={el.labelAt} tone={el.tone} start={start} />;
      case 'chip':
        return <Chip text={el.text} tone={el.tone} size={40} />;
      case 'big': {
        return <Big el={el} />;
      }
      case 'flow':
        return <Flow el={el} start={start} />;
      case 'checklist':
        return <Checklist el={el} start={start} />;
      case 'ui': {
        const {kind: _k, ui, at: _a, out: _o, dimAt: _d, w: _w, ...rest} = el;
        const b: Extract<Board, {type: 'ui'}> = {...rest, type: 'ui', kind: ui, zoom: el.zoom ?? Math.min(1.1, (stageW - 40) / 760)};
        return <UiMock b={b} start={start} />;
      }
      case 'shot':
        return <Shot el={el} />;
      case 'phone':
        return (
          <div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
            {el.steps && <Stepper items={el.steps} />}
            <Phone el={el} start={start} />
          </div>
        );
      case 'stepper':
        return <Stepper items={el.items} w={el.w} />;
      case 'row':
        return (
          <div style={{display: 'flex', gap: el.gap ?? 26, alignItems: 'center', justifyContent: 'center'}}>
            {el.items.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && el.op && <RowOp op={el.op} at={c.at} panelStart={panelStart} />}
                <Element el={c} panelStart={panelStart} stageW={stageW / el.items.length} />
              </React.Fragment>
            ))}
          </div>
        );
    }
  })();
  // row: anak mengatur kemunculannya sendiri
  const style = el.kind === 'row' ? {} : inStyle(p, visible);
  const base = typeof style.opacity === 'number' ? style.opacity : 1;
  return <div style={{...style, opacity: base * op, maxWidth: '100%'}}>{body}</div>;
};

const RowOp: React.FC<{op: string; at?: number; panelStart: number}> = ({op, at, panelStart}) => {
  const {T} = useTiming();
  const {p, visible} = useIn(at === undefined ? panelStart + 4 : T(at));
  return <div style={{...inStyle(p, visible, 0), fontFamily: FONT_BODY, fontWeight: 800, fontSize: 60, color: K.faint}}>{op}</div>;
};

const Big: React.FC<{el: Extract<KEl, {kind: 'big'}>}> = ({el}) => {
  const {T} = useTiming();
  const sub = useIn(el.subAt === undefined ? -1 : T(el.subAt));
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontFamily: FONT_BODY, textAlign: 'center'}}>
      <div style={{fontSize: el.text.length > 8 ? 110 : 150, fontWeight: 800, lineHeight: 1, color: ktone(el.tone)}}>{el.text}</div>
      {el.sub && <div style={{...(el.subAt === undefined ? {} : inStyle(sub.p, sub.visible, 12)), fontSize: 36, fontWeight: 600, color: K.soft}}>{el.sub}</div>}
    </div>
  );
};
