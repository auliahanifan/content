import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {GEO} from '../layout';
import type {Layout, PixelAsset} from '../types';

export const PIXEL_ROOT = 'shared/pixel-aulia';

/**
 * Gambar Pixel Aulia dengan tinggi badan dinormalkan (dari visibleAlphaBounds di manifest),
 * ditaruh dengan titik tengah-bawah figur di (0,0) wrapper. Pakai image-rendering: pixelated.
 */
export const PixelFigure: React.FC<{asset: PixelAsset; h: number; opacity?: number}> = ({asset, h, opacity = 1}) => {
  const [x0, y0, x1, y1] = asset.visibleAlphaBounds;
  const k = h / (y1 - y0);
  return (
    <Img
      src={staticFile(`${PIXEL_ROOT}/${asset.file}`)}
      style={{
        position: 'absolute',
        left: -((x0 + x1) / 2) * k,
        top: -y1 * k,
        width: asset.width * k,
        height: asset.height * k,
        imageRendering: 'pixelated',
        opacity,
      }}
    />
  );
};

type Props = {
  changes: {frame: number; pose: string}[];
  layouts: {frame: number; layout: Layout}[];
  assets: Map<string, PixelAsset>;
  audio: string;
  hidden: number; // 0..1, saat interupsi epik
};

/** Presenter: pindah posisi antar adegan (geser + balik arah), ganti pose = squash & hop, goyang ikut volume suara. */
export const Character: React.FC<Props> = ({changes, layouts, assets, audio, hidden}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const data = useAudioData(staticFile(audio));

  let cur = changes[0];
  for (const c of changes) if (c.frame <= frame) cur = c;
  const since = frame - cur.frame;

  // posisi: spring dari layout sebelumnya ke layout sekarang
  let li = 0;
  layouts.forEach((l, i) => l.frame <= frame && (li = i));
  const from = GEO[layouts[Math.max(0, li - 1)].layout].char;
  const to = GEO[layouts[li].layout].char;
  const m = li === 0 ? 1 : spring({frame: frame - layouts[li].frame, fps, config: {damping: 15, stiffness: 120}});
  const cx = interpolate(m, [0, 1], [from.cx, to.cx]);
  const h = interpolate(m, [0, 1], [from.h, to.h]);
  const flip = m < 0.5 ? from.flip : to.flip;
  const walk = m < 0.98 ? Math.abs(Math.sin(frame / 2.2)) * -18 : 0; // lompat kecil saat berpindah

  const s = spring({frame: since, fps, config: {damping: 9, stiffness: 210, mass: 0.6}});
  const squashY = interpolate(s, [0, 1], [0.88, 1]);
  const squashX = interpolate(s, [0, 1], [1.1, 1]);
  const hop = since >= 0 && since < 10 ? -Math.sin((since / 10) * Math.PI) * 30 : 0;

  let vol = 0;
  if (data) {
    const bins = visualizeAudio({fps, frame, audioData: data, numberOfSamples: 16, optimizeFor: 'speed'});
    vol = Math.min(1, (bins.slice(0, 8).reduce((a, b) => a + b, 0) / 8) * 6);
  }
  const breathe = 1 + Math.sin((frame / fps) * Math.PI * 0.8) * 0.01;
  // gerak dikuantisasi 4 px agar terasa pixel
  const q = (v: number) => Math.round(v / 4) * 4;
  const bob = q(-vol * 12);
  const sway = Math.round(Math.sin(frame / 3.2) * vol * 2);

  const enter = spring({frame, fps, config: {damping: 14, stiffness: 100}});
  const asset = assets.get(cur.pose) ?? assets.get('netral');
  if (!asset) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx + interpolate(enter, [0, 1], [-600, 0]),
        top: to.base,
        width: 0,
        height: 0,
        opacity: 1 - hidden,
        transform: `translateY(${q(hop + bob + walk) + hidden * 200}px) rotate(${sway}deg) scale(${(flip ? -1 : 1) * squashX}, ${squashY * breathe})`,
        transformOrigin: '0 0',
        filter: 'drop-shadow(8px 8px 0 rgba(27,31,59,0.35))',
      }}
    >
      <PixelFigure asset={asset} h={h} />
    </div>
  );
};
