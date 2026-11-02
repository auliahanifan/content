import React from 'react';
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useTiming} from '../timing';

/** Logo seri kiri atas, tanda tangan kanan atas. Pada `seriesLine` logo terbang ke tengah lalu kembali. */
export const Brand: React.FC<{dark: number}> = ({dark}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sb, T, E} = useTiming();
  let fly = 0;
  if (sb.seriesLine) {
    const a = spring({frame: frame - T(sb.seriesLine.from), fps, config: {damping: 13, stiffness: 120}});
    const b = spring({frame: frame - E(sb.seriesLine.to) - 6, fps, config: {damping: 16, stiffness: 120}});
    fly = Math.max(0, a - b);
  }
  // kotak logo 360x120 di (56,70); tengah layar sedikit di atas papan
  const dx = (540 - (56 + 180)) * fly;
  const dy = (560 - (70 + 75)) * fly;
  const sc = 1 + 1.7 * fly;
  const pair = (black: string, white: string, style: React.CSSProperties) => (
    <>
      <Img src={staticFile(`shared/${black}`)} style={{...style, opacity: 1 - dark}} />
      <Img src={staticFile(`shared/${white}`)} style={{...style, opacity: dark}} />
    </>
  );
  const logoStyle: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center'};
  return (
    <>
      <div style={{position: 'absolute', left: 56, top: 70, width: 360, height: 150, transform: `translate(${dx}px, ${dy}px) scale(${sc})`, zIndex: 20}}>
        {pair(`${sb.series}.svg`, `${sb.series}-white.svg`, {...logoStyle, objectPosition: fly > 0.5 ? 'center' : 'left center'})}
      </div>
      <div style={{position: 'absolute', right: 50, top: 66, width: 230, height: 120}}>
        {pair('logo-signature-black.svg', 'logo-signature-white.svg', {...logoStyle, objectPosition: 'right center'})}
      </div>
    </>
  );
};
