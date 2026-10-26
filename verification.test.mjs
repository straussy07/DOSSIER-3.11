import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import dossierWorker, {api, RELEASE, DOOR_AT, ROOM_AT, CLUE_AT, clueAt, FINALE_AT, SAFE_AT, LETTER_AT, chapterAt, halloweenAt} from './worker.mjs';

const millis = value => Date.parse(value);
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test('Heure de Paris : apparition de la porte le 25/10 à 00h, salle le 26/10 à 00h', () => {
  assert.equal(DOOR_AT, millis('2026-10-25T00:00:00+02:00'));
  assert.equal(ROOM_AT, millis('2026-10-26T00:00:00+01:00'));
  assert.equal(ROOM_AT - DOOR_AT, 25 * 3600000); // changement d'heure dans la nuit du 25
  assert.equal(chapterAt(DOOR_AT - 1), 'game');
  assert.equal(chapterAt(DOOR_AT), 'door');
  assert.equal(chapterAt(ROOM_AT - 1), 'door');
  assert.equal(chapterAt(ROOM_AT), 'room');
});

test('Indices : un nouveau à minuit les 27, 28, 29, 30 et 31 octobre', () => {
  assert.equal(CLUE_AT, millis('2026-10-27T00:00:00+01:00'));
  const dates = ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'];
  for (let id = 1; id <= 5; id++) {
    const unlock = millis(`${dates[id-1]}T00:00:00+01:00`);
    assert.equal(clueAt(id), unlock);
    assert.equal(api(`/api/clue/${id}`, {}, unlock - 1).status, 403);
    assert.equal(api(`/api/clue/${id}`, {}, unlock).status, 200);
  }
  // Le 26 : la pièce est accessible, mais AUCUN indice ne l'est encore.
  for (let id = 1; id <= 5; id++) assert.equal(api(`/api/clue/${id}`, {}, ROOM_AT).status, 403);
});

test('Pièce, sons et image : accessibles dès le 26 octobre à minuit', () => {
  for (const path of ['/api/room-image', '/api/room-turn', '/api/room-audio']) {
    assert.equal(api(path, {}, ROOM_AT - 1).status, 403);
    assert.equal(api(path, {}, ROOM_AT).status, 200);
  }
});

test('Jalons du dernier chapitre, coffre et deux compteurs restent indépendants', () => {
  assert.equal(FINALE_AT, millis('2026-11-01T00:00:00+01:00'));
  assert.equal(SAFE_AT, millis('2026-11-02T00:00:00+01:00'));
  assert.equal(RELEASE, millis('2026-11-03T00:00:00+01:00'));
  assert.equal(LETTER_AT, millis('2026-11-03T18:00:00+01:00'));
  assert.equal(LETTER_AT-RELEASE, 18 * 3600000);
  assert.equal(api('/api/letter-access', {}, SAFE_AT - 1).status, 403);
  assert.equal(api('/api/letter-access', {}, SAFE_AT).status, 200);
  assert.equal(api('/api/reveal', {}, RELEASE - 1).status, 403);
  assert.equal(api('/api/reveal', {}, RELEASE).status, 200);
  assert.equal(api('/api/letter-reveal', {}, LETTER_AT - 1).status, 403);
  assert.equal(api('/api/letter-reveal', {}, LETTER_AT).status, 200);
});

test('Statut API publie les mêmes échéances au navigateur', async () => {
  const d = await api('/api/status', {}, ROOM_AT).json();
  assert.equal(d.doorAt, DOOR_AT);
  assert.equal(d.roomAt, ROOM_AT);
  assert.equal(d.releaseAt, RELEASE);
  assert.equal(d.finaleAt, FINALE_AT);
  assert.equal(d.safeAt, SAFE_AT);
  assert.equal(d.letterReleaseAt, LETTER_AT);
  assert.equal(d.chapter, 'room');
  assert.equal((await api('/api/status', {}, FINALE_AT).json()).chapter, 'finale');
});

