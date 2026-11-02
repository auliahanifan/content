import React from 'react';
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, sticker, tone} from '../theme';
import {popStyle, usePop, useTiming} from '../timing';
import type {Board, Item, Ring} from '../types';
import {Prop} from '../components/Prop';
import {Rich} from '../components/Rich';
import {Strike} from '../components/Strike';

const Title: React.FC<{text?: string; from: number; size?: number}> = ({text, from, size = 74}) => {
  const {p, visible} = usePop(undefined, from);
  if (!text) return null;
  return (
    <div
      style={{
        ...popStyle(p, visible, 20),
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -1.5,
        textAlign: 'center',
        color: C.ink,
      }}
    >
      <Rich text={text} from={from} />
    </div>
  );
};

/** Hitung naik 0 -> value dengan spring. */
const useCount = (value: number, start: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - start, fps, config: {damping: 30, stiffness: 60}});
  return Math.round(value * Math.min(1, s));
};

const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number}> = ({
  children,
  size = 46,
  color = C.ink,
  weight = 800,
}) => (
  <div style={{fontFamily: FONT_BODY, fontWeight: weight, fontSize: size, lineHeight: 1.15, color, textAlign: 'center'}}>
    {children}
  </div>
);

// ---------- title ----------
const TitleBoard: React.FC<{b: Extract<Board, {type: 'title'}>; start: number}> = ({b, start}) => {
  const {T} = useTiming();
  const sub = usePop(b.subAt, start);
  return (
    <Col gap={40}>
      <Title text={b.text} from={start} size={b.text.length > 40 ? 84 : 104} />
      {b.sub && (
        <div style={popStyle(sub.p, sub.visible)}>
          <Label size={50} color={C.inkSoft} weight={700}>
            <Rich text={b.sub} from={b.subAt !== undefined ? T(b.subAt) : start} color={C.inkSoft} />
          </Label>
        </div>
      )}
      {b.items && <PropRow items={b.items} start={start} size={200} />}
    </Col>
  );
};

// ---------- props ----------
const PropRow: React.FC<{items: Item[]; start: number; size: number}> = ({items, start, size}) => (
  <div style={{display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-start'}}>
    {items.map((it, i) => (
      <PropCell key={i} it={it} start={start} size={size} />
    ))}
  </div>
);

const PropCell: React.FC<{it: Item; start: number; size: number}> = ({it, start, size}) => {
  const {p, visible} = usePop(it.at, start);
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + (it.at ?? 0) * 7) / 14) * 5;
  return (
    <div style={{...popStyle(p, visible, 60), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: size + 100}}>
      <div style={{transform: `translateY(${bob}px)`}}>
        <Prop prop={it.prop} emoji={it.emoji} size={size} bg={it.tone ? tint(it.tone) : undefined} />
      </div>
      {it.label && (
        <div style={{position: 'relative'}}>
          <Label size={size > 220 ? 46 : 40}>{it.label}</Label>
          <Strike at={it.strikeAt} />
        </div>
      )}
    </div>
  );
};

const PropsBoard: React.FC<{b: Extract<Board, {type: 'props'}>; start: number}> = ({b, start}) => (
  <Col gap={50}>
    <Title text={b.title} from={start} />
    <PropRow items={b.items} start={start} size={b.items.length >= 3 ? 210 : 260} />
  </Col>
);

