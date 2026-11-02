import React, {useMemo} from 'react';
import {Img, staticFile} from 'remotion';
import {C, pixelBox} from '../theme';
import {useTiming} from '../timing';
import type {PropRef} from '../types';

const RES = 20; // resolusi emoji sebelum diperbesar (makin kecil makin "pixel")
const cache = new Map<string, string>();

/** Emoji dirender kecil di canvas lalu diperbesar tanpa smoothing = ikon pixel. */
const pixelEmoji = (emoji: string) => {
  if (cache.has(emoji)) return cache.get(emoji)!;
  if (typeof document === 'undefined') return '';
  const c = document.createElement('canvas');
  c.width = RES;
  c.height = RES;
  const ctx = c.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${RES - 3}px "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.fillText(emoji, RES / 2, RES / 2 + 1);
  // ambang alpha agar tepi tajam
  const img = ctx.getImageData(0, 0, RES, RES);
  for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 100 ? 255 : 0;
  ctx.putImageData(img, 0, 0);
  const url = c.toDataURL();
  cache.set(emoji, url);
  return url;
};

/**
 * Item di slot inventory. PNG assets/props/<prop>.png bila ada (dipakai apa adanya),
 * selain itu emoji yang di-pixel-kan.
 */
export const Prop: React.FC<PropRef & {size: number; bg?: string; slot?: boolean}> = ({prop, emoji, size, bg, slot = true}) => {
  const {available} = useTiming();
  const src = useMemo(() => (prop && available.has(prop) ? null : pixelEmoji(emoji ?? '❔')), [prop, emoji, available]);
  const inner = Math.round(size * 0.68);
  const art =
    prop && available.has(prop) ? (
      <Img src={staticFile(`shared/props/${prop}.png`)} style={{width: inner, height: inner, objectFit: 'contain', imageRendering: 'pixelated'}} />
    ) : (
      <img src={src ?? ''} style={{width: inner, height: inner, imageRendering: 'pixelated'}} />
    );
  if (!slot) return art;
  return (
    <div
      style={{
        ...pixelBox(bg ?? C.paperDeep, C.white, Math.max(4, Math.round(size / 30))),
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {art}
    </div>
  );
};
