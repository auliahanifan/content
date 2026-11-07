import React from 'react';
import {Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {UiMock} from '../boards/Mock';
import {Prop} from '../components/Prop';
import {FONT_BODY, type Tone} from '../theme';
import {useTiming} from '../timing';
import type {Board, KEl, KIcon, KStep, Ring, Stamp} from '../types';
import {ChatSim, Illus, ILLUS_W} from './Illus';
import {VIcon} from './Icons';
import {A, bigCard, cardSkin, FONT_HAND, FONT_HEAD, GRAIN, K, ktone, SHADOW, softTone} from './theme';

/** Progres muncul (spring) dari frame `start`; `visible` false sebelum itu (tempat tetap dipesan). */
const useIn = (start: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 190, mass: 0.6}});
  return {p, visible: frame >= start};
};

const inStyle = (p: number, visible: boolean, dy = 34): React.CSSProperties => ({
  opacity: visible ? Math.min(1, p * 1.8) : 0,
  transform: `translateY(${(1 - p) * dy}px) scale(${0.86 + 0.14 * p}) rotate(${(1 - p) * -2.5}deg)`,
});

const Icon: React.FC<{icon: KIcon; size: number}> = ({icon, size}) =>
  icon.name ? (
    <VIcon name={icon.name} size={size} color={icon.color ? ktone(icon.color) : undefined} />
  ) : icon.src ? (
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
  return <div style={{position: 'absolute', left: '-3%', top: '48%', width: `${w}%`, height: 10, borderRadius: 5, background: K.bad, opacity: 0.9, transform: 'rotate(-4deg)', transformOrigin: 'left center'}} />;
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
          fontFamily: FONT_HEAD,
          fontWeight: 800,
          fontSize: 80,
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
              border: `8px solid ${ktone(r.tone ?? 'bad')}`,
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
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        position: 'relative',
        alignItems: 'center',
        padding: `${size * 0.34}px ${size * 0.7}px ${size * 0.34}px ${solid ? size * 1.25 : size * 0.7}px`,
        borderRadius: `${size * 0.3}px ${size * 0.9}px ${size * 0.9}px ${size * 0.3}px`,
        background: solid ? col : 'transparent',
        color: solid ? (t === 'sun' || t === 'warn' ? K.ink : K.card) : col,
        boxShadow: solid ? SHADOW : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {solid && <i style={{position: 'absolute', left: size * 0.42, top: '50%', width: size * 0.36, height: size * 0.36, marginTop: -size * 0.18, borderRadius: '50%', background: K.bg, boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.35)'}} />}
      {text}
    </div>
  );
};

const cardBox = (w?: number): React.CSSProperties => ({
  position: 'relative',
  width: w,
  maxWidth: '100%',
  ...bigCard(),
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
    <div style={{...cardBox(el.w ?? 640), padding: '32px 38px', display: 'flex', gap: 30, alignItems: 'center', background: accent && el.tone !== 'accent' ? softTone(el.tone) : K.card}}>
      {accent && <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, borderRadius: '28px 0 0 28px', background: accent}} />}
      {el.icon && <Icon icon={el.icon} size={140} />}
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, flex: 1}}>
        {el.tag && (
          <div>
            <Chip text={el.tag} size={26} />
          </div>
        )}
        {el.title && <div style={{fontFamily: FONT_HEAD, fontSize: 54, fontWeight: 800, lineHeight: 1.05, letterSpacing: -0.5}}>{el.title}</div>}
        {el.text && <div style={{fontSize: 34, fontWeight: 700, color: K.soft, lineHeight: 1.3}}>{el.text}</div>}
        {el.value && (
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap'}}>
            <div style={{position: 'relative', fontFamily: FONT_HEAD, fontSize: 84, fontWeight: 800, lineHeight: 1.02, color: swapped ? K.faint : accent ?? K.ink}}>
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
      {!first && <div style={{...inStyle(p, visible, 0), fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 70, color: K.ink}}>{op}</div>}
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
      boxShadow: done ? SHADOW : undefined,
      background: done ? ktone(t ?? 'good') : K.card,
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
    {el.title && <div style={{fontFamily: FONT_HEAD, fontSize: 40, fontWeight: 800, color: K.ink, lineHeight: 1.15}}>{el.title}</div>}
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
      {it.doneAt !== undefined ? <Check done={done} p={dp} tone={it.tone} /> : <div style={{width: 22, height: 22, borderRadius: 11, background: ktone(it.tone), flexShrink: 0, margin: '0 15px'}} />}
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
      {el.label && (
        <div style={{position: 'absolute', zIndex: 3, left: '50%', top: -26, transform: 'translateX(-50%) rotate(-2deg)', fontFamily: FONT_BODY, fontWeight: 800, fontSize: Math.round(w * 0.085), letterSpacing: 2, color: K.card, background: ktone(el.labelTone), borderRadius: 12, padding: '8px 22px', boxShadow: SHADOW, whiteSpace: 'nowrap'}}>
          {el.label}
        </div>
      )}
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
                boxShadow: done || active ? SHADOW : undefined,
                fontFamily: FONT_HEAD,
                transform: active ? 'scale(1.12)' : undefined,
              }}
            >
              {done ? '✓' : i + 1}
            </div>
            <div style={{fontFamily: active ? FONT_HEAD : FONT_BODY, fontSize: active ? 40 : 30, fontWeight: active ? 800 : 700, color: active ? K.ink : K.soft, lineHeight: 1.15, background: active ? K.sun : 'transparent', padding: active ? '2px 10px' : 0, borderRadius: 8}}>{shown ? s.text : ''}</div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Bukti asli ala scrapbook: tangkapan layar ditempel miring dengan selotip, bagian penting distabilo
 * (rects dalam persen gambar) di kata `mark.at`, catatan tulisan tangan di `note.at`, kilau cahaya saat masuk.
 */
