import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PIXEL_ROOT} from '../components/Character';
import {Strike} from '../components/Strike';
import {C, FONT_BODY, FONT_PIXEL, tone} from '../theme';
import {popStyle, usePop, useTiming} from '../timing';
import type {Board, Stamp, UiLine} from '../types';

/**
 * Mock UI realistis di dalam jendela RPG: layar yang langsung dikenali penonton (form, checkout, notifikasi,
 * chat WA, struk, terminal, email, profil IG, komentar). Sengaja tidak di-pixel-kan agar terasa nyata;
 * bingkai tinta tebal menyambungkannya dengan dunia pixel.
 */
type UiB = Extract<Board, {type: 'ui'}>;

const MONO = '"DejaVu Sans Mono", ui-monospace, Menlo, monospace';
const BLUE = '#2563EB';
const GREY = '#6B7280';
const LINE = '#E5E7EB';

const Card: React.FC<{children: React.ReactNode; width?: number; bg?: string; color?: string; radius?: number; style?: React.CSSProperties}> = ({
  children,
  width = 720,
  bg = C.white,
  color = '#111827',
  radius = 30,
  style,
}) => (
  <div
    style={{
      width,
      background: bg,
      color,
      borderRadius: radius,
      boxShadow: `0 0 0 5px ${C.ink}, 10px 10px 0 5px ${C.ink}`,
      overflow: 'hidden',
      fontFamily: FONT_BODY,
      position: 'relative',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Teks yang diketik huruf demi huruf mulai kata `at`. */
const useTyped = (text: string, at: number | undefined, start: number, speed = 1.2) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  const t0 = at === undefined ? start : T(at);
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - t0) * speed)));
  return {shown: text.slice(0, n), done: n >= text.length, started: frame >= t0};
};

/** Chip jebakan: muncul miring di sisi kanan baris. */
const Flag: React.FC<{l: UiLine; start: number}> = ({l, start}) => {
  const {p, visible} = usePop(l.flagAt ?? l.at, start, {damping: 8, stiffness: 240, mass: 0.5});
  if (!l.flag) return null;
  return (
    <span
      style={{
        opacity: visible ? 1 : 0,
        transform: `scale(${p}) rotate(-4deg)`,
        background: tone(l.tone ?? 'bad'),
        color: C.white,
        fontWeight: 800,
        fontSize: 26,
        padding: '6px 14px',
        borderRadius: 10,
        boxShadow: `0 0 0 4px ${C.ink}`,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {l.flag}
    </span>
  );
};

/** Baris yang muncul (geser + pudar) pada kata `at`, dengan coretan dan chip jebakan. */
const Row: React.FC<{l: UiLine; start: number; children: React.ReactNode; style?: React.CSSProperties}> = ({l, start, children, style}) => {
  const {p, visible} = usePop(l.at, start);
  return (
    <div style={{...popStyle(p, visible, 24), display: 'flex', alignItems: 'center', gap: 16, position: 'relative', ...style}}>
      <div style={{flex: 1, minWidth: 0, position: 'relative'}}>
        {children}
        <Strike at={l.strikeAt} top="40%" />
      </div>
      <Flag l={l} start={start} />
    </div>
  );
};

const Btn: React.FC<{text: string; at?: number; start: number; color?: string; doneText?: string}> = ({text, at, start, color = BLUE, doneText}) => {
  const frame = useCurrentFrame();
  const {T} = useTiming();
  const t0 = at === undefined ? Infinity : T(at);
  const d = frame - t0;
  const press = d >= 0 && d < 8 ? 0.92 : 1;
  const done = d >= 4 && doneText;
  return (
    <div
      style={{
        background: done ? '#E5E7EB' : color,
        color: done ? '#111827' : C.white,
        fontWeight: 800,
        fontSize: 34,
        textAlign: 'center',
        padding: '20px 0',
        borderRadius: 16,
        transform: `scale(${press})`,
      }}
    >
      {done ? doneText : text}
    </div>
  );
};

/** Kursor panah pixel yang meluncur ke tombol lalu mengklik. */
const Cursor: React.FC<{at?: number; x: number; y: number}> = ({at, x, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  if (at === undefined) return null;
  const t0 = T(at);
  const m = spring({frame: frame - (t0 - 14), fps, config: {damping: 16, stiffness: 120}});
  const click = frame >= t0 && frame < t0 + 6 ? 0.85 : 1;
  const px = [
    '1000000000', '1100000000', '1210000000', '1221000000', '1222100000', '1222210000', '1222221000', '1222222100',
    '1222222210', '1222211111', '1221210000', '1210121000', '1100121000', '0000012100', '0000001100',
  ];
  return (
    <div style={{position: 'absolute', left: x + (1 - m) * 220, top: y + (1 - m) * 160, transform: `scale(${click})`, opacity: frame >= t0 - 14 ? 1 : 0, zIndex: 3}}>
      {px.map((row, r) =>
        [...row].map((c, k) =>
          c === '0' ? null : (
            <div key={`${r}-${k}`} style={{position: 'absolute', left: k * 6, top: r * 6, width: 6, height: 6, background: c === '1' ? C.ink : C.white}} />
          ),
        ),
      )}
    </div>
  );
};

/** Potret Pixel Aulia dalam lingkaran (avatar profil). */
const Avatar: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: C.sun, flexShrink: 0, boxShadow: `0 0 0 4px ${C.ink}`}}>
    <Img
      src={staticFile(`${PIXEL_ROOT}/characters/netral.png`)}
      style={{position: 'absolute', width: size * 3, left: -size, top: -size * 0.16, imageRendering: 'pixelated'}}
    />
  </div>
);

