import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/** Teks dengan *sorotan*: stabilo kuning yang tersapu masuk mulai frame `from`. */
export const Rich: React.FC<{text: string; from: number; color?: string; marker?: string}> = ({
  text,
  from,
  color = C.ink,
  marker = C.sun,
}) => {
  const frame = useCurrentFrame();
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (!part.startsWith('*')) {
          return part.split('\n').map((line, j) => (
            <React.Fragment key={`${i}-${j}`}>
              {j > 0 && <br />}
              <span style={{color}}>{line}</span>
            </React.Fragment>
          ));
        }
        // sapuan stabilo bertahap per 10% (terasa pixel)
        const w = Math.round(interpolate(frame, [from + 4, from + 12], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) / 10) * 10;
        return (
          <span
            key={i}
            style={{
              color,
              backgroundImage: `linear-gradient(${marker}, ${marker})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${w}% 46%`,
              backgroundPosition: '0 88%',
              padding: '0 6px',
              margin: '0 -6px',
            }}
          >
            {part.slice(1, -1)}
          </span>
        );
      })}
    </>
  );
};
