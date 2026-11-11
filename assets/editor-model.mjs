const formats = ["review", "comparison", "guide", "roundup", "email", "social"];
const maxProducts = 8;
const maxDrafts = 60;
const text = (value, limit) => typeof value === "string" ? value.slice(0, limit) : "";
const freshProduct = () => ({name:"", source:"", facts:"", tradeoff:"", affiliate:"", checked:""});
const freshDraft = lang => ({
  id: crypto.randomUUID(), lang, type:"review", title:"", keyword:"", audience:"",
  products:[freshProduct()], markdown:"", signature:""
});

function normalizeDraft(draft) {
  if (!draft || typeof draft !== "object") return null;
  const products = Array.isArray(draft.products) ? draft.products.slice(0,maxProducts).map(p => ({
    name:text(p?.name,180), source:text(p?.source,2048), facts:text(p?.facts,2200),
    tradeoff:text(p?.tradeoff,800), affiliate:text(p?.affiliate,2048), checked:text(p?.checked,10)
  })) : [];
  return {
    id:/^[\da-f-]{36}$/i.test(draft.id) ? draft.id : crypto.randomUUID(),
    lang:draft.lang === "es" ? "es" : "en", type:formats.includes(draft.type) ? draft.type : "review",
    title:text(draft.title,150),keyword:text(draft.keyword,160),audience:text(draft.audience,800),
    products:products.length ? products : [freshProduct()],markdown:text(draft.markdown,64000),
    signature:text(draft.signature,64000)
  };
}

function safeUrl(input) {
  try {
    const u = new URL(input);
    if (!["http:","https:"].includes(u.protocol) || u.username || u.password) return "";
    return u.href;
  } catch { return ""; }
}

const strings = {
  en: {
    names:["Review","Comparison","Buying guide","Product roundup","Affiliate email","Social post"],
    disclosure:"This article contains affiliate links. I may earn a commission if you buy through them.",
    disclosureLabel:"Affiliate disclosure", source:"Source", affiliate:"View at the merchant", checked:"Last checked",
    criteria:"What to compare", product:"Product", evidence:"Documented notes", tradeoff:"Trade-offs",
    evidenceMissing:"Product notes to be added.", needSource:"Source to be added.", overview:"At a glance",
    next:"Before deciding", nextText:"Check the exact model and the current terms at the merchant.",
    exampleTitle:"Choosing a manual coffee grinder", audience:"For someone choosing a grinder for a small kitchen.",
    sampleProducts:[
      ["Travel grinder (example)","Illustrative note: slim body for a travel kit.", "Check the capacity against your usual brew size."],
      ["Kitchen grinder (example)","Illustrative note: larger container for brewing several cups.", "Check its footprint on your counter."]
    ]
  },
  es: {
    names:["Reseña","Comparativa","Guía de compra","Selección de productos","Correo de afiliación","Publicación en redes"],
    disclosure:"Este artículo contiene enlaces de afiliación. Puedo recibir una comisión si compras a través de ellos.",
    disclosureLabel:"Aviso de afiliación", source:"Fuente", affiliate:"Ver en el comercio", checked:"Última comprobación",
    criteria:"Qué comparar", product:"Producto", evidence:"Notas documentadas", tradeoff:"Limitaciones",
    evidenceMissing:"Faltan las notas de producto.", needSource:"Falta la fuente.", overview:"De un vistazo",
    next:"Antes de decidir", nextText:"Comprueba el modelo exacto y las condiciones vigentes en el comercio.",
    exampleTitle:"Cómo elegir un molinillo manual de café",audience:"Para quien busca un molinillo para una cocina pequeña.",
    sampleProducts:[
      ["Molinillo de viaje (ejemplo)","Nota ilustrativa: cuerpo estrecho para una bolsa de viaje.", "Comprueba si su capacidad cubre tu preparación habitual."],
      ["Molinillo de cocina (ejemplo)","Nota ilustrativa: depósito más amplio para preparar varias tazas.", "Comprueba el espacio que ocupa en tu encimera."]
    ]
  }
};

function sampleDraft(lang) {
  const t = strings[lang];
  return {...freshDraft(lang), type:"comparison", title:t.exampleTitle, audience:t.audience,
    products:t.sampleProducts.map(([name,facts,tradeoff])=>({...freshProduct(),name,facts,tradeoff})),
  };
}

const escapeHTML = value => String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const cleanLine = value => value.trim().replace(/\s+/g," ");
const mdText = value => cleanLine(value).replace(/[\\[\]*_<>|]/g,"\\$&");
const mdLink = (label,url) => `[${mdText(label)}](${url.replaceAll("(","%28").replaceAll(")","%29")})`;
const productNotes = product => product.facts.split(/\r?\n/).map(cleanLine).filter(Boolean);
function affiliateURLs(draft, includeOriginal=false) {
  const products=[...draft.products];
  if (includeOriginal && draft.signature) {
    try {
      const original=JSON.parse(draft.signature)[4];
      if (Array.isArray(original)) products.push(...original);
    } catch { /* An invalid backup signature adds no links. */ }
  }
  return new Set(products.map(p=>safeUrl(p?.affiliate).replaceAll("(","%28").replaceAll(")","%29")).filter(Boolean));
}

