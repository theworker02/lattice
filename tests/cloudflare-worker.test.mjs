import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/site-worker.mjs';

function mockAssets(status=200,contentType='text/html'){
  const requests=[];
  return {
    requests,
    ASSETS:{fetch:async request=>{
      requests.push(new URL(request.url));
      return new Response('asset body',{status,headers:{'Content-Type':contentType}});
    }},
  };
}

test('Cloudflare Worker routes the root request to Mirrorfield and adds public headers',async()=>{
  const mock=mockAssets();
  const response=await worker.fetch(new Request('https://lattice.example/'),mock);
  assert.equal(mock.requests[0].pathname,'/mirrorfield.html');
  assert.equal(await response.text(),'asset body');
  assert.equal(response.headers.get('Cache-Control'),'no-cache');
  assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');
  assert.match(response.headers.get('Content-Security-Policy'),/default-src 'self'/);
});

test('Cloudflare Worker keeps asset paths and applies the expected cache category',async()=>{
  const mock=mockAssets(200,'image/svg+xml');
  const response=await worker.fetch(new Request('https://lattice.example/design/concepts/solarskin-stack.svg'),mock);
  assert.equal(mock.requests[0].pathname,'/design/concepts/solarskin-stack.svg');
  assert.equal(response.headers.get('Cache-Control'),'public, max-age=86400');
  assert.equal(response.headers.get('Cross-Origin-Opener-Policy'),'same-origin');
});

test('Cloudflare Worker rejects non-read requests and supports HEAD',async()=>{
  const post=await worker.fetch(new Request('https://lattice.example/',{method:'POST'}),mockAssets());
  assert.equal(post.status,405);
  assert.equal(post.headers.get('Allow'),'GET, HEAD');
  const mock=mockAssets();
  const head=await worker.fetch(new Request('https://lattice.example/README.md',{method:'HEAD'}),mock);
  assert.equal(head.status,200);
  assert.equal(await head.text(),'');
  assert.equal(head.headers.get('Cache-Control'),'no-cache');
});
