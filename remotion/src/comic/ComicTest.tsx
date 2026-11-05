import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import bangers from '@fontsource/bangers/files/bangers-latin-400-normal.woff2';
import comic700 from '@fontsource/comic-neue/files/comic-neue-latin-700-normal.woff2';

// Klip uji 13 detik gaya Motion Comic (TH-098, kalimat pembuka). Belum dipakai storyboard.
const INK = '#111';
const YEL = '#FFD23F';
const RED = '#E63B2E';
const PACK = 'shared/motion-comic-aulia';
const f = (s: number) => Math.round(s * 30);

let fontsReady = false;
const useFonts = () => {
  if (fontsReady || typeof document === 'undefined') return;
  fontsReady = true;
  const h = delayRender('comic-fonts');
  Promise.all(
    [new FontFace('Bangers', `url(${bangers}) format('woff2')`), new FontFace('Comic Neue', `url(${comic700}) format('woff2')`, {weight: '700'})].map((ff) => {
      document.fonts.add(ff);
      return ff.load();
    }),
  ).finally(() => continueRender(h));
};

// ---------- gerak dasar
const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = (at: number, from = 2.4) => {
    if (frame < at) return {opacity: 0, transform: `scale(${from})`};
    const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
    return {opacity: Math.min(1, (frame - at + 1) / 3), transform: `scale(${from + (1 - from) * s})`};
  };
  const pop = (at: number, from = 0.2) => {
    if (frame < at) return 0;
    return from + (1 - from) * spring({frame: frame - at, fps, config: {damping: 9, stiffness: 220, mass: 0.7}});
  };
  const shake = (ats: number[], amp = 16, dur = 12) =>
    ats.reduce(
      (acc, at) => {
        const t = frame - at;
        if (t < 0 || t > dur) return acc;
        const k = amp * (1 - t / dur);
        return {x: acc.x + k * Math.sin(t * 2.7), y: acc.y + k * Math.cos(t * 3.3)};
      },
      {x: 0, y: 0},
    );
  const kick = (ats: number[], amt = 0.025, dur = 9) =>
    ats.reduce((acc, at) => {
      const t = frame - at;
      return t < 0 || t > dur ? acc : acc + amt * (1 - t / dur);
    }, 0);
  return {frame, fps, slam, pop, shake, kick};
};

