import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {PixelAulia, pixelAuliaFiles, type PixelAuliaMood} from './PixelAulia';

export const pixelAuliaShowcaseDuration = (fps: number) => Object.keys(pixelAuliaFiles).length * Math.round(2 * fps);

/** Register 1080x1920; durationInFrames=pixelAuliaShowcaseDuration(fps). */
export const PixelAuliaShowcase: React.FC = () => {
  const {fps} = useVideoConfig();
  const moods = Object.keys(pixelAuliaFiles) as PixelAuliaMood[];
  const segment = Math.round(2 * fps);
  return <AbsoluteFill style={{backgroundColor: '#101625', color: '#fff', fontFamily: 'sans-serif'}}>
    {moods.map((mood, index) => <Sequence key={mood} from={index * segment} durationInFrames={segment}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <PixelAulia mood={mood} size={1000}/>
        <div style={{fontSize: 56, fontWeight: 700, textTransform: 'uppercase'}}>{mood.replaceAll('-', ' ')}</div>
      </AbsoluteFill>
    </Sequence>)}
  </AbsoluteFill>;
};

/** Separate aura pulses independently behind a clean presenter pose. */
export const PixelAuliaLayeredExample: React.FC = () => <AbsoluteFill
  style={{backgroundColor: '#101625', alignItems: 'center', justifyContent: 'center'}}>
  <PixelAulia mood="menjelaskan" effect="aura-emas" size={900} effectScale={1.1}/>
</AbsoluteFill>;
