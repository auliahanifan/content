import React, {useMemo} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_BODY} from '../theme';
import {useTiming} from '../timing';
import type {Storyboard, Word} from '../types';

/** Token tampilan: satu kata, atau beberapa kata yang digabung lewat storyboard.captionMerge. */
type Tok = {text: string; first: number; last: number; start: number; end: number};

export const tokens = (words: Word[], sb: Storyboard): Tok[] => {
  const merges = new Map((sb.captionMerge ?? []).map((m) => [m.from, m]));
  const out: Tok[] = [];
  for (let i = 0; i < words.length; i++) {
    const m = merges.get(i);
    if (m) {
      out.push({text: m.text, first: i, last: m.to, start: words[i][1], end: words[m.to][2]});
      i = m.to;
    } else {
      out.push({text: sb.captionFix?.[String(i)] ?? words[i][0], first: i, last: i, start: words[i][1], end: words[i][2]});
    }
  }
  return out;
};

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');

/** Kelompokkan kata jadi frasa pendek (maks 4 kata, putus di tanda baca atau jeda). */
export const phrases = (toks: Tok[]) => {
  const out: Tok[][] = [];
  let cur: Tok[] = [];
  toks.forEach((w, i) => {
    cur.push(w);
    const next = toks[i + 1];
    const punct = /[.,?!:;]$/.test(w.text);
    const gap = next ? next.start - w.end > 0.3 : true;
    if (punct || gap || cur.length >= 4) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
};

/** Caption kata-per-kata di kanan karakter. Kata kunci jeruk, kata aktif berstabilo. */
export const Captions: React.FC<{dark: number}> = ({dark}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {words, sb, T, E} = useTiming();
  const groups = useMemo(() => phrases(tokens(words, sb)), [words, sb]);
  const keys = useMemo(() => {
    const set = new Set<number>();
    const texts = new Set((sb.keywords ?? []).filter((k): k is string => typeof k === 'string').map(clean));
    (sb.keywords ?? []).forEach((k) => typeof k === 'number' && set.add(k));
    words.forEach((w, i) => texts.has(clean(w[0])) && set.add(i));
    return set;
  }, [words, sb.keywords]);

  const gi = groups.findIndex((g, k) => {
    const start = T(g[0].first);
    const nextStart = groups[k + 1] ? T(groups[k + 1][0].first) : Infinity;
    const end = Math.min(nextStart, E(g[g.length - 1].last) + Math.round(fps * 0.6));
    return frame >= start && frame < end;
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const ink = dark > 0.5 ? C.paper : C.ink;
  const stroke = dark > 0.5 ? C.night : C.paper;

  return (
    <div
      style={{
        position: 'absolute',
        left: 540,
        top: 1130,
        width: 460,
        height: 300,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'center',
        columnGap: 16,
        rowGap: 4,
        fontFamily: FONT_BODY,
        fontWeight: 800,
        fontSize: 64,
        zIndex: 5,
        lineHeight: 1.12,
      }}
    >
      {g.map((tok) => {
        const i = tok.first;
        const t0 = T(i);
        const said = frame >= t0;
        const active = said && frame < Math.max(E(tok.last), t0 + 4);
        const p = spring({frame: frame - t0, fps, config: {damping: 12, stiffness: 260, mass: 0.5}});
        const key = keys.has(i);
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              color: active ? C.ink : key ? C.accent : ink,
              opacity: said ? 1 : 0.32,
              transform: `scale(${said ? 0.85 + 0.15 * p + (active ? 0.06 : 0) : 0.92})`,
              WebkitTextStroke: `14px ${active ? C.sun : stroke}`,
              paintOrder: 'stroke fill',
              background: active ? C.sun : 'transparent',
              borderRadius: 14,
              padding: '0 6px',
              margin: '0 -6px',
              rotate: active ? '-1.5deg' : '0deg',
            }}
          >
            {tok.text}
          </span>
        );
      })}
    </div>
  );
};