const dots = (c: string, size = 18): React.CSSProperties => ({backgroundImage: `radial-gradient(circle, ${c} 32%, transparent 34%)`, backgroundSize: `${size}px ${size}px`});
const bang = (size: number, color: string, stroke = 7, ext = 5): React.CSSProperties => ({
  fontFamily: 'Bangers',
  fontSize: size,
  color,
  letterSpacing: '0.03em',
  lineHeight: 0.9,
  WebkitTextStroke: `${stroke}px ${INK}`,
  paintOrder: 'stroke fill',
  textShadow: Array.from({length: ext}, (_, i) => `${(i + 1) * 3}px ${(i + 1) * 3}px 0 ${INK}`).join(','),
  whiteSpace: 'nowrap',
});
const star = (n: number, r1: number, r2: number, cx: number, cy: number, jit = 0) =>
  Array.from({length: n * 2}, (_, i) => {
    let r = i % 2 ? r2 : r1;
    if (jit && !(i % 2)) r += i % 4 ? -jit : jit;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
const grainUri = `data:image/svg+xml;base64,${typeof btoa !== 'undefined' ? btoa("<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>") : ''}`;
const Grain: React.FC<{op?: number}> = ({op = 0.2}) => <AbsoluteFill style={{backgroundImage: `url(${grainUri})`, opacity: op, mixBlendMode: 'multiply', pointerEvents: 'none'}} />;

const Stamp: React.FC<{at: number; text: string; size?: number; rot?: number; color?: string; style?: React.CSSProperties}> = ({at, text, size = 40, rot = -9, color = RED, style}) => {
  const {frame} = useT();
  if (frame < at) return null;
  const t = frame - at;
  const s = interpolate(t, [0, 4, 7], [2.2, 0.94, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  return (
    <div style={{position: 'absolute', fontFamily: 'Bangers', fontSize: size, color, border: `${Math.max(4, size / 9)}px solid ${color}`, padding: '0 14px', letterSpacing: '.06em', transform: `rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, t / 2), mixBlendMode: 'multiply', whiteSpace: 'nowrap', ...style}}>
      {text}
    </div>
  );
};

const Sfx: React.FC<{at: number; name: string; vol?: number}> = ({at, name, vol = 0.5}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60}>
    <Audio src={staticFile(`sfx/v2/${name}.mp3`)} volume={vol} />
  </Sequence>
);

// ---------- timeline (detik dari tts/words.json)
const W = {video: f(0.08), claude: f(0.88), gratisan: f(1.2), anda: f(1.68), fitur: f(2.6), bisnis: f(3.6), flip: f(4.6), namanya: f(4.78), motion: f(5.12), masih: f(6.16), beta: f(6.52), adanya: f(7.12), team: f(7.92), ent: f(8.64), paket: f(9.36), free: f(10.72), pro: f(10.96), max: f(11.28), nggak: f(11.72), dapat: f(11.92)};
export const COMIC_FRAMES = f(13);

// ---------- SAMPUL
const Cover: React.FC = () => {
  const {frame, slam, pop, shake, kick} = useT();
  const sh = shake([W.gratisan, W.bisnis], 18);
  const zoom = 1.0 + frame * 0.0003 + kick([W.video, W.claude, W.gratisan], 0.03) + kick([W.bisnis], 0.02);
  const cp = pop(W.gratisan, 0.45);
  const jitter = frame > W.gratisan + 8 ? Math.sin(frame * 1.9) * 1.6 : 0;
  const flash = frame < W.gratisan ? 0 : interpolate(frame - W.gratisan, [0, 5], [0.75, 0], {extrapolateRight: 'clamp'});
  const phoneIn = interpolate(frame, [0, 10], [0.85, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const capX = interpolate(frame - W.fitur, [0, 10], [700, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const duar = frame >= W.gratisan ? pop(W.gratisan, 0.1) : 0;
  const duarOut = interpolate(frame - W.gratisan, [26, 36], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px,${sh.y}px) scale(${zoom})`, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `repeating-conic-gradient(from ${frame * 0.5}deg at 62% 64%, #1F8FD6 0deg 5deg, #0E5FA8 5deg 10deg)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(560px 560px at 62% 64%, rgba(255,255,255,.85), rgba(255,255,255,0) 70%)'}} />
      <AbsoluteFill style={{...dots('rgba(10,30,80,.55)'), WebkitMaskImage: 'radial-gradient(900px 1100px at 62% 64%, transparent 45%, #000 85%)'}} />
      {/* masthead */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 270, background: YEL, borderBottom: `10px solid ${INK}`, zIndex: 5}}>
        <AbsoluteFill style={dots('rgba(230,59,46,.35)')} />
        <Img src={staticFile('shared/bukan-sulap.svg')} style={{position: 'absolute', left: 46, top: 40, height: 190, filter: `drop-shadow(6px 6px 0 ${INK})`}} />
        <div style={{position: 'absolute', right: 40, top: 36, width: 200, background: '#fff', border: `6px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}`, textAlign: 'center', padding: '10px 0'}}>
          <div style={{fontFamily: 'Bangers', fontSize: 30, letterSpacing: '.06em'}}>EDISI</div>
          <div style={{fontFamily: 'Bangers', fontSize: 96, lineHeight: 0.9}}>12</div>
          <div style={{fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 22}}>NOV 2026</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: -40, right: -40, top: 300, height: 84, background: RED, border: `7px solid ${INK}`, transform: 'rotate(-3deg)', zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={bang(58, '#fff', 5, 0)}>EDISI SPESIAL · CLAUDE MOTION</span>
      </div>
      {/* cover lines */}
      <div style={{position: 'absolute', left: 56, top: 430, zIndex: 8, transform: 'rotate(-4deg)', transformOrigin: 'left top'}}>
        <div style={{...bang(140, '#fff'), ...slam(W.video), transformOrigin: 'left center'}}>VIDEO ANIMASI</div>
        <div style={{...bang(140, '#fff'), marginTop: 6, ...slam(W.claude), transformOrigin: 'left center'}}>CLAUDE...</div>
      </div>
      <svg style={{position: 'absolute', left: -20, top: 640, zIndex: 7, opacity: frame >= W.gratisan ? 1 : 0, transform: `scale(${pop(W.gratisan, 0.3)}) rotate(${frame * 0.15}deg)`}} width={1100} height={400}>
        <polygon points={star(15, 520, 330, 550, 200, 30)} fill={RED} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 70, top: 690, zIndex: 11, transform: 'rotate(-6deg)'}}>
        <div style={{...bang(200, YEL), ...slam(W.gratisan, 3)}}>GRATISAN?!</div>
      </div>
      {/* phone */}
      <div style={{position: 'absolute', left: 70, top: 1130, width: 330, height: 560, border: `10px solid ${INK}`, borderRadius: 56, background: '#2B2F3A', transform: `translateX(${(1 - phoneIn) * -400}px) rotate(${-12 + (frame >= W.anda && frame < W.anda + 10 ? Math.sin((frame - W.anda) * 2) * 4 : 0)}deg)`, boxShadow: `14px 14px 0 ${INK}`, zIndex: 9, padding: 22}}>
        <div style={{background: '#fff', borderRadius: 30, height: '100%', padding: '26px 20px', border: `5px solid ${INK}`, position: 'relative', overflow: 'hidden'}}>
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <i style={{width: 56, height: 56, borderRadius: '50%', background: INK, display: 'block'}} />
            <b style={{fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 26}}>@kreator.ai</b>
          </div>
          <div style={{fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 33, lineHeight: 1.2, marginTop: 20, textTransform: 'uppercase'}}>
            Claude bisa bikin video sendiri, <span style={{background: YEL, padding: '0 6px'}}>gratis!</span>
          </div>
          <div style={{marginTop: 20, fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 24, color: RED}}>♥ 263 &nbsp; 💬 82</div>
          <Stamp at={W.bisnis} text="KHUSUS BISNIS" size={44} rot={-18} style={{left: 0, top: 330}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 350, top: 1110, zIndex: 12, ...bang(110, '#fff', 7, 0), transform: `rotate(14deg) scale(${pop(W.anda, 0)})`}}>!!</div>
      {/* karakter */}
      <Img
        src={staticFile(`${PACK}/reactions/kaget.png`)}
        style={{position: 'absolute', left: 330, top: 900, height: 1060, zIndex: 10, opacity: frame >= W.gratisan ? 1 : 0, transform: `translate(${jitter}px, ${(1 - cp) * 260}px) scale(${cp})`, transformOrigin: '50% 80%', filter: `drop-shadow(10px 10px 0 rgba(17,17,17,.9))`}}
      />
      <div style={{position: 'absolute', right: 60, top: 860, zIndex: 13, ...bang(150, YEL, 8, 4), WebkitTextStroke: `8px ${RED}`, transform: `rotate(12deg) scale(${duar})`, opacity: duarOut}}>DUAR!</div>
      {/* caption */}
      <div style={{position: 'absolute', right: 40, top: 1330, zIndex: 14, transform: `translateX(${capX}px) rotate(2deg)`, background: YEL, border: `6px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}`, padding: '12px 22px', fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 36, textTransform: 'uppercase', maxWidth: 520, lineHeight: 1.15}}>
        Fitur resminya cuma paket bisnis.
      </div>
      <Stamp at={W.bisnis} text="TOK!" size={64} rot={8} color={INK} style={{left: 360, top: 1240, zIndex: 15, border: 'none', mixBlendMode: 'normal', ...bang(64, '#fff', 5, 0)}} />
      <AbsoluteFill style={{background: '#fff', opacity: flash, zIndex: 30}} />
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- HALAMAN DALAM
const Ticket: React.FC<{name: string; ok: boolean; y: number; at: number; stampAt?: number}> = ({name, ok, y, at, stampAt}) => {
  const {frame, fps, shake} = useT();
  if (frame < at) return null;
  const s = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 240, mass: 0.6}});
  const sh = stampAt ? shake([stampAt], 8, 8) : {x: 0, y: 0};
  const glow = ok ? interpolate(frame - at, [0, 6, 14], [0, 1, 0.55], {extrapolateRight: 'clamp'}) : 0;
  const base: React.CSSProperties = {position: 'absolute', left: 670, top: y, width: 360, height: 92, border: `7px solid ${INK}`, zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', transform: `translate(${sh.x}px, ${(1 - s) * -80 + sh.y}px) scale(${0.8 + 0.2 * s})`, opacity: Math.min(1, (frame - at + 1) / 3)};
  return ok ? (
    <div style={{...base, background: YEL, boxShadow: `8px 8px 0 ${INK}, 0 0 ${60 * glow}px ${30 * glow}px rgba(255,230,120,.9)`}}>
      <span style={bang(54, '#fff', 6, 3)}>{name}</span>
      <span style={{fontFamily: 'Bangers', fontSize: 30, background: '#2BB673', color: '#fff', border: `5px solid ${INK}`, borderRadius: '50%', width: 66, height: 66, display: 'grid', placeItems: 'center', WebkitTextStroke: `2px ${INK}`}}>ADA</span>
    </div>
  ) : (
    <div style={{...base, backgroundColor: '#D8D2C2', ...dots('rgba(0,0,0,.18)')}}>
      <span style={{fontFamily: 'Bangers', fontSize: 54, color: '#7A7468', letterSpacing: '.03em'}}>{name}</span>
      {stampAt !== undefined && <Stamp at={stampAt} text="TIDAK ADA" size={34} style={{right: 14, top: 18}} />}
    </div>
  );
};

const Balloon: React.FC<{at: number; until?: number; text: string}> = ({at, until, text}) => {
  const {frame, pop} = useT();
  if (frame < at || (until !== undefined && frame >= until)) return null;
  const s = pop(at, 0.3);
  return (
    <div style={{position: 'absolute', left: 420, top: 660, width: 600, height: 230, zIndex: 8, transform: `scale(${s})`, transformOrigin: '10% 95%'}}>
      <div style={{position: 'absolute', inset: 0, background: '#fff', border: `7px solid ${INK}`, borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center', fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 50, lineHeight: 1.1, textTransform: 'uppercase', padding: '0 40px'}}>{text}</div>
      <svg style={{position: 'absolute', left: -40, top: 190}} width={140} height={120}>
        <path d="M110 8 L20 100 L70 16" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <rect x={60} y={0} width={70} height={14} fill="#fff" />
      </svg>
    </div>
  );
};

const Inside: React.FC = () => {
  const {frame, slam, pop, shake, kick, fps} = useT();
  const cam = interpolate(frame, [W.flip, W.adanya - 4, W.adanya + 14, COMIC_FRAMES], [1.12, 1.1, 1.0, 1.035], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const camY = interpolate(frame, [W.flip, W.adanya - 4, W.adanya + 14], [70, 60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const k = kick([W.motion, W.beta, W.team, W.ent], 0.02) + kick([W.nggak, W.dapat], 0.012);
  const sh = shake([W.motion, W.beta], 12, 10);
  const p2 = interpolate(frame, [W.namanya + 4, W.namanya + 18], [1100, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const pointing = frame >= W.adanya;
  const poseAt = pointing ? W.adanya : W.namanya + 8;
  const ps = spring({frame: frame - poseAt, fps, config: {damping: 10, stiffness: 260, mass: 0.6}});
  const squash = frame >= poseAt ? 1 + (1 - ps) * 0.12 : 1;
  const breathe = 1 + Math.sin(frame / 14) * 0.006;
  const burst = frame >= W.team ? pop(W.team, 0.2) : 0;
  return (
    <AbsoluteFill style={{background: '#F1E7CF', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${camY + sh.y}px) scale(${cam + k})`, transformOrigin: '50% 20%'}}>
        {/* panel 1 */}
        <div style={{position: 'absolute', left: 34, top: 34, width: 1012, height: 560, border: `9px solid ${INK}`, background: '#F49AC1', overflow: 'hidden', transform: 'rotate(-1deg)'}}>
          <AbsoluteFill style={{...dots('#E0357A'), opacity: 0.55, backgroundPosition: `${frame * 0.4}px 0`}} />
          <div style={{position: 'absolute', left: 26, top: 26, background: YEL, border: `6px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}`, padding: '10px 20px', fontFamily: 'Comic Neue', fontWeight: 700, fontSize: 34, textTransform: 'uppercase'}}>Namanya...</div>
          <div style={{position: 'absolute', left: 40, top: 118, ...bang(150, YEL), ...slam(W.motion, 2.6), transformOrigin: 'left center'}}>CLAUDE MOTION</div>
          <Stamp at={W.beta} text="MASIH BETA" size={60} rot={-10} style={{right: 40, top: 36}} />
          <div style={{position: 'absolute', left: 44, top: 312, display: 'flex', gap: 22, alignItems: 'baseline', flexWrap: 'wrap', width: 940}}>
            <span style={{...bang(78, '#fff', 6, 3), ...slam(W.adanya, 1.8), transformOrigin: 'left center'}}>ADANYA DI</span>
          </div>
          <div style={{position: 'absolute', left: 44, top: 405, display: 'flex', gap: 26}}>
            <span style={{...bang(118, YEL, 7, 4), ...slam(W.team, 2.2)}}>TEAM &amp;</span>
            <span style={{...bang(118, YEL, 7, 4), ...slam(W.ent, 2.2)}}>ENTERPRISE.</span>
          </div>
          <Img src={staticFile('shared/bukan-sulap-white.svg')} style={{position: 'absolute', right: 26, bottom: 22, height: 64, filter: `drop-shadow(3px 3px 0 ${INK})`}} />
        </div>
        {/* panel 2 */}
        <div style={{position: 'absolute', left: 34, top: 624, width: 1012, height: 1262, transform: `translateX(${p2}px)`}}>
          <div style={{position: 'absolute', inset: 0, border: `9px solid ${INK}`, overflow: 'hidden', background: `repeating-conic-gradient(from ${-frame * 0.3}deg at 15% 30%, #BFE3F7 0deg 4deg, #E8F5FC 4deg 9deg)`}}>
            <AbsoluteFill style={{...dots('rgba(31,143,214,.35)'), WebkitMaskImage: 'linear-gradient(to bottom, transparent 40%, #000)'}} />
          </div>
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${p2}px)`}}>
          <svg style={{position: 'absolute', left: 600, top: 1270, zIndex: 5, opacity: burst ? 1 : 0, transform: `scale(${burst}) rotate(${frame * 0.4}deg)`}} width={500} height={330}>
            <polygon points={star(16, 240, 190, 250, 165, 18)} fill="#FFF3B0" stroke={INK} strokeWidth={6} />
          </svg>
          <Ticket name="TEAM" ok y={1324} at={W.team} />
          <Ticket name="ENTERPRISE" ok y={1432} at={W.ent} />
          <Ticket name="FREE" ok={false} y={1000} at={W.free} stampAt={W.nggak} />
          <Ticket name="PRO" ok={false} y={1108} at={W.pro} stampAt={W.nggak + 5} />
          <Ticket name="MAX" ok={false} y={1216} at={W.max} stampAt={W.dapat + 3} />
          <Balloon at={W.masih} until={W.paket} text="Masih beta, lho!" />
          <Balloon at={W.paket} text="Paket individu? Nggak dapat." />
          <Img
            src={staticFile(`${PACK}/characters/${pointing ? 'menunjuk' : 'menjelaskan'}.png`)}
            style={{position: 'absolute', left: pointing ? -110 : -60, top: 860, height: 1150, zIndex: 7, transform: `scale(${breathe * squash}, ${breathe / squash})`, transformOrigin: '40% 100%', filter: 'drop-shadow(10px 10px 0 rgba(17,17,17,.9))'}}
          />
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

export const ComicTest: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [W.flip, W.flip + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: '#0B0B0B'}}>
      {frame >= W.flip - 2 && <Inside />}
      {flip < 1 && (
        <AbsoluteFill style={{transform: `perspective(2200px) rotateY(${-100 * flip}deg)`, transformOrigin: 'left center', boxShadow: `${40 * flip}px 0 80px rgba(0,0,0,${0.5 * flip})`}}>
          <Cover />
          <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(0,0,0,${0.15 * flip}), rgba(0,0,0,${0.6 * flip}))`}} />
        </AbsoluteFill>
      )}
      <Audio src={staticFile('video/tts/final.mp3')} endAt={f(12.5)} />
      <Sfx at={W.video} name="slam" vol={0.35} />
      <Sfx at={W.claude} name="slam" vol={0.35} />
      <Sfx at={W.gratisan - 1} name="slam" vol={0.7} />
      <Sfx at={W.gratisan} name="whoosh" vol={0.4} />
      <Sfx at={W.anda} name="pop" vol={0.4} />
      <Sfx at={W.fitur} name="swoosh" vol={0.35} />
      <Sfx at={W.bisnis} name="strike" vol={0.55} />
      <Sfx at={W.flip - 2} name="flip" vol={0.6} />
      <Sfx at={W.namanya + 4} name="whoosh" vol={0.35} />
      <Sfx at={W.motion} name="slam" vol={0.55} />
      <Sfx at={W.masih} name="pop" vol={0.4} />
      <Sfx at={W.beta} name="strike" vol={0.5} />
      <Sfx at={W.adanya} name="swoosh" vol={0.35} />
      <Sfx at={W.team} name="ding" vol={0.4} />
      <Sfx at={W.ent} name="ding" vol={0.4} />
      <Sfx at={W.paket} name="pop" vol={0.4} />
      <Sfx at={W.free} name="tick" vol={0.45} />
      <Sfx at={W.pro} name="tick" vol={0.45} />
      <Sfx at={W.max} name="tick" vol={0.45} />
      <Sfx at={W.nggak} name="strike" vol={0.45} />
      <Sfx at={W.nggak + 5} name="strike" vol={0.4} />
      <Sfx at={W.dapat + 3} name="strike" vol={0.45} />
    </AbsoluteFill>
  );
};