// ---------- list ----------
const ListRow: React.FC<{it: Item; start: number}> = ({it, start}) => {
  const {T} = useTiming();
  const {p, visible} = usePop(it.at, start);
  const sub = usePop(it.subAt ?? it.at, start);
  return (
    <div
      style={{
        opacity: visible ? Math.min(1, p * 1.6) : 0,
        transform: `translateX(${(1 - p) * -80}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <Prop prop={it.prop} emoji={it.emoji} size={150} bg={it.tone ? tint(it.tone) : undefined} />
      <div style={{flex: 1, position: 'relative'}}>
        <div style={{fontFamily: FONT_BODY, fontWeight: 800, fontSize: 54, color: it.tone && it.tone !== 'accent' ? tone(it.tone) : C.ink, lineHeight: 1.1}}>
          <Rich text={it.text ?? ''} from={T(it.at ?? 0)} />
        </div>
        {it.sub && (
          <div style={{...popStyle(sub.p, sub.visible, 14), fontFamily: FONT_BODY, fontWeight: 600, fontSize: 40, color: C.inkSoft, marginTop: 6, transformOrigin: 'left center'}}>
            {it.sub}
          </div>
        )}
        <Strike at={it.strikeAt} top="30%" />
      </div>
    </div>
  );
};

const ListBoard: React.FC<{b: Extract<Board, {type: 'list'}>; start: number}> = ({b, start}) => (
  <Col gap={44} align="stretch">
    <Title text={b.title} from={start} size={68} />
    <div style={{display: 'flex', flexDirection: 'column', gap: 34, padding: '0 10px'}}>
      {b.items.map((it, i) => (
        <ListRow key={i} it={it} start={start} />
      ))}
    </div>
  </Col>
);

// ---------- stat (batang) ----------
const Bar: React.FC<{it: Item; start: number; max: number}> = ({it, start, max}) => {
  const {T} = useTiming();
  const s0 = it.at === undefined ? start : T(it.at);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = spring({frame: frame - s0, fps, config: {damping: 14, stiffness: 90}});
  const n = useCount(it.value ?? 0, s0);
  const H = 300;
  const h = ((it.value ?? 0) / max) * H * Math.max(0, g);
  const col = tone(it.tone);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 280, opacity: frame >= s0 ? 1 : 0.18}}>
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 100, color: col, lineHeight: 1}}>
        {it.prefix}
        {n}
        {it.suffix}
      </div>
      <div style={{height: H, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{...sticker(10, col), width: 200, height: h, borderRadius: '28px 28px 8px 8px', boxSizing: 'border-box'}} />
      </div>
      <Label size={44}>{it.label}</Label>
    </div>
  );
};

const StatBoard: React.FC<{b: Extract<Board, {type: 'stat'}>; start: number}> = ({b, start}) => {
  const max = Math.max(...b.items.map((i) => i.value ?? 0), 1);
  return (
    <Col gap={30}>
      <Title text={b.title} from={start} size={68} />
      <div style={{display: 'flex', gap: 60, justifyContent: 'center', alignItems: 'flex-end'}}>
        {b.items.map((it, i) => (
          <Bar key={i} it={it} start={start} max={max} />
        ))}
      </div>
      {b.note && <Label size={36} color={C.inkSoft} weight={600}>{b.note}</Label>}
    </Col>
  );
};

// ---------- counts ----------
const CountCell: React.FC<{it: Item; start: number}> = ({it, start}) => {
  const {p, visible, start: s0} = usePop(it.at, start);
  const n = useCount(it.value ?? 0, s0);
  return (
    <div style={{...popStyle(p, visible, 60), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 280}}>
      <Prop prop={it.prop} emoji={it.emoji} size={170} bg={it.tone ? tint(it.tone) : undefined} />
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 140, lineHeight: 1, color: tone(it.tone)}}>{n}</div>
      <Label size={42}>{it.label}</Label>
    </div>
  );
};

const CountsBoard: React.FC<{b: Extract<Board, {type: 'counts'}>; start: number}> = ({b, start}) => (
  <Col gap={46}>
    <Title text={b.title} from={start} size={68} />
    <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
      {b.items.map((it, i) => (
        <CountCell key={i} it={it} start={start} />
      ))}
    </div>
  </Col>
);

// ---------- compare ----------
const CompareCard: React.FC<{it: Item; start: number; tilt: number}> = ({it, start, tilt}) => {
  const {T} = useTiming();
  const {p, visible} = usePop(it.at, start);
  return (
    <div
      style={{
        ...sticker(10, it.tone ? tint(it.tone) : C.bg),
        ...popStyle(p, visible, 60),
        rotate: `${tilt * p}deg`,
        borderRadius: 36,
        width: 360,
        padding: '36px 20px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
      }}
    >
      {it.label && <Label size={36} color={C.inkSoft} weight={700}>{it.label}</Label>}
      <Prop prop={it.prop} emoji={it.emoji} size={190} bg={C.paper} />
      <div style={{position: 'relative'}}>
        <Label size={50}>
          <Rich text={it.text ?? ''} from={T(it.at ?? 0)} />
        </Label>
        <Strike at={it.strikeAt} />
      </div>
    </div>
  );
};

const CompareBoard: React.FC<{b: Extract<Board, {type: 'compare'}>; start: number}> = ({b, start}) => {
  const op = usePop(b.opAt ?? b.right.at, start, {damping: 8, stiffness: 220, mass: 0.5});
  return (
    <Col gap={46}>
      <Title text={b.title} from={start} size={68} />
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <CompareCard it={b.left} start={start} tilt={-3} />
        <div
          style={{
            ...sticker(6, C.sun),
            opacity: op.visible ? 1 : 0,
            transform: `scale(${op.p})`,
            width: 110,
            height: 110,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 64,
            color: C.ink,
            zIndex: 2,
            flexShrink: 0,
          }}
        >
          {b.op ?? 'vs'}
        </div>
        <CompareCard it={b.right} start={start} tilt={3} />
      </div>
    </Col>
  );
};

// ---------- quote ----------
const QuoteBoard: React.FC<{b: Extract<Board, {type: 'quote'}>; start: number}> = ({b, start}) => {
  const {T} = useTiming();
  const from = b.at !== undefined ? T(b.at) : start;
  const {p, visible} = usePop(b.at, start);
  return (
    <Col gap={30}>
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 220, lineHeight: 0.6, color: C.accent, height: 110}}>“</div>
      <div style={{...popStyle(p, visible, 20), fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 70, lineHeight: 1.15, textAlign: 'center', color: C.ink}}>
        <Rich text={b.text} from={from} />
      </div>
      {b.source && <Label size={36} color={C.inkSoft} weight={600}>{b.source}</Label>}
    </Col>
  );
};

// ---------- shot (bukti layar) ----------
const RingBox: React.FC<{r: Ring}> = ({r}) => {
  const {p, visible} = usePop(r.at, 0, {damping: 9, stiffness: 160, mass: 0.6});
  const frame = useCurrentFrame();
  const {T} = useTiming();
  const pulse = 1 + Math.max(0, Math.sin((frame - T(r.at)) / 4)) * 0.04 * (frame - T(r.at) < 30 ? 1 : 0);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${r.x}%`,
        top: `${r.y}%`,
        width: `${r.w}%`,
        height: `${r.h}%`,
        border: `8px solid ${tone(r.tone ?? 'accent')}`,
        borderRadius: 999,
        opacity: visible ? 1 : 0,
        transform: `scale(${(1.5 - 0.5 * p) * pulse}) rotate(-3deg)`,
        boxShadow: `0 0 0 4px ${C.paper}`,
      }}
    />
  );
};

