import React from 'react';
import {Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, notch, pixelBox, tone} from '../theme';
import {popStyle, usePop, useTiming} from '../timing';
import type {Board, Item, Ring} from '../types';
import {Prop} from '../components/Prop';
import {Rich} from '../components/Rich';
import {Strike} from '../components/Strike';
import {StampMark, UiMock} from './Mock';

const Title: React.FC<{text?: string; from: number; size?: number}> = ({text, from, size = 66}) => {
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
      <Title text={b.text} from={start} size={b.text.length > 40 ? 72 : 88} />
      {b.sub && (
        <div style={popStyle(sub.p, sub.visible)}>
          <Label size={50} color={C.inkSoft} weight={700}>
            <Rich text={b.sub} from={b.subAt !== undefined ? T(b.subAt) : start} color={C.inkSoft} />
          </Label>
        </div>
      )}
      {b.items && <PropRow items={b.items} start={start} size={170} />}
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
      <Prop prop={it.prop} emoji={it.emoji} size={128} bg={it.tone ? tint(it.tone) : undefined} />
      <div style={{flex: 1, position: 'relative'}}>
        <div style={{fontFamily: FONT_BODY, fontWeight: 800, fontSize: 50, color: it.tone && it.tone !== 'accent' ? tone(it.tone) : C.ink, lineHeight: 1.1}}>
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
    <Title text={b.title} from={start} size={60} />
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, padding: '0 10px'}}>
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
        <div
          style={{
            width: 200,
            height: Math.round(h / 24) * 24,
            background: `repeating-linear-gradient(${col} 0 18px, ${C.ink} 18px 24px)`,
            boxShadow: `0 0 0 8px ${C.ink}, 10px 10px 0 8px ${C.ink}`,
          }}
        />
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
        ...pixelBox(it.tone ? tint(it.tone) : C.paperDeep, C.white, 8),
        clipPath: notch(8),
        ...popStyle(p, visible, 60),
        rotate: `${Math.round(tilt * p)}deg`,
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
            ...pixelBox(C.sun, C.white, 6),
            opacity: op.visible ? 1 : 0,
            transform: `scale(${op.p}) rotate(-6deg)`,
            width: 116,
            height: 116,
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
        border: `10px solid ${tone(r.tone ?? 'accent')}`,
        opacity: visible ? 1 : 0,
        transform: `scale(${(1.5 - 0.5 * p) * pulse})`,
        boxShadow: `0 0 0 5px ${C.ink}, inset 0 0 0 5px ${C.ink}`,
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
        <div style={{...pixelBox(C.ink, C.white, 8), padding: 16, lineHeight: 0}}>
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

// ---------- ui (mock layar realistis) ----------
const UiBoard: React.FC<{b: Extract<Board, {type: 'ui'}>; start: number}> = ({b, start}) => (
  <Col gap={30}>
    <Title text={b.title} from={start} size={56} />
    <UiMock b={b} start={start} />
  </Col>
);

// ---------- word (satu kata punchline, jendela gelap) ----------
const WordBoard: React.FC<{b: Extract<Board, {type: 'word'}>; start: number}> = ({b, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  const t0 = b.at === undefined ? start : T(b.at);
  const p = spring({frame: frame - t0, fps, config: {damping: 9, stiffness: 200, mass: 0.6}});
  const sub = usePop(b.subAt, start);
  const col = tone(b.tone ?? 'accent');
  const glow = 0.75 + 0.25 * Math.sin((frame - t0) / 6);
  const size = b.text.length > 8 ? 150 : b.text.length > 5 ? 200 : 260;
  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <Col gap={40}>
        <div style={{position: 'relative', opacity: frame >= t0 ? 1 : 0, transform: `scale(${0.4 + 0.6 * p})`}}>
          <div
            style={{
              position: 'absolute',
              inset: '-40% -20%',
              background: `radial-gradient(closest-side, ${col}${Math.round(glow * 160).toString(16).padStart(2, '0')}, transparent)`,
            }}
          />
          <div
            style={{
              position: 'relative',
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1,
              color: C.white,
              WebkitTextStroke: `14px ${C.ink}`,
              paintOrder: 'stroke fill',
              textShadow: `10px 10px 0 ${col}`,
              textAlign: 'center',
            }}
          >
            {b.text}
          </div>
        </div>
        {b.sub && (
          <div style={{...popStyle(sub.p, sub.visible), fontFamily: FONT_BODY, fontWeight: 800, fontSize: 50, color: C.paper, textAlign: 'center', lineHeight: 1.2}}>
            <Rich text={b.sub} from={b.subAt !== undefined ? T(b.subAt) : start} color={C.paper} />
          </div>
        )}
      </Col>
      <StampMark s={b.stamp} />
    </div>
  );
};

