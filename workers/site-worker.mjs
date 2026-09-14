/**
 * Static-first Cloudflare Worker for the public LATTICE portal.
 * The application itself remains local-first: simulation state stays in the browser.
 */
const securityHeaders={
  'Content-Security-Policy':"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy':'same-origin',
  'Cross-Origin-Resource-Policy':'same-origin',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Permissions-Policy':'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
};

function cacheControl(pathname){
  if(pathname.endsWith('.html')||pathname.endsWith('.md'))return 'no-cache';
  if(/\.(?:mjs|js|css|svg|png|json)$/i.test(pathname))return 'public, max-age=86400';
  return 'public, max-age=3600';
}

export default {
  async fetch(request,env){
    if(request.method!=='GET'&&request.method!=='HEAD'){
      return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
    }
    const url=new URL(request.url);
    const assetRequest=url.pathname==='/'
      ?new Request(new URL('/mirrorfield.html',url),request)
      :request;
    const assetResponse=await env.ASSETS.fetch(assetRequest);
    const headers=new Headers(assetResponse.headers);
    for(const [name,value] of Object.entries(securityHeaders))headers.set(name,value);
    headers.set('Cache-Control',cacheControl(url.pathname==='/'?'/mirrorfield.html':url.pathname));
    return new Response(request.method==='HEAD'?null:assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
  },
};