const ShotBoard: React.FC<{b: Extract<Board, {type: 'shot'}>; start: number}> = ({b, start}) => {
  const {p, visible} = usePop(undefined, start + 6);
  return (
    <Col gap={26}>
      <Title text={b.title} from={start} size={68} />
      <div style={{...popStyle(p, visible, 40), position: 'relative', width: '100%'}}>
        <div style={{...sticker(10), borderRadius: 24, overflow: 'hidden', lineHeight: 0}}>
          <Img src={staticFile(`video/${b.src}`)} style={{width: '100%'}} />
        </div>
        {b.rings?.map((r, i) => <RingBox key={i} r={r} />)}
      </div>
      {b.source && (
        <div style={{fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, color: C.inkSoft}}>{b.source}</div>
      )}
    </Col>
  );
};

// ---------- util ----------
const Col: React.FC<{children: React.ReactNode; gap: number; align?: 'center' | 'stretch'}> = ({children, gap, align = 'center'}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align, justifyContent: 'center', gap, width: '100%', height: '100%'}}>
    {children}
  </div>
);

const tint = (t: Parameters<typeof tone>[0]) => {
  const map: Record<string, string> = {
    good: '#D8F3EC',
    bad: '#FCDDE2',
    warn: '#FDEBC8',
    accent: '#FFE1D6',
    sky: '#DDF0FF',
    lilac: '#ECE6FE',
    sun: '#FFF0C2',
    ink: '#E6E7EE',
  };
  return map[t ?? 'accent'];
};

export const BoardContent: React.FC<{b: Board; start: number}> = ({b, start}) => {
  switch (b.type) {
    case 'title':
      return <TitleBoard b={b} start={start} />;
    case 'props':
      return <PropsBoard b={b} start={start} />;
    case 'list':
      return <ListBoard b={b} start={start} />;
    case 'stat':
      return <StatBoard b={b} start={start} />;
    case 'counts':
      return <CountsBoard b={b} start={start} />;
    case 'compare':
      return <CompareBoard b={b} start={start} />;
    case 'quote':
      return <QuoteBoard b={b} start={start} />;
    case 'shot':
      return <ShotBoard b={b} start={start} />;
  }
};

