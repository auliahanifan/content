import React from 'react';
import {Img,staticFile,spring,useCurrentFrame,useVideoConfig} from 'remotion';
export const auliaPoses={
  "netral": "characters/netral.png",
  "menjelaskan": "characters/menjelaskan.png",
  "menunjuk": "characters/menunjuk.png",
  "berpikir": "characters/berpikir.png",
  "setuju": "characters/setuju.png",
  "menyapa": "characters/menyapa.png",
  "stop": "characters/stop.png",
  "laptop": "characters/laptop.png",
  "smartphone": "characters/smartphone.png",
  "presentasi": "characters/presentasi.png",
  "mencatat": "characters/mencatat.png",
  "ngopi": "characters/ngopi.png",
  "facepalm": "characters/facepalm.png",
  "murka": "reactions/murka.png",
  "fokus": "reactions/fokus.png",
  "kaget": "reactions/kaget.png",
  "percaya-diri": "reactions/percaya-diri.png",
  "sedih": "reactions/sedih.png",
  "semangat": "reactions/semangat.png",
  "bingung": "reactions/bingung.png",
  "lelah": "reactions/lelah.png",
  "dapat-ide": "reactions/dapat-ide.png",
  "tertawa": "reactions/tertawa.png",
  "skeptis": "reactions/skeptis.png",
  "menang": "reactions/menang.png",
  "panik": "reactions/panik.png",
  "malu": "reactions/malu.png",
  "mode-jenius": "reactions/mode-jenius.png",
  "deadline-samurai": "reactions/deadline-samurai.png",
  "raja-multitasking": "reactions/raja-multitasking.png",
  "ditelan-algoritma": "reactions/ditelan-algoritma.png",
  "dompet-kritis": "reactions/dompet-kritis.png",
  "mode-biksu": "reactions/mode-biksu.png",
  "bangkit-lagi": "reactions/bangkit-lagi.png",
  "otak-overload": "reactions/otak-overload.png",
  "pawang-ai": "reactions/pawang-ai.png",
  "eksekusi-meteor": "reactions/eksekusi-meteor.png"
} as const;
export const auliaEffects={
  "aura-emas": "effects/aura-emas.png",
  "petir-biru": "effects/petir-biru.png",
  "impact-ungu": "effects/impact-ungu.png",
  "portal-hijau": "effects/portal-hijau.png",
  "speedlines-merah": "effects/speedlines-merah.png",
  "partikel-bintang": "effects/partikel-bintang.png",
  "cincin-deadline": "effects/cincin-deadline.png",
  "sayap-phoenix": "effects/sayap-phoenix.png",
  "badai-notifikasi": "effects/badai-notifikasi.png"
} as const;
export type AuliaPose=keyof typeof auliaPoses;
export type AuliaEffect=keyof typeof auliaEffects;
export const Aulia:React.FC<{pose?:AuliaPose;effect?:AuliaEffect;wings?:boolean;size?:number;animate?:boolean;assetRoot?:string;effectScale?:number;style?:React.CSSProperties}>=({pose='netral',effect,wings=false,size=800,animate=true,assetRoot='assets/paper-cutout-aulia',effectScale=1,style})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 const enter=animate?spring({frame,fps,config:{damping:16}}):1;
 const floating=['percaya-diri','dapat-ide','mode-jenius','raja-multitasking','mode-biksu','bangkit-lagi','pawang-ai'].includes(pose);
 const energetic=['murka','semangat','panik','deadline-samurai','ditelan-algoritma','otak-overload','eksekusi-meteor'].includes(pose);
 const hover=animate&&floating?Math.round(Math.sin(t*4)*7):0;
 const shake=animate&&energetic?Math.round(Math.sin(t*65)*3):0;
 const meteor=pose==='eksekusi-meteor';const x=shake+(meteor?Math.round((1-enter)*-size*.55):0);
 const y=Math.round((1-enter)*(meteor?-size*.4:40))+hover;
 const rotation=animate&&pose==='deadline-samurai'?(1-enter)*-18:animate&&pose==='ditelan-algoritma'?Math.sin(t*8)*4:0;
 const pulse=animate?1+Math.sin(t*6)*.025:1;
 const selected=effect??(wings?'sayap-phoenix':undefined);
 const root=assetRoot.replace(/^\/+|\/+$/g,'');
 return <div style={{width:size,height:size,position:'relative',isolation:'isolate',...style}}>
 {selected&&<Img alt="" src={staticFile(`${root}/${auliaEffects[selected]}`)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',transform:`rotate(${animate&&selected==='cincin-deadline'?t*12:0}deg) scale(${pulse*effectScale})`,opacity:Math.min(1,Math.max(0,enter))}}/>}
 <Img alt={`Aulia ${pose}`} src={staticFile(`${root}/${auliaPoses[pose]}`)} style={{position:'relative',width:'100%',height:'100%',objectFit:'contain',opacity:Math.min(1,Math.max(0,enter)),transform:`translate(${x}px,${y}px) rotate(${rotation}deg) scale(${.9+enter*.1})`}}/>
 </div>;
};