function makeMarkdown(draft) {
  const {lang, type, audience} = draft;
  const t = strings[lang], items = draft.products.filter(p=>p.name.trim());
  const productNames = items.map(p=>p.name.trim());
  const title = mdText(draft.title || `${t.names[formats.indexOf(type)]} — ${productNames.join(" / ")}`);
  const intro = audience.trim() ? mdText(audience) : "";
  const disclosure = affiliateURLs(draft).size ? `**${t.disclosureLabel}:** ${t.disclosure}` : "";
  const compare = ["comparison","roundup"].includes(type);
  const compact = ["email","social"].includes(type);
  const blocks = [`# ${title}`,disclosure,intro];
  if (compare) {
    blocks.push(`## ${t.overview}`, [
      `| ${t.product} | ${t.evidence} | ${t.tradeoff} |`,
      "| --- | --- | --- |",
      ...items.map(p => `| ${mdText(p.name)} | ${mdText(productNotes(p)[0] || t.evidenceMissing)} | ${mdText(p.tradeoff || "—")} |`)
    ].join("\n"));
  }
  for (const product of items) {
    if (!compact || items.length > 1) blocks.push(`## ${mdText(product.name)}`);
    const notes = productNotes(product);
    blocks.push(notes.length ? notes.map(line => "- "+mdText(line)).join("\n") : t.evidenceMissing);
    if (product.tradeoff.trim()) blocks.push(`**${t.tradeoff}:** ${mdText(product.tradeoff)}`);
    const source = safeUrl(product.source);
    if (source) blocks.push(mdLink(t.source,source));
    else if (!compact) blocks.push(t.needSource);
    if (source && /^\d{4}-\d{2}-\d{2}$/.test(product.checked)) blocks.push(`${t.checked}: ${product.checked}`);
    const affiliate = safeUrl(product.affiliate);
    if (affiliate) blocks.push(mdLink(t.affiliate,affiliate));
  }
  if (compare || type === "guide") blocks.push(`## ${t.next}`,t.nextText);
  return blocks.filter(Boolean).join("\n\n")+"\n";
}

function inlineMarkdown(line, sponsored, links) {
  const token = /\\([\\[\]*_<>|])|\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let index = 0;
  let output = "";
  for (const match of line.matchAll(token)) {
    output += escapeHTML(line.slice(index,match.index));
    if (match[1]) output += escapeHTML(match[1]);
    else if (match[4]) output += `<strong>${escapeHTML(match[4])}</strong>`;
    else {
      const url = safeUrl(match[3]);
      const label = escapeHTML(match[2]);
      if (url) {
        links.push({url});
        output += `<a href="${escapeHTML(url)}"${sponsored.has(url)?' rel="sponsored nofollow"':""}>${label}</a>`;
      } else output += label;
    }
    index = match.index + match[0].length;
  }
  return output + escapeHTML(line.slice(index));
}

function splitCells(line) {
  return line.trim().slice(1,-1).split(/(?<!\\)(?:\\\\)*\|/).map(s=>s.trim());
}