// ---------- jenis ----------
const Form: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <Card>
    <div style={{padding: '34px 40px 38px', display: 'flex', flexDirection: 'column', gap: 22}}>
      {b.app && <div style={{fontSize: 26, fontWeight: 700, color: GREY}}>{b.app}</div>}
      <div style={{fontSize: 44, fontWeight: 800}}>{b.meta ?? 'Buat akun'}</div>
      {b.items?.map((l, i) => (
        <Row key={i} l={l} start={start}>
          <div style={{fontSize: 24, fontWeight: 700, color: GREY, marginBottom: 6}}>{l.label}</div>
          <div style={{border: `3px solid ${LINE}`, borderRadius: 14, padding: '14px 18px', fontSize: 30, color: l.text ? '#111827' : '#9CA3AF', fontWeight: 600}}>
            {l.text ?? l.sub ?? ' '}
          </div>
        </Row>
      ))}
      {b.button && <Btn text={b.button} at={b.buttonAt} start={start} />}
    </div>
  </Card>
);

const Checkout: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <Card>
    <div style={{padding: '34px 40px 38px', display: 'flex', flexDirection: 'column', gap: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 700, color: GREY}}>
        <span>{b.app}</span>
        <span>🔒 aman</span>
      </div>
      {b.meta && <div style={{fontSize: 36, fontWeight: 800}}>{b.meta}</div>}
      {b.total && (
        <Row l={b.total} start={start}>
          <div style={{fontSize: 76, fontWeight: 800, letterSpacing: -2}}>
            {b.total.value}
            {b.total.sub && <span style={{fontSize: 32, color: GREY, fontWeight: 600}}> {b.total.sub}</span>}
          </div>
        </Row>
      )}
      {b.items?.map((l, i) => (
        <Row key={i} l={l} start={start}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 600, borderTop: `2px solid ${LINE}`, paddingTop: 14}}>
            <span style={{color: GREY}}>{l.label}</span>
            <span style={{color: l.tone ? tone(l.tone) : '#111827', fontWeight: 800}}>{l.value ?? l.text}</span>
          </div>
        </Row>
      ))}
      {b.button && <Btn text={b.button} at={b.buttonAt} start={start} color="#111827" />}
    </div>
  </Card>
);

