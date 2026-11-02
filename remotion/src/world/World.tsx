import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {C} from '../theme';
import type {MapName, Mood} from '../types';
import {MapView} from './Maps';

export const DASH = 20; // frame gulir saat pindah map

/**
 * Dunia game di belakang papan: map per adegan dengan gulir pelan terus-menerus; saat map berganti kamera
 * "dash" ke kanan (map lama keluar kiri, map baru masuk dari kanan) dengan garis kecepatan.
 * Di atasnya: latar bereaksi (mood) dan malam arcade (adegan dark / epik).
 */
export const World: React.FC<{maps: {frame: number; map: MapName}[]; moods: {start: number; end: number; mood: Mood}[]; night: number; drift: number}> = ({
  maps,
  moods,
  night,
  drift,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let mi = 0;
  maps.forEach((m, i) => m.frame <= frame && (mi = i));
  const cur = maps[mi];
  const prev = mi > 0 && maps[mi - 1].map !== cur.map ? maps[mi - 1] : null;
  const p = prev ? spring({frame: frame - cur.frame, fps, durationInFrames: DASH, config: {damping: 200}}) : 1;
  const scroll = frame * 1.4 + drift * 2;
  const dashing = prev && p < 0.98;
  const mood = moods.find((m) => frame >= m.start && frame < m.end);
  const moodLvl = mood ? interpolate(frame, [mood.start, mood.start + 6, mood.end - 6, mood.end], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const glitch = mood?.mood === 'glitch' ? moodLvl : 0;
  const gx = glitch ? Math.round((random(`g${Math.floor(frame / 2)}`) - 0.5) * 30 * glitch) : 0;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translateX(${gx}px)`,
          filter: glitch ? `drop-shadow(${8 * glitch}px 0 0 rgba(255,40,90,0.7)) drop-shadow(${-8 * glitch}px 0 0 rgba(40,230,255,0.7))` : undefined,
        }}
      >
        {prev && dashing && (
          <AbsoluteFill style={{transform: `translateX(${Math.round(-p * 1080)}px)`}}>
            <MapView name={prev.map} scroll={scroll} frame={frame} />
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{transform: `translateX(${Math.round((1 - p) * 1080)}px)`}}>
          <MapView name={cur.map} scroll={scroll} frame={frame} />
        </AbsoluteFill>
        {glitch > 0 && <GlitchBands frame={frame} lvl={glitch} />}
      </AbsoluteFill>
      {dashing && <SpeedLines frame={frame} lvl={1 - Math.abs(p - 0.5) * 2} />}
      {mood && moodLvl > 0 && <MoodLayer mood={mood.mood} lvl={moodLvl} frame={frame - mood.start} />}
      {night > 0 && (
        <AbsoluteFill style={{opacity: night}}>
          <Background night={1} drift={drift} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** Garis kecepatan horizontal saat dash. */
const SpeedLines: React.FC<{frame: number; lvl: number}> = ({frame, lvl}) => (
  <AbsoluteFill style={{opacity: Math.min(1, lvl * 1.5)}}>
    {[...Array(18)].map((_, i) => {
      const y = Math.round((random(`sl${i}`) * 1920) / 8) * 8;
      const w = 200 + random(`sw${i}`) * 500;
      const x = 1200 - (((frame * 90 + random(`sx${i}`) * 2000) % 2400));
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: i % 3 ? 6 : 12, background: C.white, opacity: 0.7}} />;
    })}
  </AbsoluteFill>
);

const GlitchBands: React.FC<{frame: number; lvl: number}> = ({frame, lvl}) => (
  <>
    {[...Array(5)].map((_, i) => {
      const k = Math.floor(frame / 3);
      if (random(`gb${i}${k}`) > 0.6) return null;
      const y = Math.round(random(`gy${i}${k}`) * 1900);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: y,
            height: 12 + Math.round(random(`gh${i}${k}`) * 40),
            background: i % 2 ? 'rgba(46,230,214,0.35)' : 'rgba(255,79,163,0.35)',
            transform: `translateX(${(random(`gx${i}${k}`) - 0.5) * 120}px)`,
            opacity: lvl,
          }}
        />
      );
    })}
  </>
);

/**
 * Latar bereaksi: bahaya = merah berdenyut + garis peringatan + percikan; untung = cahaya emas + koin jatuh;
 * glitch = pita warna (di World); fokus = vignette gelap. Semua di belakang papan dan caption.
 */
const MoodLayer: React.FC<{mood: Mood; lvl: number; frame: number}> = ({mood, lvl, frame}) => {
  if (mood === 'bahaya') {
    const pulse = 0.5 + 0.5 * Math.abs(Math.sin(frame / 7));
    return (
      <AbsoluteFill style={{opacity: lvl}}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, transparent 35%, rgba(226,68,92,${0.55 * pulse}) 100%)`}} />
        <AbsoluteFill style={{background: `rgba(226,68,92,${0.12 + 0.08 * pulse})`, mixBlendMode: 'multiply'}} />
        {[...Array(14)].map((_, i) => {
          const x = random(`bx${i}`) * 1080;
          const y = (((random(`by${i}`) * 1920 - frame * (6 + i % 4)) % 1920) + 1920) % 1920;
          return <div key={i} style={{position: 'absolute', left: Math.round(x / 6) * 6, top: Math.round(y / 6) * 6, width: 12, height: 12, background: i % 2 ? C.sun : C.bad}} />;
        })}
      </AbsoluteFill>
    );
  }
  if (mood === 'untung') {
    return (
      <AbsoluteFill style={{opacity: lvl}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, rgba(255,210,63,0.55), transparent 65%)'}} />
        {[...Array(16)].map((_, i) => {
          const x = random(`cx${i}`) * 1080;
          const y = (((random(`cy${i}`) * 1920 + frame * (8 + (i % 5) * 2)) % 2000) + 2000) % 2000 - 80;
          const w = Math.abs(Math.cos(frame / 5 + i)) * 36 + 6;
          return (
            <div key={i} style={{position: 'absolute', left: Math.round(x / 6) * 6, top: Math.round(y / 6) * 6, width: Math.round(w / 6) * 6, height: 42, background: C.sun, boxShadow: `inset 0 0 0 6px #E0A800`}} />
          );
        })}
      </AbsoluteFill>
    );
  }
  if (mood === 'fokus') {
    return <AbsoluteFill style={{opacity: lvl, background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(14,16,48,0.7) 100%)'}} />;
  }
  return null;
};