// ---------- boss (masalah jadi monster, HP turun saat solusi disebut) ----------
const BossBoard: React.FC<{b: Extract<Board, {type: 'boss'}>; start: number}> = ({b, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  const max = b.hp ?? 100;
  const hits = (b.hits ?? []).map((h) => ({...h, f: T(h.at)})).sort((a, c) => a.f - c.f);
  // HP turun bertahap (spring) per pukulan
  let hp = max;
  let lastHit: (typeof hits)[number] | undefined;
  hits.forEach((h) => {
    if (frame >= h.f) {
      const k = spring({frame: frame - h.f, fps, config: {damping: 20, stiffness: 140}});
      hp -= h.dmg * Math.min(1, k);
      lastHit = h;
    }
  });
  const defeatF = b.defeatAt !== undefined ? T(b.defeatAt) : Infinity;
  const dd = frame - defeatF;
  if (dd >= 0) hp = 0;
  hp = Math.max(0, hp);
  const ratio = hp / max;
  const barCol = ratio > 0.5 ? C.good : ratio > 0.25 ? C.warn : C.bad;
  const hd = lastHit ? frame - lastHit.f : 99;
  const hitFlash = hd >= 0 && hd < 6;
  const knock = hd >= 0 && hd < 12 ? Math.round(Math.sin(hd * 1.8) * (12 - hd) * 3) : 0;
  const idle = Math.round(Math.sin((frame - start) / 8) * 10 / 4) * 4;
  const appear = spring({frame: frame - start - 4, fps, config: {damping: 10, stiffness: 160}});
  const gone = dd >= 0 ? Math.min(1, dd / 18) : 0;
  const segs = 20;
  return (
    <Col gap={26}>
      <div style={{width: '92%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.ink}}>
          <span style={{fontSize: 46}}>{b.name}</span>
          <span style={{fontSize: 34, color: C.inkSoft}}>
            HP {Math.round(hp)}/{max}
          </span>
        </div>
        <div style={{display: 'flex', gap: 4, marginTop: 10, padding: 6, background: C.ink}}>
          {[...Array(segs)].map((_, i) => (
            <div key={i} style={{flex: 1, height: 34, background: i < Math.ceil(ratio * segs) ? barCol : '#3A3F66'}} />
          ))}
        </div>
      </div>
      <div style={{position: 'relative', flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            transform: `translate(${knock}px, ${idle}px) scale(${appear * (1 - gone)}) rotate(${gone * 540}deg)`,
            filter: hitFlash ? 'brightness(3) saturate(0)' : `drop-shadow(10px 10px 0 ${C.ink})`,
          }}
        >
          <Prop emoji={b.emoji} size={360} slot={false} />
        </div>
        {lastHit && hd >= 0 && hd < 28 && (
          <div
            style={{
              position: 'absolute',
              top: `${30 - hd * 0.6}%`,
              right: '12%',
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 90,
              color: C.white,
              WebkitTextStroke: `12px ${C.ink}`,
              paintOrder: 'stroke fill',
              textShadow: `6px 6px 0 ${C.bad}`,
              opacity: interpolate(hd, [20, 28], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}
          >
            {lastHit.text ?? `-${lastHit.dmg}`}
          </div>
        )}
        {[...hits.map((h) => frame - h.f), dd].map((d, k) =>
          d >= 0 && d < 20
            ? [...Array(12)].map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r = (1 - Math.exp(-d / 5)) * (k === hits.length ? 320 : 200);
                return (
                  <div
                    key={`${k}-${i}`}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${Math.round(Math.cos(a) * r)}px)`,
                      top: `calc(50% + ${Math.round(Math.sin(a) * r)}px)`,
                      width: k === hits.length ? 30 : 18,
                      height: k === hits.length ? 30 : 18,
                      background: k === hits.length ? C.sun : i % 2 ? C.accent : C.white,
                      boxShadow: `0 0 0 4px ${C.ink}`,
                      opacity: 1 - d / 20,
                      rotate: `${random(`r${i}`) * 90}deg`,
                    }}
                  />
                );
              })
            : null,
        )}
        {dd >= 6 && (
          <div
            style={{
              position: 'absolute',
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 150,
              color: C.sun,
              WebkitTextStroke: `16px ${C.ink}`,
              paintOrder: 'stroke fill',
              textShadow: `10px 10px 0 ${C.accent}`,
              transform: `scale(${spring({frame: dd - 6, fps, config: {damping: 8, stiffness: 220, mass: 0.5}})}) rotate(-6deg)`,
            }}
          >
            {b.defeatText ?? 'KALAH!'}
          </div>
        )}
      </div>
    </Col>
  );
};

// ---------- util ----------
const Col: React.FC<{children: React.ReactNode; gap: number; align?: 'center' | 'stretch'}> = ({children, gap, align = 'center'}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align, justifyContent: 'safe center', gap, width: '100%', height: '100%'}}>
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
    case 'ui':
      return <UiBoard b={b} start={start} />;
    case 'word':
      return <WordBoard b={b} start={start} />;
    case 'boss':
      return <BossBoard b={b} start={start} />;
  }
};

