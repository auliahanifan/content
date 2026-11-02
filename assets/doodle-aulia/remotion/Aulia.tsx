import React from 'react';
import {Img, staticFile, spring, useCurrentFrame, useVideoConfig} from 'remotion';
export const auliaPoses={netral:'characters/netral.png','deadline-samurai':'reactions/deadline-samurai.png','raja-multitasking':'reactions/raja-multitasking.png','bangkit-lagi':'reactions/bangkit-lagi.png'} as const;
export type AuliaPose=keyof typeof auliaPoses;
export const Aulia: React.FC<{pose?:AuliaPose;wings?:boolean;size?:number;animate?:boolean;assetRoot?:string;style?:React.CSSProperties}>=({pose='netral',wings=false,size=800,animate=true,assetRoot='assets/doodle-aulia',style})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 const enter=animate?spring({frame,fps,config:{damping:16}}):1;
 const hover=animate&&pose==='raja-multitasking'?Math.round(Math.sin(t*4)*7):0;
 const pulse=animate?1+Math.sin(t*6)*.025:1;
 const root=assetRoot.replace(/^\/+|\/+$/g,'');
 return <div style={{width:size,height:size,position:'relative',isolation:'isolate',...style}}>
 {wings&&<Img alt="" src={staticFile(`${root}/effects/sayap-phoenix.png`)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',transform:`scale(${pulse})`,opacity:Math.min(1,Math.max(0,enter))}}/>}
 <Img alt={`Aulia ${pose}`} src={staticFile(`${root}/${auliaPoses[pose]}`)} style={{position:'relative',width:'100%',height:'100%',objectFit:'contain',opacity:Math.min(1,Math.max(0,enter)),transform:`translateY(${Math.round((1-enter)*40)+hover}px) scale(${.9+enter*.1})`}}/>
 </div>;
};
