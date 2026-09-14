import http from 'node:http';
import {createReadStream,existsSync,statSync} from 'node:fs';
import {resolve,extname} from 'node:path';
const root=resolve('dist/portfolio/browser');
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
http.createServer((req,res)=>{
 if(req.url.startsWith('/api/')){const upstream=http.request({hostname:'127.0.0.1',port:8080,path:req.url,method:req.method,headers:req.headers},r=>{res.writeHead(r.statusCode,r.headers);r.pipe(res);});upstream.on('error',()=>{if(!res.headersSent)res.writeHead(503,{'Content-Type':'application/json'});res.end('{"error":"Backend unavailable"}');});req.pipe(upstream);res.on('close',()=>upstream.destroy());return;}
 let path;try{path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400);res.end();return;}
 if(path!==root&&!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}
 if(!existsSync(path)||statSync(path).isDirectory())path=resolve(root,'index.html');
 res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});createReadStream(path).pipe(res);
}).listen(4300,'127.0.0.1',()=>console.log('Portfolio preview: http://127.0.0.1:4300'));