function renderMarkdown(markdown, sponsored=new Set(), preview=false) {
  const links = [];
  const result = [];
  const parse = line => inlineMarkdown(line,sponsored,links);
  for (const section of markdown.replace(/\r\n?/g,"\n").split(/\n{2,}/)) {
    if (!section.trim()) continue;
    const lines = section.trim().split(/\r?\n/);
    const title = lines.length===1 ? /^(#{1,3}) (.*)$/.exec(lines[0]) : null;
    if (title) {
      const level = title[1].length + (preview ? 2 : 0);
      result.push(`<h${level}>${parse(title[2])}</h${level}>`);
    } else if (lines.length>1 && lines[0].startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[1])) {
      const headers = splitCells(lines[0]);
      const head = headers.map(h=>`<th scope="col">${parse(h)}</th>`).join("");
      const rows = lines.slice(2).filter(line=>line.startsWith("|")&&line.endsWith("|")).map(line=>{
        const cells=splitCells(line);
        return `<tr>${headers.map((_,i)=>`<td>${parse(cells[i]??"")}</td>`).join("")}</tr>`;
      }).join("");
      const table = `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
      result.push(preview ? `<div class="table-scroll" tabindex="0">${table}</div>` : table);
    } else if (lines.every(line=>line.startsWith("- "))) {
      result.push(`<ul>${lines.map(line=>`<li>${parse(line.slice(2))}</li>`).join("")}</ul>`);
    } else result.push(`<p>${lines.map(parse).join("<br>\n")}</p>`);
  }
  return {html:result.join("\n"), links};
}

const signature = draft => JSON.stringify([draft.type,draft.title,draft.keyword,draft.audience,draft.products]);
const titleFor = draft => draft.title.trim() || draft.products.find(p=>p.name.trim())?.name.trim() || "";
const linkKey = url => safeUrl(url).replaceAll("(","%28").replaceAll(")","%29");

function reviewDraft(draft, markdown) {
  const affiliate = affiliateURLs(draft,true);
  const { links } = renderMarkdown(markdown,affiliate);
  const title = [...markdown.matchAll(/^# (.+)$/gm)];
  const products = draft.products.filter(p=>p.name.trim());
  const query = draft.keyword.trim().toLocaleLowerCase(draft.lang);
  const disclosure = markdown.indexOf(strings[draft.lang].disclosure);
  const linksBeforeDisclosure = disclosure < 0 ? [] : renderMarkdown(markdown.slice(0,disclosure),affiliate).links;
  const sourceDateIsFresh = value => {
    const parsed=new Date(value);
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10)===value && value>=dateLimit && value<=today;
  };
  const checkedDates = products.filter(p=>p.checked);
  const oldestAcceptable = new Date();
  oldestAcceptable.setUTCDate(oldestAcceptable.getUTCDate()-90);
  const dateLimit = oldestAcceptable.toISOString().slice(0,10);
  const today = new Date().toISOString().slice(0,10);
  return {
    title:title.length===1 && title[0][1].trim().length<=90,
    evidence:products.length>0 && products.every(p=>productNotes(p).length && markdown.includes(mdText(productNotes(p)[0]))),
    sources:products.length>0 && products.every(p=>safeUrl(p.source) && links.some(link=>link.url===linkKey(p.source))),
    affiliate:!affiliate.size || (disclosure>=0 && !linksBeforeDisclosure.some(link=>affiliate.has(link.url)) && [...affiliate].every(url=>links.some(l=>l.url===url))),
    query:!query || markdown.toLocaleLowerCase(draft.lang).includes(query),
    dates:products.length>0 && checkedDates.length===products.length && checkedDates.every(p=>sourceDateIsFresh(p.checked))
  };
}

function parseCSV(raw) {
  const input = raw.replace(/^\uFEFF/,"");
  const firstLine = input.split(/\r?\n/,1)[0];
  const delimiter = firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";
  const rows = [];
  let row = [], value = "", quoted = false, closed = false;
  const endValue = () => { row.push(value.trim()); value=""; closed=false; };
  const endRow = () => { endValue(); if (row.some(Boolean)) rows.push(row); row=[]; };
  for (let i=0;i<input.length;i++) {
    const char=input[i];
    if (quoted) {
      if (char==='"' && input[i+1]==='"') {value+='"';i++;}
      else if (char==='"') {quoted=false;closed=true;}
      else value+=char;
    } else if (char===delimiter) endValue();
    else if (char==="\r" || char==="\n") {
      if (char==="\r" && input[i+1]==="\n") i++;
      endRow();
    } else if (char==='"' && !value && !closed) quoted=true;
    else if (char!=='"' && (!closed || /\s/.test(char))) value+=char;
    else throw new Error("csv");
  }
  if (quoted) throw new Error("csv");
  endRow();
  return rows;
}

function draftsFromCSV(raw,lang) {
  const [columns,...rows]=parseCSV(raw);
  if (!columns || !rows.length || rows.length>50) throw new Error("csv");
  const names=columns.map(name=>name.toLowerCase());
  if (names.indexOf("product")===-1 || new Set(names).size!==names.length) throw new Error("csv");
  return rows.map(row=>{
    if (row.length!==names.length) throw new Error("csv");
    const obj=Object.fromEntries(names.map((key,i)=>[key,row[i]]));
    if (!obj.product || (obj.source && !safeUrl(obj.source)) || (obj.affiliate && !safeUrl(obj.affiliate))) throw new Error("csv");
    const type = obj.type || "review";
    if (!["review","guide","email","social"].includes(type)) throw new Error("csv");
    return normalizeDraft({...freshDraft(lang),type,title:obj.title,keyword:obj.keyword,audience:obj.audience,
      products:[{name:obj.product,source:obj.source,facts:obj.notes,tradeoff:obj.tradeoff,affiliate:obj.affiliate,checked:obj.checked}]});
  });
}

export { formats,maxProducts,maxDrafts,freshProduct,freshDraft,normalizeDraft,safeUrl,sampleDraft,escapeHTML,affiliateURLs,makeMarkdown,renderMarkdown,signature,titleFor,reviewDraft,draftsFromCSV };
