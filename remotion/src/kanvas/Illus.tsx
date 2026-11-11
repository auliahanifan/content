import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY} from '../theme';
import {useTiming} from '../timing';
import {VIcon} from './Icons';
import {A, bigCard, cardSkin, FONT_HEAD, K, SHADOW} from './theme';

/**
 * Ilustrasi vektor beranimasi untuk panggung kanvas. Tiap ilustrasi digerakkan oleh `steps` (indeks kata):
 * tahap ke-n mulai saat kata steps[n] diucapkan. Semua digambar dengan kode (SVG/CSS), tanpa aset.
 */
export type IllusName = 'flipbook' | 'recipe-code' | 'render' | 'skill-folder' | 'tiers' | 'screenrec' | 'doors' | 'recipe-kitchen' | 'mold' | 'snap';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Frame mulai tiap tahap; tahap yang tidak ada = tidak pernah (Infinity). */
const useSteps = (steps: number[] | undefined, startFrame: number) => {
  const {T} = useTiming();
  const s = (steps ?? []).map((i) => T(i));
  return (n: number) => (n === -1 ? startFrame : s[n] ?? Infinity);
};

const useSpringAt = (start: number, config = {damping: 14, stiffness: 160, mass: 0.7}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame < start ? 0 : spring({frame: frame - start, fps, config});
};

/* ---------- flipbook: halaman membalik, bola bergerak antarhalaman, penghitung frame ---------- */
const Flipbook: React.FC<{steps?: number[]; start: number}> = ({steps, start}) => {
  const frame = useCurrentFrame();
  const at = useSteps(steps, start);
  const flipping = frame >= at(0);
  const t = flipping ? frame - at(0) : 0;
  const FLIP = 6; // frame per balikan
  const page = Math.floor(t / FLIP);
  const ph = (t % FLIP) / FLIP; // fase balikan 0..1
  const count = Math.round(interpolate(frame, [at(0), at(1) === Infinity ? at(0) + 60 : at(1)], [1, 1800], clamp));
  const ballX = 70 + ((page * 37) % 160);
  const ballY = 120 - Math.abs(Math.sin(page * 0.7)) * 70;
  return (
    <div style={{position: 'relative', width: 600, height: 470, fontFamily: FONT_HEAD}}>
      <svg width="600" height="400" viewBox="0 0 600 400" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* tumpukan halaman */}
        {[18, 12, 6].map((d) => (
          <rect key={d} x={300} y={40 + d} width={250 - d} height={300} rx={14} fill={K.card} stroke={K.line} strokeWidth={4} />
        ))}
        <rect x={50} y={40} width={250} height={300} rx={14} fill={K.card} stroke={K.line} strokeWidth={5} />
        <rect x={300} y={40} width={250} height={300} rx={14} fill={K.card} stroke={K.line} strokeWidth={5} />
        {/* gambar di halaman kanan: bola yang posisinya berubah tiap halaman */}
        <circle cx={300 + ballX} cy={60 + ballY + 80} r={26} fill={A()} stroke={K.line} strokeWidth={4} />
        <path d={`M320 300 H530`} stroke={K.line} strokeWidth={4} strokeLinecap="round" />
        {/* halaman yang sedang membalik */}
        {flipping && (
          <g transform={`translate(300 0) scale(${Math.cos(ph * Math.PI)} 1)`}>
            <rect x={0} y={40} width={250} height={300} rx={14} fill={ph < 0.5 ? K.card : K.sunSoft} stroke={K.line} strokeWidth={5} />
          </g>
        )}
        <path d="M300 40 V340" stroke={K.line} strokeWidth={6} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{...cardSkin, borderRadius: 999, padding: '10px 30px', fontSize: 44, fontWeight: 800, color: K.ink, fontVariantNumeric: 'tabular-nums'}}>
          halaman {count.toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
};