const Notif: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <Card width={640} bg="linear-gradient(160deg,#1E2A4A,#4B2A5E 60%,#7A3B4F)" color={C.white} radius={44}>
    <div style={{padding: '40px 30px 40px', display: 'flex', flexDirection: 'column', gap: 16}}>
      <div style={{textAlign: 'center', fontSize: 22, fontWeight: 600, opacity: 0.85}}>{b.app ?? 'Senin, 2 November'}</div>
      <div style={{textAlign: 'center', fontSize: 120, fontWeight: 700, lineHeight: 1, marginBottom: 14}}>{b.meta ?? '09.41'}</div>
      {b.items?.map((l, i) => (
        <Row key={i} l={l} start={start}>
          <div style={{background: 'rgba(255,255,255,0.88)', color: '#111827', borderRadius: 24, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center'}}>
            <div style={{width: 58, height: 58, borderRadius: 14, background: l.tone ? tone(l.tone) : BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0}}>
              {l.emoji ?? '🔔'}
            </div>
            <div style={{minWidth: 0}}>
              <div style={{fontSize: 22, fontWeight: 700, color: GREY}}>{l.label}</div>
              <div style={{fontSize: 28, fontWeight: 800, lineHeight: 1.2}}>{l.text}</div>
              {l.sub && <div style={{fontSize: 24, fontWeight: 600, color: '#374151'}}>{l.sub}</div>}
            </div>
          </div>
        </Row>
      ))}
    </div>
  </Card>
);

const Chat: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <Card bg="#EFE7DD">
    <div style={{background: '#075E54', color: C.white, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 18}}>
      <div style={{width: 60, height: 60, borderRadius: '50%', background: '#CFD8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32}}>👤</div>
      <div>
        <div style={{fontSize: 32, fontWeight: 800}}>{b.app ?? 'Pelanggan'}</div>
        <div style={{fontSize: 22, opacity: 0.85}}>{b.meta ?? 'online'}</div>
      </div>
    </div>
    <div style={{padding: '26px 26px 32px', display: 'flex', flexDirection: 'column', gap: 14}}>
      {b.items?.map((l, i) => {
        const out = l.side === 'out';
        return (
          <Row key={i} l={l} start={start} style={{justifyContent: out ? 'flex-end' : 'flex-start'}}>
            <div style={{display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start'}}>
              <div style={{maxWidth: '82%', background: out ? '#D9FDD3' : C.white, borderRadius: 18, padding: '14px 20px 10px', fontSize: 30, fontWeight: 600, lineHeight: 1.25, boxShadow: '0 2px 0 rgba(0,0,0,0.12)'}}>
                {l.text}
                <div style={{fontSize: 20, color: GREY, textAlign: 'right', marginTop: 4}}>
                  {l.sub ?? '09.41'} {out ? <span style={{color: '#34B7F1'}}>✓✓</span> : null}
                </div>
              </div>
            </div>
          </Row>
        );
      })}
    </div>
  </Card>
);

const Receipt: React.FC<{b: UiB; start: number}> = ({b, start}) => {
  const zig = 'polygon(0 0,100% 0,100% calc(100% - 16px),95% 100%,90% calc(100% - 16px),85% 100%,80% calc(100% - 16px),75% 100%,70% calc(100% - 16px),65% 100%,60% calc(100% - 16px),55% 100%,50% calc(100% - 16px),45% 100%,40% calc(100% - 16px),35% 100%,30% calc(100% - 16px),25% 100%,20% calc(100% - 16px),15% 100%,10% calc(100% - 16px),5% 100%,0 calc(100% - 16px))';
  return (
    <div style={{filter: `drop-shadow(0 0 0 ${C.ink}) drop-shadow(10px 10px 0 ${C.ink})`}}>
      <div style={{width: 640, background: '#FFFDF6', clipPath: zig, padding: '34px 38px 54px', fontFamily: MONO, color: '#1F2937', display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{textAlign: 'center', fontSize: 34, fontWeight: 700, letterSpacing: 2}}>{b.app ?? 'STRUK'}</div>
        {b.meta && <div style={{textAlign: 'center', fontSize: 22, color: GREY}}>{b.meta}</div>}
        <div style={{borderTop: '3px dashed #9CA3AF'}} />
        {b.items?.map((l, i) => (
          <Row key={i} l={l} start={start}>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 26}}>
              <span>{l.label}</span>
              <span style={{color: l.tone ? tone(l.tone) : '#1F2937', fontWeight: 700, whiteSpace: 'nowrap'}}>{l.value}</span>
            </div>
            {l.sub && <div style={{fontSize: 20, color: GREY}}>{l.sub}</div>}
          </Row>
        ))}
        {b.total && (
          <>
            <div style={{borderTop: '3px dashed #9CA3AF'}} />
            <Row l={b.total} start={start}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 700}}>
                <span>{b.total.label ?? 'TOTAL'}</span>
                <span style={{color: tone(b.total.tone ?? 'bad')}}>{b.total.value}</span>
              </div>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

const TermLine: React.FC<{l: UiLine; start: number}> = ({l, start}) => {
  const {shown, started} = useTyped(l.text ?? '', l.at, start, 1.8);
  const col = l.tone ? tone(l.tone) : '#E5E7EB';
  if (!started) return null;
  return (
    <Row l={l} start={start}>
      <div style={{fontFamily: MONO, fontSize: 26, color: col, whiteSpace: 'pre-wrap', lineHeight: 1.35}}>
        {l.label ?? '$'} {shown}
      </div>
    </Row>
  );
};

const Terminal: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <Card bg="#0F1117" color="#E5E7EB" radius={20}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 22px', background: '#1F2330'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
        <span key={c} style={{width: 18, height: 18, borderRadius: '50%', background: c}} />
      ))}
      <span style={{flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: GREY}}>{b.app ?? 'terminal'}</span>
    </div>
    <div style={{padding: '24px 26px 30px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200}}>
      {b.items?.map((l, i) => <TermLine key={i} l={l} start={start} />)}
    </div>
  </Card>
);

const Email: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <Card>
    <div style={{padding: '30px 38px', borderBottom: `2px solid ${LINE}`, display: 'flex', gap: 18, alignItems: 'center'}}>
      <div style={{width: 64, height: 64, borderRadius: '50%', background: BLUE, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800}}>
        {(b.app ?? 'A').slice(0, 1).toUpperCase()}
      </div>
      <div style={{minWidth: 0}}>
        <div style={{fontSize: 28, fontWeight: 800}}>{b.app}</div>
        <div style={{fontSize: 24, color: GREY}}>kepada: daftar tunggu (10.000)</div>
      </div>
    </div>
    <div style={{padding: '24px 38px 34px', display: 'flex', flexDirection: 'column', gap: 16}}>
      {b.meta && <div style={{fontSize: 38, fontWeight: 800}}>{b.meta}</div>}
      {b.items?.map((l, i) => (
        <Row key={i} l={l} start={start}>
          <div style={{fontSize: 28, fontWeight: 600, color: l.tone ? tone(l.tone) : '#374151', lineHeight: 1.3}}>{l.text}</div>
        </Row>
      ))}
      {b.button && <Btn text={b.button} at={b.buttonAt} start={start} />}
    </div>
  </Card>
);

const Profile: React.FC<{b: UiB; start: number}> = ({b, start}) => (
  <div style={{position: 'relative'}}>
    <Card width={700}>
      <div style={{padding: '34px 40px 38px', display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{fontSize: 30, fontWeight: 800}}>{b.meta ?? 'auliarahman'}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <Avatar size={150} />
          <div style={{display: 'flex', flex: 1, justifyContent: 'space-around'}}>
            {(b.items ?? []).map((l, i) => (
              <div key={i} style={{textAlign: 'center'}}>
                <div style={{fontSize: 38, fontWeight: 800}}>{l.value}</div>
                <div style={{fontSize: 24, color: GREY, fontWeight: 600}}>{l.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize: 30, fontWeight: 800}}>{b.app ?? 'Aulia Rahman'}</div>
          {b.note && <div style={{fontSize: 26, color: '#374151', fontWeight: 600, lineHeight: 1.3, whiteSpace: 'pre-line'}}>{b.note}</div>}
        </div>
        <Btn text={b.button ?? 'Ikuti'} at={b.buttonAt} start={start} doneText="Mengikuti ✓" />
      </div>
    </Card>
    <Cursor at={b.buttonAt} x={420} y={560} />
  </div>
);

const CommentInput: React.FC<{b: UiB; start: number}> = ({b, start}) => {
  const frame = useCurrentFrame();
  const {shown, started, done} = useTyped(b.button ?? '', b.buttonAt ?? 10 ** 6, start, 0.6);
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, borderTop: `2px solid ${LINE}`, padding: '20px 30px'}}>
      <Avatar size={64} />
      <div style={{flex: 1, border: `3px solid ${started ? BLUE : LINE}`, borderRadius: 40, padding: '14px 24px', fontSize: 32, fontWeight: 800, color: '#111827'}}>
        {started ? shown : <span style={{color: '#9CA3AF', fontWeight: 600}}>Tambahkan komentar…</span>}
        {started && !done && caret && <span style={{color: BLUE}}>|</span>}
      </div>
      <div style={{width: 64, height: 64, borderRadius: '50%', background: done ? BLUE : '#BFD3FB', color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800}}>↑</div>
    </div>
  );
};

const Comments: React.FC<{b: UiB; start: number}> = ({b, start}) => {
  const palette = ['#F472B6', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'];
  return (
    <Card>
      <div style={{textAlign: 'center', fontSize: 30, fontWeight: 800, padding: '24px 0 10px'}}>{b.meta ?? 'Komentar'}</div>
      <div style={{padding: '10px 34px 20px', display: 'flex', flexDirection: 'column', gap: 18}}>
        {b.items?.map((l, i) => (
          <Row key={i} l={l} start={start}>
            <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
              <div style={{width: 56, height: 56, borderRadius: '50%', background: palette[i % palette.length], color: C.white, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {(l.label ?? '?').slice(0, 1).toUpperCase()}
              </div>
              <div style={{minWidth: 0}}>
                <div style={{fontSize: 22, fontWeight: 700, color: GREY}}>{l.label}</div>
                <div style={{fontSize: 30, fontWeight: 800}}>{l.text}</div>
              </div>
            </div>
          </Row>
        ))}
      </div>
      <CommentInput b={b} start={start} />
    </Card>
  );
};

/** Stempel besar miring: jatuh dari besar ke ukuran asli. */
export const StampMark: React.FC<{s?: Stamp}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  if (!s) return null;
  const t0 = T(s.at);
  if (frame < t0) return null;
  const p = spring({frame: frame - t0, fps, config: {damping: 14, stiffness: 260, mass: 0.6}});
  const col = tone(s.tone ?? 'bad');
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 4}}>
      <div
        style={{
          transform: `rotate(-12deg) scale(${interpolate(p, [0, 1], [2.6, 1])})`,
          opacity: Math.min(1, p * 3),
          border: `14px solid ${col}`,
          outline: `5px solid ${C.ink}`,
          borderRadius: 18,
          padding: '6px 40px',
          background: 'rgba(255,248,231,0.92)',
          fontFamily: FONT_PIXEL,
          fontWeight: 700,
          fontSize: s.text.length > 6 ? 96 : 140,
          color: col,
          letterSpacing: 6,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}
      >
        {s.text}
      </div>
    </div>
  );
};

export const UiMock: React.FC<{b: UiB; start: number}> = ({b, start}) => {
  const {p, visible} = usePop(b.at, start + 4);
  const body = (() => {
    switch (b.kind) {
      case 'form':
        return <Form b={b} start={start} />;
      case 'checkout':
        return <Checkout b={b} start={start} />;
      case 'notif':
        return <Notif b={b} start={start} />;
      case 'chat':
        return <Chat b={b} start={start} />;
      case 'receipt':
        return <Receipt b={b} start={start} />;
      case 'terminal':
        return <Terminal b={b} start={start} />;
      case 'email':
        return <Email b={b} start={start} />;
      case 'profile':
        return <Profile b={b} start={start} />;
      case 'comments':
        return <Comments b={b} start={start} />;
    }
  })();
  return (
    <div style={{...popStyle(p, visible, 50), position: 'relative', display: 'flex', justifyContent: 'center'}}>
      <div style={{zoom: b.zoom ?? 1.1}}>{body}</div>
      <StampMark s={b.stamp} />
    </div>
  );
};
