import test from 'node:test';import assert from 'node:assert/strict';import{api,RELEASE,DOOR_AT,ROOM_AT,clueAt,FINALE_AT,SAFE_AT,LETTER_AT}from'./worker.mjs';
test('Horaires précédents préservés et compteur lettre distinct',()=>{assert.equal(RELEASE,Date.parse('2026-11-02T23:00:00Z'));assert.equal(DOOR_AT,Date.parse('2026-10-24T22:00:00Z'));assert.equal(ROOM_AT,Date.parse('2026-10-26T23:00:00Z'));assert.equal(LETTER_AT,Date.parse('2026-11-03T17:00:00Z'));assert.equal(LETTER_AT-RELEASE,18*3600000)});
test('Chaque indice se débloque exactement à son horaire',()=>{for(let id=1;id<=5;id++){assert.equal(api('/api/clue/'+id,{},clueAt(id)-1).status,403);assert.equal(api('/api/clue/'+id,{},clueAt(id)).status,200)}});
test('Salle et audio restent scellés avant la date',()=>{for(const p of ['/api/room-image','/api/room-turn','/api/room-audio']){assert.equal(api(p,{},ROOM_AT-1).status,403);assert.equal(api(p,{},ROOM_AT).status,200)}});
test('Déverrouillage coffre séparé de la révélation',()=>{assert.equal(api('/api/letter-access',{},SAFE_AT-1).status,403);assert.equal(api('/api/letter-access',{},SAFE_AT).status,200);assert.equal(api('/api/letter-reveal',{},LETTER_AT-1).status,403);assert.equal(api('/api/letter-reveal',{},LETTER_AT).status,200)});
test('Révélation initiale reste à minuit',()=>{assert.equal(api('/api/reveal',{},RELEASE-1).status,403);assert.equal(api('/api/reveal',{},RELEASE).status,200)});
test('Pas de lien cassé et URL limitée à HTTPS',async()=>{for(const env of [{},{LETTER_PROJECT_URL:'javascript:alert(1)'}])assert.equal((await api('/api/letter-reveal',env,LETTER_AT).json()).url,null);assert.equal((await api('/api/letter-reveal',{LETTER_PROJECT_URL:'https://example.com'},LETTER_AT).json()).url,'https://example.com/')});
test('Statut serveur publie deux échéances indépendantes',async()=>{const d=await api('/api/status',{},FINALE_AT).json();assert.equal(d.releaseAt,RELEASE);assert.equal(d.letterReleaseAt,LETTER_AT);assert.equal(d.finaleAt,FINALE_AT)});

// Vérifie directement les headers qui empêchent le téléchargement de la page.
import worker from './worker.mjs';
test('Page accueil servie en HTML dans le navigateur, jamais comme téléchargement', async () => {
  const visited=[];
  const env={ASSETS:{fetch:async req=>{
    visited.push(new URL(req.url).pathname);
    // Simule le cas problématique d'un asset retournant attachment/octet-stream.
    return new Response('<!doctype html><title>Dossier</title>', {status:200,headers:{
      'Content-Type':'application/octet-stream',
      'Content-Disposition':'attachment; filename="index.html"'
    }});
  }}};
  for (const page of ['/', '/index.html']) {
    const res=await worker.fetch(new Request('https://example.workers.dev'+page),env);
    assert.equal(res.status,200);
    assert.equal(res.headers.get('Content-Type'),'text/html; charset=utf-8');
    assert.equal(res.headers.get('Content-Disposition'),'inline');
    assert.match(await res.text(),/^<!doctype html>/i);
  }
  assert.deepEqual(visited,['/index.html','/index.html']);
});

test('Le premier compteur est le 3 novembre à minuit en heure de Paris, à la seconde près', async () => {
  assert.equal(RELEASE,Date.parse('2026-11-03T00:00:00+01:00'));
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone:'Europe/Paris', year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit', minute:'2-digit',second:'2-digit',hourCycle:'h23'
  }).formatToParts(new Date(RELEASE)).map(p=>[p.type,p.value]));
  assert.equal([parts.year,parts.month,parts.day,parts.hour,parts.minute,parts.second].join('-'), '2026-11-03-00-00-00');
  assert.equal(api('/api/reveal',{},RELEASE-1000).status,403);
  assert.equal(api('/api/reveal',{},RELEASE-1).status,403);
  assert.equal(api('/api/reveal',{},RELEASE).status,200);
  assert.equal(api('/api/letter-reveal',{},RELEASE).status,403);
});
