import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { websitePages, render, host } from '../src/site.mjs';

const root = fileURLToPath(new URL("..",import.meta.url));
const out = join(root,"dist");
const preview = process.argv.includes("--private-preview");
const pages = websitePages();
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
await cp(join(root,"assets"),join(out,"assets"),{recursive:true});
for (const file of [".htaccess","og-image.jpg"]) await cp(join(root,"public",file),join(out,file));
for (const page of pages) {
  const output=join(out,page.path.endsWith("/")?page.path+"index.html":page.path);
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,render(page,preview));
}
const indexable = pages.filter(page=>!page.noindex);
await writeFile(join(out,"robots.txt"),preview?"User-agent: *\nDisallow: /\n":`User-agent: *\nAllow: /\nSitemap: ${host}/sitemap.xml\n`);
await writeFile(join(out,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(p=>`  <url><loc>${host}${p.path}</loc>${p.structured?.dateModified?`<lastmod>${p.structured.dateModified}</lastmod>`:""}</url>`).join("\n")}
</urlset>
`);
console.log(`Built ${pages.length} pages${preview?" for private preview":""} in dist/`);