/* ---------- resep → kode: baris resep berubah jadi baris kode yang diketik ---------- */
const RECIPE = ['Judul muncul dari bawah', 'Kotak geser ke kanan', 'Angka naik ke 1.800'];
const CODE: [string, string][] = [
  ['title', '.from({ y: 80, opacity: 0 })'],
  ['box', '.to({ x: 420 }, 0.6)'],
  ['count', '.to({ value: 1800 })'],
];
const RecipeCode: React.FC<{steps?: number[]; start: number}> = ({steps, start}) => {
  const frame = useCurrentFrame();
  const at = useSteps(steps, start);
  const morph = interpolate(frame, [at(0), at(0) + 12], [0, 1], clamp);
  const typed = Math.max(0, frame - at(0) - 8) * 1.6;
  let budget = typed;
  return (
    <div style={{position: 'relative', width: 620, height: 470}}>
      {/* kartu resep */}
      <div style={{...cardSkin, position: 'absolute', inset: 0, padding: '34px 38px', opacity: 1 - morph, transform: `rotate(${-3 + morph * 3}deg) scale(${1 - morph * 0.06})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22}}>
          <VIcon name="recipe" size={70} color={K.sun} />
          <div style={{fontFamily: FONT_HEAD, fontSize: 48, fontWeight: 800, color: K.ink}}>Resep animasi</div>
        </div>
        {RECIPE.map((r, i) => (
          <div key={i} style={{fontFamily: FONT_BODY, fontSize: 36, fontWeight: 700, color: K.ink, padding: '12px 0', borderBottom: `3px dashed ${K.faint}`}}>
            {i + 1}. {r}
          </div>
        ))}
      </div>
      {/* jendela kode */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 28, border: 'none', boxShadow: SHADOW, background: K.ink, opacity: morph, transform: `scale(${0.94 + morph * 0.06})`, overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 10, padding: '18px 22px', background: '#26406A'}}>
          {[K.bad, K.warn, K.good].map((c) => (
            <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
          ))}
          <div style={{marginLeft: 12, fontFamily: FONT_BODY, fontSize: 24, fontWeight: 700, color: '#AFC0FF'}}>animasi.js</div>
        </div>
        <div style={{padding: '22px 28px', fontFamily: '"DejaVu Sans Mono", ui-monospace, monospace', fontSize: 30, lineHeight: 1.7}}>
          {CODE.map(([obj, call], i) => {
            const full = obj + call;
            const show = Math.max(0, Math.min(full.length, Math.floor(budget)));
            budget -= full.length;
            const a = full.slice(0, show);
            return (
              <div key={i} style={{whiteSpace: 'pre', minHeight: 51}}>
                <span style={{color: '#FFD84D'}}>{a.slice(0, obj.length)}</span>
                <span style={{color: '#9FE7C8'}}>{a.slice(obj.length)}</span>
                {show > 0 && show < full.length && <span style={{color: K.card, opacity: frame % 16 < 8 ? 1 : 0}}>▍</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- render: laptop menggambar frame satu per satu, progress, lalu file MP4 keluar ---------- */
const Render: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const frame = useCurrentFrame();
  const at = useSteps(steps, start);
  const end = at(1) === Infinity ? at(0) + 75 : at(1);
  const prog = interpolate(frame, [at(0), end], [0, 1], clamp);
  const tiles = 15;
  const filled = Math.floor(prog * tiles);
  const out = useSpringAt(at(2));
  return (
    <div style={{position: 'relative', width: 640, height: 500}}>
      <svg width="640" height="430" viewBox="0 0 640 430" style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={70} y={30} width={460} height={300} rx={22} fill={K.ink} stroke={K.line} strokeWidth={5} />
        <rect x={92} y={52} width={416} height={240} rx={10} fill={K.card} />
        <path d="M20 350 H580 L548 392 H52 Z" fill={K.card} stroke={K.line} strokeWidth={5} strokeLinejoin="round" />
        <rect x={250} y={350} width={100} height={12} rx={6} fill={K.faint} />
      </svg>
      {/* grid frame di layar */}
      <div style={{position: 'absolute', left: 104, top: 64, width: 392, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8}}>
        {Array.from({length: tiles}).map((_, i) => {
          const on = i < filled;
          const just = i === filled - 1;
          return (
            <div key={i} style={{height: 54, borderRadius: 6, border: 'none', background: on ? (i % 3 === 0 ? A() : i % 3 === 1 ? K.sun : K.good) : K.paper2, transform: just ? 'scale(1.12)' : undefined, position: 'relative', overflow: 'hidden'}}>
              {on && <div style={{position: 'absolute', width: 14, height: 14, borderRadius: 7, background: K.card, left: 6 + ((i * 9) % 36), top: 18}} />}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 104, top: 262, width: 392, height: 18, borderRadius: 9, border: 'none', background: K.card, overflow: 'hidden'}}>
        <div style={{width: `${prog * 100}%`, height: '100%', background: A()}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 404, textAlign: 'center', fontFamily: FONT_HEAD, fontSize: 40, fontWeight: 800, color: K.ink}}>
        {labels?.[0] ?? 'render'} {Math.round(prog * 100)}%
      </div>
      {/* file MP4 */}
      <div style={{position: 'absolute', right: -10, top: 110, opacity: Math.min(1, out * 1.5), transform: `translate(${(1 - out) * -160}px, ${(1 - out) * 40}px) scale(${0.5 + out * 0.5}) rotate(${(1 - out) * -20 + 6}deg)`}}>
        <div style={{...cardSkin, width: 170, padding: '18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <VIcon name="film" size={90} color={K.bad} />
          <div style={{fontFamily: FONT_HEAD, fontSize: 40, fontWeight: 800, color: K.ink}}>{labels?.[1] ?? 'MP4'}</div>
        </div>
      </div>
    </div>
  );
};

/* ---------- folder skill: map terbuka, file keluar ---------- */
const SkillFolder: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const at = useSteps(steps, start);
  const open = useSpringAt(at(0));
  const files = labels ?? ['SKILL.md', 'contoh.html', 'skrip.py'];
  return (
    <div style={{position: 'relative', width: 600, height: 470}}>
      {files.map((f, i) => {
        const p = useSpringAtFile(at(0) + 6 + i * 6);
        return (
          <div key={f} style={{position: 'absolute', left: 50 + i * 175, top: 230 - p * (250 - Math.abs(i - 1) * 40), opacity: Math.min(1, p * 2), transform: `rotate(${(i - 1) * 10 * p}deg)`, zIndex: 1}}>
            <div style={{...cardSkin, borderRadius: 16, width: 170, padding: '14px 0 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <VIcon name={i === 0 ? 'file' : i === 1 ? 'code' : 'terminal'} size={64} color={i === 0 ? K.sun : i === 1 ? A() : K.good} />
              <div style={{fontFamily: FONT_BODY, fontSize: 24, fontWeight: 800, color: K.ink}}>{f}</div>
            </div>
          </div>
        );
      })}
      <svg width="600" height="470" viewBox="0 0 600 470" style={{position: 'absolute', left: 0, top: 0, zIndex: 2, overflow: 'visible'}}>
        <path d="M70 200 a14 14 0 0 1 14-14 H220 l30 30 H516 a14 14 0 0 1 14 14 V430 a14 14 0 0 1-14 14 H84 a14 14 0 0 1-14-14 Z" fill={K.teal} stroke={K.line} strokeWidth={6} strokeLinejoin="round" />
        <g transform={`translate(70 250) skewX(${-open * 14}) scale(1 ${1 - open * 0.25})`}>
          <path d="M0 0 H460 a14 14 0 0 1 14 14 V180 a14 14 0 0 1-14 14 H14 a14 14 0 0 1-14-14 Z" fill="#5FA9AE" stroke={K.line} strokeWidth={6} strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};
// hook kecil terpisah supaya aturan hooks tetap konsisten di dalam map berukuran tetap
const useSpringAtFile = (start: number) => useSpringAt(start);

/* ---------- tiers: paket Claude, mana yang dapat fitur ---------- */
const TIERS = [
  {id: 'Free', grp: 0},
  {id: 'Pro', grp: 0},
  {id: 'Max', grp: 0},
  {id: 'Team', grp: 1},
  {id: 'Enterprise', grp: 1},
];
const Tiers: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const frame = useCurrentFrame();
  const at = useSteps(steps, start);
  const yes = useSpringAt(at(0));
  const no = useSpringAt(at(1));
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center', width: 940}}>
      <div style={{display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center'}}>
        {TIERS.map((t, i) => {
          const isYes = t.grp === 1;
          const p = isYes ? yes : no;
          const appear = spring({frame: frame - start - i * 3, fps: 30, config: {damping: 14}});
          return (
            <div
              key={t.id}
              style={{
                ...cardSkin,
                borderRadius: 22,
                width: t.id === 'Enterprise' ? 330 : 270,
                padding: '26px 0 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                background: isYes && p > 0 ? K.goodSoft : !isYes && p > 0 ? '#F1F2F6' : K.card,
                opacity: Math.min(1, appear * 1.4) * (!isYes ? 1 - p * 0.35 : 1),
                transform: `translateY(${(1 - appear) * 30}px) scale(${isYes ? 1 + p * 0.06 : 1 - p * 0.04})`,
              }}
            >
              <div style={{fontFamily: FONT_HEAD, fontSize: 50, fontWeight: 800, color: K.ink}}>{t.id}</div>
              <div style={{height: 84, display: 'flex', alignItems: 'center', transform: `scale(${p})`}}>
                {p > 0 && <VIcon name={isYes ? 'check' : 'cross'} size={78} color={isYes ? K.good : K.bad} />}
              </div>
            </div>
          );
        })}
      </div>
      {labels?.[0] && (
        <div style={{fontFamily: FONT_HEAD, fontSize: 40, fontWeight: 800, color: K.ink, opacity: yes, background: K.sun, boxShadow: SHADOW, borderRadius: 12, padding: '6px 18px'}}>{labels[0]}</div>
      )}
    </div>
  );
};

/* ---------- screenrec: HP memutar animasi artifact sambil merekam ---------- */
const ScreenRec: React.FC<{steps?: number[]; start: number}> = ({steps, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useSteps(steps, start);
  const rec = frame >= at(0);
  const sec = rec ? Math.floor((frame - at(0)) / fps) : 0;
  const t = (frame - start) / fps;
  return (
    <div style={{position: 'relative', width: 340, height: 660}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 54, background: K.ink, padding: 16, boxShadow: SHADOW}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 40, background: K.card, overflow: 'hidden'}}>
          {/* animasi artifact sederhana */}
          <div style={{position: 'absolute', left: 30, top: 120 + Math.sin(t * 3) * 30, width: 70, height: 70, borderRadius: 18, background: A(), border: 'none', transform: `rotate(${t * 90}deg)`}} />
          <div style={{position: 'absolute', right: 34, top: 240 + Math.cos(t * 2.4) * 40, width: 80, height: 80, borderRadius: 40, background: K.sun, border: 'none'}} />
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 120, height: 22, borderRadius: 11, background: K.paper2, overflow: 'hidden'}}>
            <div style={{width: `${((t * 25) % 100)}%`, height: '100%', background: K.good}} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 800, color: K.ink}}>artifact</div>
          {rec && (
            <div style={{position: 'absolute', left: 20, top: 74, display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT_BODY, fontSize: 24, fontWeight: 800, color: K.bad}}>
              <div style={{width: 16, height: 16, borderRadius: 8, background: K.bad, opacity: frame % 30 < 18 ? 1 : 0.2}} />
              REC 0:{String(sec).padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- doors: tiap paket = pintu; yang dapat fitur terbuka dan bercahaya (0: buka, 1: gembok bergetar) ---------- */
const DOORS = [
  {id: 'Free', ok: false},
  {id: 'Pro', ok: false},
  {id: 'Max', ok: false},
  {id: 'Ultra', ok: false},
  {id: 'Team', ok: true},
  {id: 'Enterprise', ok: true},
];
const Doors: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useSteps(steps, start);
  const open = useSpringAt(at(0), {damping: 11, stiffness: 120, mass: 0.8});
  const shakeT = frame - at(1);
  const shake = shakeT >= 0 && shakeT < 26 ? Math.sin(shakeT * 1.6) * 16 * (1 - shakeT / 26) : 0;
  return (
    <div style={{position: 'relative', width: 940, height: 660}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 300, borderRadius: '32px 32px 0 0', background: `linear-gradient(180deg, ${K.teal}, #7FB7AE)`, overflow: 'hidden'}}>
        {[[90, 70, 160], [560, 120, 120], [740, 50, 90]].map(([x, y, w], i) => (
          <div key={i} style={{position: 'absolute', left: x + Math.sin((frame + i * 40) / 60) * 8, top: y, width: w, height: 36, borderRadius: 20, background: K.card, boxShadow: SHADOW}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, bottom: 0, borderRadius: '0 0 32px 32px', background: K.paper2, boxShadow: '0 -8px 16px -10px rgba(60,35,10,.4)'}} />
      {DOORS.map((d, i) => {
        const ap = spring({frame: frame - start - i * 4, fps, config: {damping: 12, stiffness: 170, mass: 0.6}});
        const x = 22 + i * 152;
        const o = d.ok ? open : 0;
        return (
          <div key={d.id} style={{position: 'absolute', left: x, top: 250, width: 136, opacity: Math.min(1, ap * 2), transform: `translateY(${(1 - ap) * 80}px)`}}>
            <div style={{textAlign: 'center', fontFamily: FONT_HEAD, fontWeight: 800, fontSize: d.id.length > 6 ? 27 : 36, color: d.ok && o > 0.3 ? K.ink : K.soft, marginBottom: 14, whiteSpace: 'nowrap'}}>{d.id}</div>
            <div style={{position: 'relative', height: 330, perspective: 600}}>
              <div style={{position: 'absolute', inset: 0, borderRadius: '75px 75px 0 0', background: '#1E2C46', overflow: 'hidden'}}>
                <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 70%, #FFE6A6, #F2C14E 50%, #E9A93B)', opacity: o}} />
                {d.ok && <div style={{position: 'absolute', left: 30, top: 150, opacity: o}}><VIcon name="film" size={76} color={K.bad} /></div>}
              </div>
              <div style={{position: 'absolute', inset: 0, borderRadius: '75px 75px 0 0', background: d.ok ? A() : K.ink, transformOrigin: 'left center', transform: `rotateY(${-74 * o}deg)`, boxShadow: 'inset -10px 0 0 rgba(0,0,0,.18)'}}>
                {!d.ok && (
                  <div style={{position: 'absolute', left: 43, top: 170, width: 50, height: 44, transform: `rotate(${shake}deg)`, transformOrigin: '50% 0'}}>
                    <div style={{position: 'absolute', left: 9, top: -24, width: 32, height: 34, border: `8px solid ${K.sun}`, borderBottom: 'none', borderRadius: '18px 18px 0 0'}} />
                    <div style={{position: 'absolute', inset: 0, borderRadius: 9, background: K.sun, boxShadow: SHADOW}} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {labels?.[0] && (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 38, color: K.ink, background: K.card, padding: '10px 26px', borderRadius: 14, boxShadow: SHADOW, opacity: open}}>{labels[0]}</div>
        </div>
      )}
    </div>
  );
};

/* ---------- recipe-kitchen: resep ditulis (0), masuk laptop (1), video keluar (2) ---------- */
const RecipeKitchen: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useSteps(steps, start);
  const lines = labels?.length ? labels : ['Judul naik dari bawah', 'Kotak geser ke kanan', 'Angka naik ke 1.800'];
  const fly = interpolate(frame, [at(1), at(1) + 16], [0, 1], {...clamp, easing: Easing.bezier(0.6, 0, 0.4, 1)});
  const cook = frame - (at(1) + 14);
  const reel = useSpringAt(at(2), {damping: 10, stiffness: 150, mass: 0.7});
  const drop = useSpringAt(start, {damping: 12, stiffness: 160, mass: 0.7});
  return (
    <div style={{position: 'relative', width: 600, height: 760}}>
      {/* laptop */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 400, height: 250, borderRadius: '22px 22px 8px 8px', background: K.ink, padding: 16, boxShadow: SHADOW}}>
        <div style={{width: '100%', height: '100%', borderRadius: 10, background: K.card, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr) 16px', gap: 8}}>
          {Array.from({length: 8}).map((_, i) => {
            const tp = cook < i * 3 ? 0 : spring({frame: cook - i * 3, fps, config: {damping: 11, stiffness: 200, mass: 0.5}});
            return <div key={i} style={{borderRadius: 6, background: [A(), K.sun, K.teal][i % 3], transform: `scale(${tp})`}} />;
          })}
          <div style={{gridColumn: '1 / -1', borderRadius: 8, background: K.paper2, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${interpolate(cook, [0, 30], [0, 100], clamp)}%`, background: K.good}} />
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, height: 46, borderRadius: '8px 8px 28px 28px', background: K.paper2, boxShadow: SHADOW}} />
      {/* kartu resep */}
      <div style={{position: 'absolute', left: 90, top: 20, width: 420, padding: '26px 30px', ...bigCard(), opacity: Math.min(1, drop * 2) * (1 - fly), transform: `translate(0px, ${(1 - drop) * -120 + fly * 420}px) scale(${1 - fly * 0.62}) rotate(${-3 * (1 - fly) - (1 - drop) * 8}deg)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12}}>
          <VIcon name="recipe" size={54} color={K.sun} />
          <div style={{fontFamily: FONT_HEAD, fontSize: 40, fontWeight: 800, color: K.ink}}>Resep</div>
        </div>
        {lines.map((l, i) => {
          const rp = interpolate(frame, [at(0) + i * 7, at(0) + i * 7 + 9], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
          return (
            <div key={i} style={{fontFamily: FONT_BODY, fontSize: 28, fontWeight: 700, color: K.ink, padding: '9px 0', borderBottom: `2px dashed ${K.line}`, clipPath: `inset(0 ${100 - rp * 100}% 0 0)`}}>
              {i + 1}. {l}
            </div>
          );
        })}
      </div>
      {/* video keluar */}
      <div style={{position: 'absolute', right: -6, top: 300, width: 190, padding: '18px 0 14px', ...bigCard(), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: Math.min(1, reel * 2), transform: `translate(${(1 - reel) * -160}px, ${(1 - reel) * 150}px) scale(${0.3 + 0.7 * reel}) rotate(${6 - (1 - reel) * 24}deg)`}}>
        <VIcon name="film" size={84} color={K.bad} />
        <div style={{fontFamily: FONT_BODY, fontSize: 26, fontWeight: 800, color: K.ink}}>video.mp4</div>
      </div>
    </div>
  );
};

/* ---------- mold: cetakan dibuat sekali, tiap tahap mencetak satu video baru dengan isi berbeda, gaya sama ---------- */
const Mold: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useSteps(steps, start);
  const names = labels?.length ? labels : ['Video 1', 'Video 2', 'Video 3'];
  const drop = useSpringAt(start, {damping: 12, stiffness: 150, mass: 0.8});
  const colors = [A(), K.teal, K.sun];
  // tahap aktif: indeks cetakan terakhir yang sudah mulai
  let cur = -1;
  names.forEach((_, i) => {
    if (frame >= at(i)) cur = i;
  });
  const local = cur >= 0 ? frame - at(cur) : 0;
  const press = cur >= 0 ? interpolate(local, [6, 11, 17], [0, 1, 0], {...clamp, easing: Easing.bezier(0.5, 0, 0.5, 1)}) : 0;
  const slide = cur >= 0 ? interpolate(local, [0, 8], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)}) : 0;
  const Thumb: React.FC<{name: string; c: string; scale?: number}> = ({name, c, scale = 1}) => (
    <div style={{width: 230 * scale, padding: 14 * scale, ...cardSkin, borderRadius: 18 * scale, display: 'flex', flexDirection: 'column', gap: 9 * scale}}>
      <div style={{height: 22 * scale, width: '70%', borderRadius: 6, background: K.ink}} />
      <div style={{display: 'flex', gap: 8 * scale}}>
        <div style={{flex: 1, height: 70 * scale, borderRadius: 10 * scale, background: c}} />
        <div style={{width: 54 * scale, height: 70 * scale, borderRadius: 10 * scale, background: K.paper2}} />
      </div>
      <div style={{fontFamily: FONT_BODY, fontSize: 26 * scale, fontWeight: 800, color: K.ink, whiteSpace: 'nowrap'}}>{name}</div>
    </div>
  );
  return (
    <div style={{position: 'relative', width: 600, height: 760}}>
      {/* meja */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, height: 26, borderRadius: 13, background: K.paper2, boxShadow: SHADOW}} />
      {/* adonan yang sedang dicetak */}
      {cur >= 0 && (
        <div style={{position: 'absolute', left: 185, top: 300, transform: `translateX(${(1 - slide) * -420}px)`, opacity: interpolate(local, [24, 30], [1, 0], clamp)}}>
          <Thumb name={names[cur]} c={colors[cur % 3]} />
        </div>
      )}
      {/* cetakan */}
      <div style={{position: 'absolute', left: 160, top: 40, width: 280, opacity: Math.min(1, drop * 2), transform: `translateY(${(1 - drop) * -160 + press * 150}px) rotate(${(1 - drop) * -10}deg)`}}>
        <div style={{height: 200, borderRadius: 28, background: A(), boxShadow: SHADOW, padding: 22, display: 'flex', flexDirection: 'column', gap: 12}}>
          <div style={{height: 26, width: '70%', borderRadius: 8, border: `4px dashed ${K.card}`}} />
          <div style={{display: 'flex', gap: 12, flex: 1}}>
            <div style={{flex: 1, borderRadius: 12, border: `4px dashed ${K.card}`}} />
            <div style={{width: 64, borderRadius: 12, border: `4px dashed ${K.card}`}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 110, top: -56, width: 60, height: 60, borderRadius: 14, background: K.ink}} />
      </div>
      <div style={{position: 'absolute', left: 462, top: 96, fontFamily: FONT_HEAD, fontSize: 40, fontWeight: 800, color: K.soft, transform: 'rotate(6deg)', opacity: Math.min(1, drop * 2)}}>cetakan</div>
      {/* tumpukan hasil: isi beda, gaya sama */}
      {names.map((n, i) => {
        const pop = frame < at(i) + 18 ? 0 : spring({frame: frame - at(i) - 18, fps, config: {damping: 12, stiffness: 170, mass: 0.6}});
        if (pop <= 0) return null;
        const x = 6 + i * 198;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 500, opacity: Math.min(1, pop * 2), transform: `translateY(${(1 - pop) * -170}px) rotate(${[-3, 1, 3][i % 3] * pop}deg) scale(${0.64 + 0.2 * pop})`, transformOrigin: 'top left'}}>
            <Thumb name={n} c={colors[i % 3]} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- snap: video di-pause, playhead digeser ke detik tertentu, kamera menjepret, foto keluar ---------- */
const Snap: React.FC<{steps?: number[]; start: number; labels?: string[]}> = ({steps, start, labels}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useSteps(steps, start);
  const sec = labels?.[0] ?? 'detik 3';
  const drop = useSpringAt(start, {damping: 13, stiffness: 150, mass: 0.7});
  const scrub = interpolate(frame, [at(0), at(0) + 14], [0.12, 0.5], {...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1)});
  const flash = frame >= at(1) ? interpolate(frame - at(1), [0, 3, 12], [0, 1, 0], clamp) : 0;
  const photo = useSpringAt(at(1) + 4, {damping: 12, stiffness: 160, mass: 0.7});
  const nextScrub = frame >= at(2) ? interpolate(frame, [at(2), at(2) + 10], [0.5, 0.62], clamp) : 0.5;
  const pos = frame >= at(2) ? nextScrub : scrub;
  const ballX = 60 + pos * 380;
  const ballY = 150 - Math.sin(pos * Math.PI * 2) * 60;
  return (
    <div style={{position: 'relative', width: 600, height: 720}}>
      {/* layar video */}
      <div style={{position: 'absolute', left: 30, top: 30, width: 540, padding: 18, ...bigCard(), opacity: Math.min(1, drop * 2), transform: `translateY(${(1 - drop) * -120}px)`}}>
        <div style={{position: 'relative', height: 280, borderRadius: 16, background: K.paper2, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: ballX, top: ballY, width: 64, height: 64, borderRadius: 32, background: A()}} />
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 34, height: 6, borderRadius: 3, background: K.line}} />
          {/* tombol pause */}
          <div style={{position: 'absolute', left: 18, top: 16, display: 'flex', gap: 8}}>
            <div style={{width: 14, height: 40, borderRadius: 4, background: K.ink}} />
            <div style={{width: 14, height: 40, borderRadius: 4, background: K.ink}} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
        </div>
        {/* timeline */}
        <div style={{position: 'relative', height: 60, marginTop: 14}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 10, borderRadius: 5, background: K.paper2}} />
          <div style={{position: 'absolute', left: 0, width: `${pos * 100}%`, top: 26, height: 10, borderRadius: 5, background: A()}} />
          <div style={{position: 'absolute', left: `calc(${pos * 100}% - 16px)`, top: 15, width: 32, height: 32, borderRadius: 16, background: K.ink, boxShadow: SHADOW}} />
          <div style={{position: 'absolute', left: `calc(${pos * 100}% - 60px)`, top: -34, width: 120, textAlign: 'center', fontFamily: FONT_BODY, fontSize: 28, fontWeight: 800, color: K.ink}}>{frame >= at(2) ? labels?.[1] ?? 'detik 3,03' : sec}</div>
        </div>
      </div>
      {/* kamera */}
      <div style={{position: 'absolute', left: 40, top: 470, opacity: Math.min(1, drop * 2)}}>
        <div style={{width: 170, height: 120, borderRadius: 22, background: K.ink, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 74, height: 74, borderRadius: 37, background: K.card, border: `10px solid ${K.soft}`}} />
        </div>
        <div style={{position: 'absolute', left: 22, top: -18, width: 46, height: 22, borderRadius: 6, background: K.ink}} />
      </div>
      {/* foto hasil jepretan */}
      <div style={{position: 'absolute', left: 270, top: 440, width: 260, padding: '14px 14px 18px', background: K.card, borderRadius: 12, boxShadow: SHADOW, opacity: Math.min(1, photo * 2), transform: `translate(${(1 - photo) * -200}px, ${(1 - photo) * 40}px) rotate(${5 * photo - 12 * (1 - photo)}deg) scale(${0.5 + 0.5 * photo})`}}>
        <div style={{position: 'relative', height: 140, borderRadius: 8, background: K.paper2, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 60 + 0.5 * 160, top: 40, width: 46, height: 46, borderRadius: 23, background: A()}} />
        </div>
        <div style={{fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 800, color: K.ink, marginTop: 10, textAlign: 'center'}}>{sec}</div>
      </div>
    </div>
  );
};

export const ILLUS_W: Record<IllusName, number> = {flipbook: 600, 'recipe-code': 620, render: 640, 'skill-folder': 600, tiers: 940, screenrec: 340, doors: 940, 'recipe-kitchen': 600, mold: 600, snap: 600};

export const Illus: React.FC<{name: IllusName; steps?: number[]; start: number; labels?: string[]}> = ({name, steps, start, labels}) => {
  switch (name) {
    case 'flipbook':
      return <Flipbook steps={steps} start={start} />;
    case 'recipe-code':
      return <RecipeCode steps={steps} start={start} />;
    case 'render':
      return <Render steps={steps} start={start} labels={labels} />;
    case 'skill-folder':
      return <SkillFolder steps={steps} start={start} labels={labels} />;
    case 'tiers':
      return <Tiers steps={steps} start={start} labels={labels} />;
    case 'screenrec':
      return <ScreenRec steps={steps} start={start} />;
    case 'doors':
      return <Doors steps={steps} start={start} labels={labels} />;
    case 'recipe-kitchen':
      return <RecipeKitchen steps={steps} start={start} labels={labels} />;
    case 'mold':
      return <Mold steps={steps} start={start} labels={labels} />;
    case 'snap':
      return <Snap steps={steps} start={start} labels={labels} />;
  }
};

/* ---------- simulasi chat AI generik (tanpa logo merek) ---------- */
export type ChatMsg = {at: number; side: 'user' | 'ai'; text?: string; artifact?: string};

export const ChatSim: React.FC<{app?: string; items: ChatMsg[]; w?: number}> = ({app = 'Chat AI', items, w = 640}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {T} = useTiming();
  return (
    <div style={{...bigCard(), width: w, fontFamily: FONT_BODY}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderBottom: `2px solid ${K.line}`, background: K.paper2, borderRadius: '28px 28px 0 0'}}>
        <VIcon name="sparkle" size={38} color={K.warn} />
        <div style={{fontFamily: FONT_HEAD, fontSize: 36, fontWeight: 800, color: K.ink}}>{app}</div>
      </div>
      <div style={{padding: 28, display: 'flex', flexDirection: 'column', gap: 22, minHeight: 340}}>
        {items.map((m, i) => {
          const st = T(m.at);
          if (frame < st) return <div key={i} style={{height: 0}} />;
          const p = spring({frame: frame - st, fps, config: {damping: 15, stiffness: 180}});
          const user = m.side === 'user';
          const text = m.text ?? '';
          const typed = user ? text.slice(0, Math.floor((frame - st) * 1.8)) : text;
          const thinking = !user && frame - st < 14;
          return (
            <div key={i} style={{alignSelf: user ? 'flex-end' : 'flex-start', maxWidth: '86%', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 20}px)`}}>
              {m.artifact ? (
                <div style={{borderRadius: 20, overflow: 'hidden', background: K.card, width: 420, boxShadow: SHADOW}}>
                  <div style={{padding: '10px 16px', background: K.sunSoft, borderBottom: `2px solid ${K.line}`, fontSize: 24, fontWeight: 800, color: K.ink}}>▶ {m.artifact}</div>
                  <div style={{position: 'relative', height: 150, background: K.paper2}}>
                    <div style={{position: 'absolute', left: 30 + ((frame - st) * 4) % 300, top: 50, width: 50, height: 50, borderRadius: 14, background: A(), border: 'none'}} />
                    <div style={{position: 'absolute', right: 40, top: 30 + Math.sin((frame - st) / 8) * 30, width: 44, height: 44, borderRadius: 22, background: K.sun, border: 'none'}} />
                  </div>
                </div>
              ) : (
                <div style={{padding: '20px 26px', borderRadius: 24, boxShadow: SHADOW, background: user ? A() : K.card, color: user ? K.card : K.ink, fontSize: 38, fontWeight: 800, lineHeight: 1.25}}>
                  {thinking ? <span style={{letterSpacing: 6}}>{'•••'.slice(0, 1 + (Math.floor((frame - st) / 4) % 3))}</span> : typed}
                  {user && typed.length < text.length && <span style={{opacity: frame % 14 < 7 ? 1 : 0}}>▍</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
