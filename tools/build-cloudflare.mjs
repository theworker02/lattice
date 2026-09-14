import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const dist=resolve(root,'dist');
const rootFiles=['index.html','mirrorfield.html','README.md','START_HERE.md','CONTRIBUTING.md','MANUFACTURER_PARTNERSHIP.md','LICENSE','TRADEMARKS.md','CHANGELOG.md','SECURITY.md','LATTICE_DESIGN_LANGUAGE.md','RFE-0001-MIRRORFIELD.md'];
const directories=['src','design','brand','docs','manufacturing','optical','schemas','firmware','hardware','protocols','calibration','quality','compliance','simulator','observatory','examples','operations'];

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const file of rootFiles)await cp(resolve(root,file),resolve(dist,file));
for(const directory of directories)await cp(resolve(root,directory),resolve(dist,directory),{recursive:true});
await writeFile(resolve(dist,'404.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LATTICE · Not found</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#10161c;color:#e7eef2;font:16px system-ui}main{max-width:38rem;padding:3rem}a{color:#a8ddd4}</style><main><p>LATTICE / MIRRORFIELD</p><h1>That page is not in this build.</h1><p>Return to the portal or start with the project guide.</p><p><a href="/mirrorfield.html">Open Mirrorfield</a> · <a href="/START_HERE.md">Start Here</a></p></main></html>`,'utf8');
console.log(`Cloudflare asset bundle ready: ${dist}`);
