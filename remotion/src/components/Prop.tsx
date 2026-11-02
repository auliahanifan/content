import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, sticker} from '../theme';
import {useTiming} from '../timing';
import type {PropRef} from '../types';

/**
 * Ilustrasi props dari assets/props/<prop>.png (gaya kartun senada karakter).
 * Bila belum ada, tampil placeholder stiker bulat berisi emoji.
 */
export const Prop: React.FC<PropRef & {size: number; bg?: string}> = ({prop, emoji, size, bg}) => {
  const {available} = useTiming();
  if (prop && available.has(prop)) {
    return (
      <Img
        src={staticFile(`shared/props/${prop}.png`)}
        style={{width: size, height: size, objectFit: 'contain'}}
      />
    );
  }
  return (
    <div
      style={{
        ...sticker(Math.round(size / 22), bg ?? C.bg),
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.52,
        lineHeight: 1,
        fontFamily: '"Apple Color Emoji", "Noto Color Emoji", sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {emoji ?? '❔'}
    </div>
  );
};
