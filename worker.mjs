import {CLUE_IMAGES} from './clues-data.mjs';
import {ROOM_IMAGE,ROOM_AUDIO,ROOM_TURN} from './room-data.mjs';
export const RELEASE = Date.parse('2026-11-03T00:00:00+01:00');
export const DOOR_AT=Date.parse('2026-10-24T22:00:00Z');
export const ROOM_AT=Date.parse('2026-10-26T23:00:00Z');
export const CLUE_AT=Date.parse('2026-10-26T23:00:00Z');
export const FINALE_AT=Date.parse('2026-11-01T00:00:00+01:00'),SAFE_AT=Date.parse('2026-11-02T00:00:00+01:00'),LETTER_AT=Date.parse('2026-11-03T18:00:00+01:00');
export const clueAt=id=>CLUE_AT+(id-1)*86400000;
export const chapterAt=t=>t>=RELEASE?'reveal':t>=ROOM_AT?'room':t>=DOOR_AT?'door':'game';
export function api(path, env={}, now=Date.now()) {
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};
  if(path==='/api/letter-clock')return Response.json({now,releaseAt:LETTER_AT,finaleAt:FINALE_AT,safeAt:SAFE_AT},{headers});
  if(path==='/api/letter-access')return Response.json({allowed:now>=SAFE_AT,unlockAt:SAFE_AT},{status:now>=SAFE_AT?200:403,headers});
  if(path==='/api/letter-reveal'){if(now<LETTER_AT)return Response.json({error:'sealed',unlockAt:LETTER_AT},{status:403,headers});let url=null;try{const u=new URL(env.LETTER_PROJECT_URL);if(u.protocol==='https:')url=u.href}catch{}return Response.json({message:env.LETTER_REVEAL_MESSAGE||'Le rendez-vous est arrivé. La suite sera annoncée ici.',url},{headers})}
  const clueMatch=/^\/api\/clue\/([1-5])$/.exec(path);
  if(clueMatch){const id=Number(clueMatch[1]);if(now<clueAt(id))return new Response(JSON.stringify({error:'sealed',unlockAt:clueAt(id)}),{status:403,headers});return new Response(Uint8Array.from(atob(CLUE_IMAGES[id-1]),c=>c.charCodeAt(0)),{headers:{...headers,'Content-Type':'image/jpeg'}})}
  if(path==='/api/status')return new Response(JSON.stringify({now,releaseAt:RELEASE,chapter:chapterAt(now),doorAt:DOOR_AT,roomAt:ROOM_AT,finaleAt:FINALE_AT,safeAt:SAFE_AT,letterReleaseAt:LETTER_AT,build:'complete-18h'}),{headers});
  if(['/api/room-image','/api/room-turn','/api/room-audio'].includes(path)){
    if(now<ROOM_AT)return new Response(JSON.stringify({error:'sealed'}),{status:403,headers});
    return new Response(Uint8Array.from(atob(path==='/api/room-audio'?ROOM_AUDIO:path==='/api/room-turn'?ROOM_TURN:ROOM_IMAGE),c=>c.charCodeAt(0)),{headers:{...headers,'Content-Type':path==='/api/room-audio'?'audio/mpeg':'image/jpeg'}});
  }
  if(path==='/api/reveal'){
    if(now<RELEASE)return new Response(JSON.stringify({error:'sealed'}),{status:403,headers});
    let url=null;try{const u=new URL(env.PROJECT_URL);if(u.protocol==='https:')url=u.href}catch{}
    return new Response(JSON.stringify({title:env.REVEAL_TITLE||'LE DOSSIER EST OUVERT.',message:env.REVEAL_MESSAGE||'Le silence est terminé. La suite arrive ici. Reste connecté.',url}),{headers});
  }
  return new Response(JSON.stringify({error:'not_found'}),{status:404,headers});
}
export default {async fetch(request,env){const url=new URL(request.url),path=decodeURIComponent(url.pathname).replace(/\/+/g,'/');const now=Date.now();if(path.startsWith('/api/'))return api(path,env,now);if(path==='/'||path==='/index.html'){url.pathname='/index.html';request=new Request(url,request)}if(/^\/(?:suite|finale)(?:\.html)?\/?$/.test(path)){if(now<FINALE_AT)return new Response('Le dernier chapitre est encore scellé.',{status:403,headers:{'Cache-Control':'no-store'}});url.pathname='/index.html';request=new Request(url,request)}const response=await env.ASSETS.fetch(request);const h=new Headers(response.headers);h.set('Cache-Control','no-store');h.set('X-Content-Type-Options','nosniff');h.set('Referrer-Policy','strict-origin-when-cross-origin');h.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');h.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob: data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");return new Response(response.body,{status:response.status,headers:h})}};
