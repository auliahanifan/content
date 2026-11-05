import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
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
      src={staticFile(`${asset.root ?? PIXEL_ROOT}/${asset.file}`)}
      style={{
        position: 'absolute',
        left: -((x0 + x1) / 2) * k,
        top: -y1 * k,
        width: asset.width * k,
        height: asset.height * k,
        imageRendering: asset.smooth ? 'auto' : 'pixelated',
        opacity,
      }}
    />
  );
};

/** Efek terpisah, dipusatkan di (0,0) wrapper, lebar `w`. */
const EffectImg: React.FC<{asset: PixelAsset; w: number; opacity: number; scale: number}> = ({asset, w, opacity, scale}) => {
  const k = w / asset.width;
  return (
    <Img
      src={staticFile(`${PIXEL_ROOT}/${asset.file}`)}
      style={{
        position: 'absolute',
        left: (-asset.width * k) / 2,
        top: (-asset.height * k) / 2,
        width: asset.width * k,
        height: asset.height * k,
        imageRendering: 'pixelated',
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
};

export type AuraEvent = {start: number; end: number; asset: PixelAsset; scale: number};

type Props = {
  changes: {frame: number; pose: string}[];
  layouts: {frame: number; layout: Layout}[];
  assets: Map<string, PixelAsset>;
  hidden: number; // 0..1, saat interupsi epik
  auras: AuraEvent[];
  enters?: {frame: number; kind: 'dash' | 'beam'}[]; // masuk ulang: dash dari samping / sinar teleport
};

const FADE = 2; // frame silang antar pose

/**
 * Presenter diam seperti sprite game: ganti pose = potongan bersih (fade 2 frame),
 * pindah posisi = geser mulus. Efek mini-epik tampil di belakangnya.
 */
export const Character: React.FC<Props> = ({changes, layouts, assets, hidden, auras, enters = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let ci = 0;
  changes.forEach((c, i) => c.frame <= frame && (ci = i));
  const cur = changes[ci];
  const prev = changes[ci - 1];
  const fade = prev ? interpolate(frame - cur.frame, [0, FADE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;

  let li = 0;
  layouts.forEach((l, i) => l.frame <= frame && (li = i));
  const from = GEO[layouts[Math.max(0, li - 1)].layout].char;
  const to = GEO[layouts[li].layout].char;
  const m = li === 0 ? 1 : spring({frame: frame - layouts[li].frame, fps, config: {damping: 200, stiffness: 120}});
  const cx = interpolate(m, [0, 1], [from.cx, to.cx]);
  const h = interpolate(m, [0, 1], [from.h, to.h]);
  const flip = m < 0.5 ? from.flip : to.flip;
  const enter = spring({frame, fps, config: {damping: 200, stiffness: 100}});

  // masuk ulang (bukan goyang): dash = meluncur dari luar layar 10 frame; beam = muncul bertahap dalam sinar
  const en = [...enters].reverse().find((e) => frame >= e.frame - 1 && frame < e.frame + 16);
  let enterX = 0;
  let beamOp = 1;
  let beam = 0;
  if (en) {
    const d = frame - en.frame;
    if (en.kind === 'dash') {
      const k = spring({frame: d, fps, durationInFrames: 10, config: {damping: 200}});
      enterX = (1 - k) * (flip ? 760 : -760);
    } else {
      beamOp = Math.round(interpolate(d, [2, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * 4) / 4;
      beam = interpolate(d, [0, 3, 10, 16], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    }
  }

  const asset = assets.get(cur.pose) ?? assets.get('netral');
  const prevAsset = prev ? assets.get(prev.pose) : undefined;
  if (!asset) return null;

  const aura = auras.find((a) => frame >= a.start && frame < a.end);
  // pusat badan: pose dengan lengan terulur (menunjuk dll.) punya kotak lebih lebar dari 'netral';
  // anggap lengan ke kanan gambar, jadi badan = sisi kiri kotak + setengah lebar badan netral.
  const bodyOffset = (() => {
    const n = assets.get('netral');
    if (!n) return 0;
    const [x0, y0, x1, y1] = asset.visibleAlphaBounds;
    const k = h / (y1 - y0);
    const w = (x1 - x0) * k;
    const nw = ((n.visibleAlphaBounds[2] - n.visibleAlphaBounds[0]) / (n.visibleAlphaBounds[3] - n.visibleAlphaBounds[1])) * h;
    if (w < nw * 1.15) return 0;
    return (nw / 2 - w / 2) * (flip ? -1 : 1);
  })();

  return (
    <div style={{position: 'absolute', left: cx + interpolate(enter, [0, 1], [-600, 0]) + enterX, top: to.base, width: 0, height: 0, opacity: 1 - hidden}}>
      {beam > 0 && (
        <div
          style={{
            position: 'absolute',
            left: -h * 0.22,
            top: -1920,
            width: h * 0.44,
            height: 1920,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,210,63,0.9) 50%, rgba(255,255,255,0.9) 70%, transparent)`,
            opacity: beam,
            transform: `scaleX(${0.3 + 0.7 * beam})`,
          }}
        />
      )}
      {aura && (
        <div style={{position: 'absolute', left: bodyOffset, top: -h * 0.5}}>
          <EffectImg
            asset={aura.asset}
            w={h * 0.95 * aura.scale}
            opacity={interpolate(frame, [aura.start, aura.start + 4, aura.end - 6, aura.end], [0, 1, 1, 0])}
            scale={spring({frame: frame - aura.start, fps, config: {damping: 12, stiffness: 150}}) * (1 + Math.sin((frame - aura.start) / 3) * 0.02)}
          />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, top: 0, opacity: beamOp, transform: `scaleX(${flip ? -1 : 1})`, filter: 'drop-shadow(8px 8px 0 rgba(27,31,59,0.35))'}}>
        {prevAsset && fade < 1 && <PixelFigure asset={prevAsset} h={h} opacity={1 - fade} />}
        <PixelFigure asset={asset} h={h} opacity={fade} />
      </div>
    </div>
  );
};
