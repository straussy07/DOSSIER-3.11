import {test} from 'node:test';import assert from 'node:assert/strict';import {api,RELEASE} from './worker.mjs';
test('Paris midnight corresponds to 23:00 UTC the previous day',()=>assert.equal(new Date(RELEASE).toISOString(),'2026-11-02T23:00:00.000Z'));
test('reveal denied before boundary, including query-state manipulation',async()=>{for(const now of [0,RELEASE-1]){const r=api('/api/reveal',{PROJECT_URL:'https://secret.example',REVEAL_MESSAGE:'PRIVATE'},now);assert.equal(r.status,403);assert.equal((await r.text()).includes('PRIVATE'),false)}});
test('reveal available at exact boundary and afterwards',async()=>{for(const now of [RELEASE,RELEASE+10000]){const r=api('/api/reveal',{PROJECT_URL:'https://example.com',REVEAL_MESSAGE:'READY'},now);assert.equal(r.status,200);assert.equal((await r.json()).message,'READY');assert.equal(r.headers.get('Cache-Control'),'no-store, max-age=0')}});
test('no configured URL gives safe custom reveal; unsafe protocols rejected',async()=>{for(const url of [undefined,'javascript:alert(1)','http://example.com','invalid']){const d=await api('/api/reveal',{PROJECT_URL:url},RELEASE).json();assert.equal(d.url,null);assert.ok(d.title)}});
test('status returns server clock; unknown APIs return 404',async()=>{assert.equal((await api('/api/status',{},123).json()).now,123);assert.equal(api('/api/nope').status,404)});

import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('le HTML autonome contient des scripts valides sans fichier externe',()=>{
 const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.ok(!/<(?:script|link)[^>]+(?:src|href)=/i.test(html));
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
 assert.ok(scripts.length>=3);
 for(const [,script] of scripts)new vm.Script(script);
 assert.ok(html.includes("code==='140'"));
 assert.ok(html.includes('id="activeCircuit"'));
});

import {DOOR_AT,ROOM_AT,chapterAt} from './worker.mjs';
test('J-8 and J-7 follow Paris midnight across October clock change',()=>{
 assert.equal(DOOR_AT,Date.parse('2026-10-24T23:00:01Z'));
 assert.equal(ROOM_AT,Date.parse('2026-10-25T23:00:01Z'));
 assert.equal(chapterAt(DOOR_AT-1),'game');assert.equal(chapterAt(DOOR_AT),'door');
 assert.equal(chapterAt(ROOM_AT-1),'door');assert.equal(chapterAt(ROOM_AT),'room');
 assert.equal(chapterAt(RELEASE),'reveal');
});
test('room image is denied before J-7 even with client-state parameters',async()=>{
 for(const now of [DOOR_AT-1,DOOR_AT,ROOM_AT-1])assert.equal(api('/api/room-image',{},now).status,403);
 const open=api('/api/room-image',{},ROOM_AT);assert.equal(open.status,200);assert.equal(open.headers.get('Content-Type'),'image/jpeg');
 const bytes=new Uint8Array(await open.arrayBuffer());assert.equal(bytes[0],255);assert.equal(bytes[1],216);
 assert.equal(api('/api/room-image?preview=room',{},ROOM_AT-1).status,404);
});
test('exact requested countdown thresholds and protected audio/pose',async()=>{
 assert.equal((RELEASE-DOOR_AT)/1000,8*86400+23*3600+59*60+59);
 assert.equal((RELEASE-ROOM_AT)/1000,7*86400+23*3600+59*60+59);
 for(const path of ['/api/room-audio','/api/room-turn']){assert.equal(api(path,{},ROOM_AT-1).status,403);assert.equal(api(path,{},ROOM_AT).status,200)}
});
import {CLUE_AT,clueAt} from './worker.mjs';
test('five clues unlock exactly every 24h, never before their own boundary',async()=>{
 assert.equal((RELEASE-CLUE_AT)/1000,6*86400+23*3600+59*60+59);
 for(let n=1;n<=5;n++){assert.equal(clueAt(n),CLUE_AT+(n-1)*86400000);assert.equal(api('/api/clue/'+n,{},clueAt(n)-1).status,403);const r=api('/api/clue/'+n,{},clueAt(n));assert.equal(r.status,200);assert.equal(r.headers.get('Content-Type'),'image/jpeg');assert.ok((await r.arrayBuffer()).byteLength>10000)}
 for(const path of ['/api/clue/0','/api/clue/6','/api/clue/1?day=5'])assert.equal(api(path,{},0).status,404);
});