test('HTML : cinq indices, porte et salle synchronisés avec les dates serveur', () => {
  const values = {
    porteMs: DOOR_AT,
    salleMs: ROOM_AT,
    cibleMs: RELEASE,
  };
  for (const [key, actual] of Object.entries(values)) {
    const match = html.match(new RegExp(`${key}: Date\\.parse\\('([^']+)'\\)`));
    assert.ok(match, `La date ${key} doit être présente dans le HTML`);
    assert.equal(Date.parse(match[1]), actual, `HTML et Worker doivent être synchronisés pour ${key}`);
  }
  const indices = html.match(/indicesMs: Object\.freeze\(\[([\s\S]*?)\]\)/);
  assert.ok(indices, 'Le tableau des indices doit être présent');
  const times = [...indices[1].matchAll(/Date\.parse\('([^']+)'\)/g)].map(x => Date.parse(x[1]));
  assert.deepEqual(times, Array.from({length:5},(_,i)=>clueAt(i+1)));
});

test('Le dernier chapitre reste dans index.html et ne se transforme pas en une autre révélation', () => {
  assert.match(html, /dossier-finale-template/);
  assert.match(html, /dossier-public-finale-controller/);
  assert.match(html, /window\.DOSSIER_FINALE_START/);
  assert.match(html, /scheduleCycle\(\)/);
  assert.match(html, /function isLoopDay|const isLoopDay/);
  assert.doesNotMatch(html, /location\.replace\('\/suite'\)/);
  assert.doesNotMatch(html, /DOSSIER_TEST_MODE|dossier-test-panel|__DOSSIER_SIMULATED_EPOCH__|MODE TEST · TEMPS/);
});

test('Chaque fiche lance le zoom de caméra avant son ouverture, et annule le zoom après fermeture', () => {
 assert.match(html,/clueCameraTransform\(camera,p\)/);
 assert.match(html,/this\.animate\(850,p=>this\.clueCameraTransform\(camera,p\)\)/);
 assert.match(html,/this\.animate\(730,p=>this\.clueCameraTransform\(oldCamera,1-p\)\)/);
});

test('La dernière scène ne révèle aucun nouvel écran à 18h le 3 novembre', () => {
 assert.match(html,/if\(letterNow\(\)>=LETTER_RELEASE\)/);
 assert.doesNotMatch(html,/if\(letterNow\(\)>=LETTER_RELEASE\)\{c\.innerHTML=.*revealLetter\(\)/);
 assert.match(html,/frame\.srcdoc/);
});

test('URL de la lettre : seulement HTTPS, et jamais avant 18h le 3 novembre', async () => {
  for (const env of [{}, {LETTER_PROJECT_URL:'javascript:alert(1)'}]) {
    assert.equal((await api('/api/letter-reveal', env, LETTER_AT).json()).url,null);
  }
  assert.equal((await api('/api/letter-reveal', {LETTER_PROJECT_URL:'https://example.com'}, LETTER_AT).json()).url, 'https://example.com/');
});


test('La racine / sert bien index.html (Cloudflare html_handling: none)', async () => {
  const response = await dossierWorker.fetch(new Request('https://example.workers.dev/'), {
    ASSETS: { fetch: request => new Response(new URL(request.url).pathname) },
  });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '/index.html');
});

// Contrôle des médias réellement fournis par le propriétaire du projet.
import {CLUE_IMAGES} from './clues-data.mjs';
import {ROOM_IMAGE, ROOM_TURN, ROOM_AUDIO} from './room-data.mjs';

test('Fichiers multimédias originaux : cinq JPEG, deux JPEG de pièce et un MP3', async () => {
  assert.equal(CLUE_IMAGES.length, 5);
  for (const [label, value] of [...CLUE_IMAGES.map((b,i)=>[`indice-${i+1}`,b]), ['piece',ROOM_IMAGE], ['piece-tournee',ROOM_TURN]]) {
    const data=Buffer.from(value,'base64');
    assert.ok(data.length > 50000, `${label} ne contient pas une image suffisante`);
    assert.equal(data[0],0xFF); assert.equal(data[1],0xD8);
  }
  const audio=Buffer.from(ROOM_AUDIO,'base64');
  assert.ok(audio.length > 5000);
  assert.ok(audio.toString('ascii',0,3)==='ID3' || audio[0]===0xFF,'Audio MP3 attendu');
  const res=api('/api/clue/1',{},clueAt(1));
  assert.match(res.headers.get('content-type'),/image\/jpeg/);
  const jpeg=Buffer.from(await res.arrayBuffer());
  assert.deepEqual(jpeg,Buffer.from(CLUE_IMAGES[0],'base64'));
});


test('Halloween : actif uniquement le 31 octobre, sans mode test et sans fuite des visuels', () => {
  assert.match(html, /id="halloween-day-animation-styles"/);
  assert.match(html, /id="halloween-day-assets"/);
  assert.match(html, /this\.halloween=\(now\(\)>=window\.DOSSIER_HALLOWEEN\.start/);
  assert.match(html, /halloween\?6000:5200/);
  assert.match(html, /this\.animate\(850,p=>this\.clueCameraTransform\(camera,p\)\)/);
  assert.doesNotMatch(html, /window\.DOSSIER_TEST_MODE|MODE TEST|__DOSSIER_SIMULATED_EPOCH__|dossier-test-panel/);
  assert.doesNotMatch(html, /data:image\/webp;base64,UklGRky\+Bw/);
  assert.match(html, /halloween-door\.webp/);
  assert.match(html, /halloween-room\.webp/);
});

test('Visuels Halloween : les bornes 00h00 Europe/Paris sont exactes',()=>{
  const start=Date.parse('2026-10-31T00:00:00+01:00'),end=Date.parse('2026-11-01T00:00:00+01:00');
  assert.equal(halloweenAt(start-1),false);
  assert.equal(halloweenAt(start),true);
  assert.equal(halloweenAt(end-1),true);
  assert.equal(halloweenAt(end),false);
});


test('Le Worker bloque réellement les deux visuels en dehors du 31 octobre', async () => {
  const start=Date.parse('2026-10-31T00:00:00+01:00'),end=Date.parse('2026-11-01T00:00:00+01:00');
  const original=Date.now;
  try {
    for(const path of ['/halloween-door.webp','/halloween-room.webp']) {
      for(const [instant,expected] of [[start-1,403],[start,200],[end-1,200],[end,403]]) {
        Date.now=()=>instant;
        const response=await dossierWorker.fetch(new Request('https://example.workers.dev'+path),{
          ASSETS:{fetch:request=>new Response(new URL(request.url).pathname,{status:200})}
        });
        assert.equal(response.status,expected,`${path} à ${new Date(instant).toISOString()}`);
        assert.equal(response.headers.get('cache-control'),'no-store');
      }
    }
  } finally { Date.now=original; }
});

test('Deux fichiers WebP Halloween valides et repris par le build',()=>{
  for(const file of ['halloween-door.webp','halloween-room.webp']){
    const b=readFileSync(new URL('./'+file,import.meta.url));
    assert.ok(b.length>50000);
    assert.equal(b.toString('ascii',0,4),'RIFF');
    assert.equal(b.toString('ascii',8,12),'WEBP');
  }
});
