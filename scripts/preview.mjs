import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const publicDir=fileURLToPath(new URL("../dist/",import.meta.url));
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".webp":"image/webp",".png":"image/png",".woff2":"font/woff2",".jpg":"image/jpeg",".txt":"text/plain; charset=utf-8",".xml":"application/xml; charset=utf-8"};
const port=Number(process.env.PORT||4173);
const hostname=process.env.AFFILIATEWRITER_PREVIEW_HOST||"127.0.0.1";
const server=createServer(async (request,response)=>{
  try {
    const url=new URL(request.url,"http://localhost");
    const path=decodeURIComponent(url.pathname);
    if (path.split("/").some(segment=>segment.startsWith("."))) {response.writeHead(404).end();return;}
    let file=resolve(publicDir,"."+path);
    if (!file.startsWith(publicDir) && file+"/"!==publicDir) {response.writeHead(404).end();return;}
    if (path.endsWith("/")) file=resolve(file,"index.html");
    let status=200, contents;
    try {contents=await readFile(file);}
    catch {
      if ((await stat(file).catch(()=>null))?.isDirectory()) {
        response.writeHead(308,{Location:url.pathname+"/"+url.search}).end();
        return;
      }
      file=resolve(publicDir,"404.html");
      contents=await readFile(file);
      status=404;
    }
    response.writeHead(status,{"Content-Type":mime[extname(file)]||"application/octet-stream","X-Content-Type-Options":"nosniff"});
    response.end(request.method==="HEAD"?undefined:contents);
  } catch {response.writeHead(400).end();}
});
server.listen(port,hostname,()=>console.log(`Preview at http://${hostname}:${port}/`));
