import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {PixelAulia, pixelAuliaFiles, type PixelAuliaMood} from './PixelAulia';

/** Register a 1080x1920 Composition, fps=30, durationInFrames=600. */
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
