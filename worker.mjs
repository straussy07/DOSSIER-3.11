export const RELEASE = Date.parse('2026-11-03T00:00:00+01:00');
export function api(path, env={}, now=Date.now()) {
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};
  if(path==='/api/status')return new Response(JSON.stringify({now,releaseAt:RELEASE}),{headers});
  if(path==='/api/reveal'){
    if(now<RELEASE)return new Response(JSON.stringify({error:'sealed'}),{status:403,headers});
    let url=null;try{const u=new URL(env.PROJECT_URL);if(u.protocol==='https:')url=u.href}catch{}
    return new Response(JSON.stringify({title:env.REVEAL_TITLE||'LE DOSSIER EST OUVERT.',message:env.REVEAL_MESSAGE||'Le silence est terminé. La suite arrive ici. Reste connecté.',url}),{headers});
  }
  return new Response(JSON.stringify({error:'not_found'}),{status:404,headers});
}
export default {async fetch(request,env){const path=new URL(request.url).pathname;if(path.startsWith('/api/'))return api(path,env);const response=await env.ASSETS.fetch(request);const h=new Headers(response.headers);h.set('X-Content-Type-Options','nosniff');h.set('Referrer-Policy','strict-origin-when-cross-origin');h.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');h.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");return new Response(response.body,{status:response.status,headers:h})}};