const Evidence: React.FC<{el: Extract<KEl, {kind: 'evidence'}>; start: number; stageW: number}> = ({el, start, stageW}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  const w = Math.min(el.w ?? 640, stageW - 30);
  const markAt = el.mark ? T(el.mark.at) : Infinity;
  const noteAt = el.note ? T(el.note.at) : Infinity;
  const leak = interpolate(frame - start, [0, 14, 40], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const leakX = interpolate(frame - start, [0, 40], [-40, 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const np = frame < noteAt ? 0 : spring({frame: frame - noteAt, fps, config: {damping: 13, stiffness: 180, mass: 0.6}});
  const tape = (left: string, rot: number, d: number): React.CSSProperties => {
    const tp = frame < start + d ? 0 : spring({frame: frame - start - d, fps, config: {damping: 16, stiffness: 220}});
    return {position: 'absolute', top: -20, left, width: 150, height: 42, background: 'rgba(242,193,78,0.62)', boxShadow: '0 1px 2px rgba(0,0,0,.12)', transform: `rotate(${rot}deg) scale(${1.4 - 0.4 * tp})`, opacity: tp, zIndex: 3};
  };
  return (
    <div style={{position: 'relative', width: w, transform: 'rotate(-2deg)'}}>
      <div style={{position: 'relative', background: '#fff', padding: '16px 16px 46px', boxShadow: '0 2px 2px rgba(0,0,0,.08), 0 26px 40px -18px rgba(60,35,10,.55)'}}>
        <div style={{position: 'relative'}}>
          <Img src={staticFile(`video/${el.src}`)} style={{display: 'block', width: '100%'}} />
          {(el.mark?.rects ?? []).map((r, i) => {
            const p = interpolate(frame, [markAt + i * 9, markAt + i * 9 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return <div key={i} style={{position: 'absolute', left: `${r.x - 0.6}%`, top: `${r.y - 0.4}%`, width: `${(r.w + 1.2) * p}%`, height: `${r.h + 0.8}%`, background: 'rgba(242,193,78,0.6)', mixBlendMode: 'multiply', borderRadius: 4}} />;
          })}
          <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.18, mixBlendMode: 'multiply'}} />
        </div>
        {el.source && <div style={{position: 'absolute', left: 18, bottom: 12, fontFamily: FONT_BODY, fontSize: 20, fontWeight: 600, color: '#8A8577'}}>{el.source}</div>}
      </div>
      <div style={tape('6%', -8, 6)} />
      <div style={tape('68%', 7, 10)} />
      {el.note && (
        <div style={{position: 'absolute', left: `${el.note.x ?? 30}%`, top: `${el.note.y ?? 100}%`, fontFamily: FONT_HAND, fontWeight: 700, fontSize: 64, lineHeight: 1, color: K.bad, whiteSpace: 'nowrap', transform: `rotate(-4deg) translateY(${(1 - np) * 16}px)`, opacity: Math.min(1, np * 2), zIndex: 4}}>{el.note.text}</div>
      )}
      <div style={{position: 'absolute', inset: '-25% -60%', background: 'radial-gradient(40% 45% at 50% 50%, rgba(255,150,80,0.7), transparent 70%)', mixBlendMode: 'screen', opacity: leak, transform: `translateX(${leakX}%)`, pointerEvents: 'none', zIndex: 5}} />
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
      case 'illus':
        return (
          <div style={{zoom: el.w ? el.w / ILLUS_W[el.name] : Math.min(1, (stageW - 10) / ILLUS_W[el.name])}}>
            <Illus name={el.name} steps={el.steps} start={start} labels={el.labels} />
          </div>
        );
      case 'chatsim':
        return <ChatSim app={el.app} items={el.items} w={el.w ?? Math.min(660, stageW)} />;
      case 'evidence':
        return <Evidence el={el} start={start} stageW={stageW} />;
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
  return <div style={{...inStyle(p, visible, 0), fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 66, color: K.ink}}>{op}</div>;
};

const Big: React.FC<{el: Extract<KEl, {kind: 'big'}>}> = ({el}) => {
  const {T} = useTiming();
  const sub = useIn(el.subAt === undefined ? -1 : T(el.subAt));
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, fontFamily: FONT_BODY, textAlign: 'center'}}>
      <div style={{fontFamily: FONT_HEAD, fontSize: el.text.length > 8 ? 130 : 190, fontWeight: 800, lineHeight: 0.95, color: ktone(el.tone), textShadow: '0 5px 0 rgba(0,0,0,0.06)', letterSpacing: -2}}>{el.text}</div>
      {el.sub && <div style={{...(el.subAt === undefined ? {} : inStyle(sub.p, sub.visible, 12)), fontSize: 38, fontWeight: 800, color: K.ink, background: K.sun, padding: '4px 16px', borderRadius: 10, boxShadow: SHADOW}}>{el.sub}</div>}
    </div>
  );
};
