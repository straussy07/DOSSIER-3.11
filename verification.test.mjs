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
