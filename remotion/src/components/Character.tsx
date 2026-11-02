import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {useTiming} from '../timing';
import type {Pose} from '../types';

export const POSES: Pose[] = ['menjelaskan', 'menunjuk', 'berpikir', 'bingung', 'terkejut', 'yakin'];

/** Karakter Aulia badan penuh, kiri bawah. Ganti pose = squash & hop, idle bernapas, goyang mengikuti volume suara. */
export const Character: React.FC<{changes: {frame: number; pose: Pose}[]; audio: string}> = ({changes, audio}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const data = useAudioData(staticFile(audio));

  let cur = changes[0];
  for (const c of changes) if (c.frame <= frame) cur = c;
  const since = frame - cur.frame;

  const s = spring({frame: since, fps, config: {damping: 9, stiffness: 210, mass: 0.6}});
  const squashY = interpolate(s, [0, 1], [0.88, 1]);
  const squashX = interpolate(s, [0, 1], [1.1, 1]);
  const hop = since >= 0 && since < 10 ? -Math.sin((since / 10) * Math.PI) * 34 : 0;

  // volume suara -> goyang kecil saat bicara
  let vol = 0;
  if (data) {
    const bins = visualizeAudio({fps, frame, audioData: data, numberOfSamples: 16, optimizeFor: 'speed'});
    vol = Math.min(1, (bins.slice(0, 8).reduce((a, b) => a + b, 0) / 8) * 6);
  }
  const breathe = 1 + Math.sin((frame / fps) * Math.PI * 0.8) * 0.008;
  const sway = Math.sin(frame / 3.2) * vol * 1.6;
  const bob = -vol * 10;

  const enter = spring({frame, fps, config: {damping: 14, stiffness: 100}});
  const x = interpolate(enter, [0, 1], [-520, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: -170 + x,
        top: 1010,
        width: 900,
        height: 900,
        transformOrigin: '50% 96%',
        transform: `translateY(${hop + bob}px) rotate(${sway}deg) scale(${squashX}, ${squashY * breathe})`,
        filter: 'drop-shadow(10px 12px 0 rgba(27,31,59,0.18))',
      }}
    >
      {POSES.map((p) => (
        <Img
          key={p}
          src={staticFile(`shared/karakter-${p}.png`)}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: p === cur.pose ? 1 : 0}}
        />
      ))}
    </div>
  );
};
