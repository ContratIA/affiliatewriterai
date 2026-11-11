import {maxProducts,maxDrafts,freshProduct,freshDraft,normalizeDraft,safeUrl,sampleDraft,affiliateURLs,makeMarkdown,renderMarkdown,signature,titleFor,reviewDraft,draftsFromCSV} from './editor-model.mjs';

const lang = document.documentElement.lang === "es" ? "es" : "en";
const copy = {
  en:{untitled:"Untitled draft",product:"Product",name:"Product name",source:"Source URL",facts:"Evidence or product notes",factsPlaceholder:"Add one fact per line, from your research or testing.",tradeoff:"Trade-offs or limitations",affiliate:"Affiliate link",checked:"Date checked",remove:"Remove",removeDraft:"Delete draft",confirmDelete:"Delete this draft from this browser?",confirmBuild:"Replace the current Markdown with a new draft from your notes?",
      productMissing:"Add a product name before building the draft.",compareMissing:"Add at least two products with different names for this format.",url:"Use a complete http or https link for the source and affiliate link.",built:"Draft prepared.",changed:"Your notes have changed. Build the draft again to include the latest changes.",saved:"Drafts saved in this browser.",storage:"Browser storage is unavailable or full. Export a backup to keep your work.",
      limit:"This browser can hold up to 60 drafts. Back up and remove some before adding more.",csvError:"CSV could not be imported. Use the provided headers, up to 50 rows, and valid links.",backupError:"This file is not a valid AffiliateWriterAI backup.",imported:"Drafts imported",copied:"Copied to the clipboard.",clipboard:"Clipboard access is unavailable. Download the Markdown or HTML.",file:"affiliate-draft",
      checks:["One concise title","Notes included for every product","A source linked for every product","Affiliate links and disclosure in place","Target query included, if specified","Sources dated within 90 days"]},
  es:{untitled:"Borrador sin título",product:"Producto",name:"Nombre del producto",source:"URL de la fuente",facts:"Pruebas o notas de producto",factsPlaceholder:"Añade un dato por línea, a partir de tu investigación o de tus pruebas.",tradeoff:"Limitaciones",affiliate:"Enlace de afiliación",checked:"Fecha de comprobación",remove:"Quitar",removeDraft:"Eliminar borrador",confirmDelete:"¿Eliminar este borrador de este navegador?",confirmBuild:"¿Sustituir el Markdown actual por un borrador a partir de tus notas?",
      productMissing:"Añade el nombre de un producto antes de preparar el borrador.",compareMissing:"Añade al menos dos productos con nombres distintos para este formato.",url:"Usa una URL completa http o https para la fuente y el enlace de afiliación.",built:"Borrador preparado.",changed:"Has cambiado las notas. Prepara el borrador de nuevo para incluir los cambios.",saved:"Borradores guardados en este navegador.",storage:"El almacenamiento del navegador está lleno o desactivado. Descarga una copia para conservar tu trabajo.",
      limit:"Puedes guardar hasta 60 borradores. Descarga una copia y elimina alguno antes de añadir más.",csvError:"El CSV no se ha importado. Usa las cabeceras de la plantilla, hasta 50 filas y enlaces válidos.",backupError:"El archivo no es una copia válida de AffiliateWriterAI.",imported:"Borradores importados",copied:"Copiado al portapapeles.",clipboard:"El portapapeles no está disponible. Descarga el Markdown o el HTML.",file:"borrador-afiliacion",
      checks:["Un título conciso","Notas incluidas para cada producto","Una fuente enlazada por producto","Enlaces y aviso de afiliación en su sitio","Consulta objetivo incluida si se indicó","Fuentes comprobadas en los últimos 90 días"]}
}[lang];

const by = id => document.getElementById(id);
const storageKey = "affiliatewriter.editor.v1";
const draftForm = by("draft-form");
const draftList = by("drafts");
const status = by("editor-status");
const fields = by("product-fields");
const markdown = by("markdown");
const preview = by("article-preview");
const result = by("result");
const keys = ["type","title","keyword","audience"];
let drafts = [];
let activeId = null;
let persisted = true;

function tell(message,error=false) {
  status.textContent=message;
  status.dataset.error=String(error);
}
function current() { return drafts.find(d=>d.id===activeId); }

function restoreLocal() {
  try {
    const item=JSON.parse(localStorage.getItem(storageKey)||"null");
    if (Array.isArray(item?.drafts)) {
      drafts=item.drafts.slice(0,maxDrafts).map(normalizeDraft).filter(Boolean);
      activeId=drafts.some(d=>d.id===item.activeId)?item.activeId:drafts[0]?.id;
    }
  } catch { persisted=false; }
}
function save() {
  try {
    localStorage.setItem(storageKey,JSON.stringify({drafts,activeId}));
    persisted=true;
  } catch { persisted=false; }
}
function list() {
  draftList.replaceChildren(...drafts.map(d=>new Option(titleFor(d) || copy.untitled,d.id,false,d.id===activeId)));
}
function field(label,key,value,{type="text",limit=180,placeholder=""}={}) {
  const control=document.createElement("label");
  control.textContent=label;
  const input=document.createElement(type==="textarea"?"textarea":"input");
  if (type==="textarea") input.rows=3;
  else input.type=type;
  input.dataset.field=key;
  input.maxLength=limit;
  if (placeholder) input.placeholder=placeholder;
  input.value=value;
  control.append(input);
  return control;
}

function showProducts(draft) {
  fields.replaceChildren(...draft.products.map((p,index)=>{
    const group=document.createElement("fieldset");
    group.className="product-fields";
    group.dataset.index=index;
    const legend=document.createElement("legend");
    legend.textContent=copy.product+" "+(index+1);
    const remove=document.createElement("button");
    remove.className="plain-button remove";
    remove.type="button";
    remove.textContent=copy.remove;
    remove.setAttribute("aria-label",copy.remove+" "+copy.product.toLocaleLowerCase(lang)+" "+(index+1));
    remove.dataset.removeProduct="";
    remove.disabled=draft.products.length===1;
    group.append(legend,remove,
      field(copy.name,"name",p.name),
      field(copy.source,"source",p.source,{type:"url",limit:2048,placeholder:"https://…"}),
      field(copy.facts,"facts",p.facts,{type:"textarea",limit:2200,placeholder:copy.factsPlaceholder}),
      field(copy.tradeoff,"tradeoff",p.tradeoff,{type:"textarea",limit:800}),
      field(copy.affiliate,"affiliate",p.affiliate,{type:"url",limit:2048,placeholder:"https://…"}),
      field(copy.checked,"checked",p.checked,{type:"date",limit:10})
    );
    return group;
  }));
  by("add-product").disabled=draft.products.length>=maxProducts;
}
function showPreview(draft, updateField=true) {
  const hasMarkdown=Boolean(draft.markdown.trim());
  if (updateField) markdown.value=draft.markdown;
  result.hidden=!hasMarkdown;
  by("preview-empty").hidden=hasMarkdown;
  if (!hasMarkdown) {
    preview.replaceChildren();
    return;
  }
  preview.innerHTML=renderMarkdown(draft.markdown,affiliateURLs(draft,true),true).html;
  const flags=Object.values(reviewDraft(draft,draft.markdown));
  const labels=copy.checks.map((label,index)=>{
    const item=document.createElement("li"), icon=document.createElement("span");
    item.dataset.pass=String(Boolean(flags[index]));
    icon.textContent=flags[index]?"✓":"○";
    icon.setAttribute("aria-hidden","true");
    const detail=document.createElement("span");
    const labelStatus=lang==="es"?(flags[index]?"Comprobado":"Pendiente"):(flags[index]?"Checked":"To review");
    detail.textContent=label+" · "+labelStatus;
    item.append(icon,detail);
    return item;
  });
  by("checks").replaceChildren(...labels);
}

function show() {
  const draft=current();
  list();
  keys.forEach(key=>{draftForm.elements[key].value=draft[key];});
  showProducts(draft);
  showPreview(draft);
  notifySaved();
}
function notifySaved() {
  if (!persisted) tell(copy.storage,true);
  else if (current().markdown && current().signature!==signature(current())) tell(copy.changed);
  else tell("");
}
function select(id) {
  activeId=id;
  save();
  show();
}
function add(newDrafts) {
  if (drafts.length+newDrafts.length>maxDrafts) {
    tell(copy.limit,true);
    return false;
  }
  drafts.push(...newDrafts);
  select(newDrafts[0].id);
  return true;
}
function loadExample() {
  const example=sampleDraft(lang);
  example.markdown=makeMarkdown(example);
  example.signature=signature(example);
  if (add([example])) by("preview-title").focus();
}

function build(event) {
  event.preventDefault();
  const draft=current();
  const named=draft.products.filter(p=>p.name.trim());
  if (!named.length) {tell(copy.productMissing,true);fields.querySelector("[data-field=name]")?.focus();return;}
  if (["comparison","roundup"].includes(draft.type) && new Set(named.map(p=>p.name.trim().toLocaleLowerCase(lang))).size<2) {
    tell(copy.compareMissing,true);by("add-product").focus();return;
  }
  for (const input of fields.querySelectorAll("input[type=url]")) {
    if (input.value.trim() && !safeUrl(input.value.trim())) {tell(copy.url,true);input.focus();return;}
  }
  const previous = makeMarkdown(draft);
  if (draft.markdown.trim() && draft.markdown !== previous && !window.confirm(copy.confirmBuild)) return;
  draft.markdown=previous;
  draft.signature=signature(draft);
  save();
  showPreview(draft);
  tell(persisted?copy.built:copy.storage,!persisted);
  by("preview-title").focus();
}
function fileName(draft) {
  return (titleFor(draft).normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70) || copy.file);
}
function download(content,type,name) {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const link=document.createElement("a");
  link.href=url;
  link.download=name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function renderCurrent() {
  const draft=current();
  return renderMarkdown(draft.markdown,affiliateURLs(draft,true)).html;
}
async function copyArticle() {
  const draft=current();
  try {
    if (navigator.clipboard?.write && typeof ClipboardItem==="function") {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html":new Blob([renderCurrent()],{type:"text/html"}),
        "text/plain":new Blob([draft.markdown],{type:"text/plain"})
      })]);
    } else await navigator.clipboard.writeText(draft.markdown);
    tell(copy.copied);
  } catch {
    try {await navigator.clipboard.writeText(draft.markdown);tell(copy.copied);}
    catch {tell(copy.clipboard,true);}
  }
}
async function importFile(input, format) {
  const file=input.files[0];
  input.value="";
  if (!file) return;
  try {
    const csv=format==="csv";
    if (file.size>(csv?256000:6000000)) throw new Error(format);
    const raw=await file.text();
    let items;
    if (csv) items=draftsFromCSV(raw,lang);
    else {
      const backup=JSON.parse(raw);
      if (backup?.version!==1 || !Array.isArray(backup.drafts) || !backup.drafts.length || backup.drafts.length>maxDrafts) throw new Error(format);
      items=backup.drafts.map(normalizeDraft);
      if (items.some(d=>!d)) throw new Error(format);
      items.forEach(d=>{d.id=crypto.randomUUID();});
    }
    if (add(items)) tell(persisted?`${copy.imported} · ${items.length}`:copy.storage,!persisted);
  } catch {tell(format==="csv"?copy.csvError:copy.backupError,true);}
}

restoreLocal();
if (!drafts.length) {
  const empty=freshDraft(lang);
  drafts.push(empty);
  activeId=empty.id;
}
show();

draftList.addEventListener("change",()=>select(draftList.value));
by("new-draft").addEventListener("click",()=>{if(add([freshDraft(lang)])) draftForm.elements.title.focus();});
by("sample").addEventListener("click",loadExample);
const deleteButton=document.createElement("button");
deleteButton.type="button";
deleteButton.className="plain-button";
deleteButton.textContent=copy.removeDraft;
by("backup").before(deleteButton);
deleteButton.addEventListener("click",()=>{
  if (!window.confirm(copy.confirmDelete)) return;
  drafts=drafts.filter(d=>d.id!==activeId);
  if (!drafts.length) drafts=[freshDraft(lang)];
  select(drafts[0].id);
});
by("csv").addEventListener("change",event=>importFile(event.target,"csv"));
by("restore").addEventListener("change",event=>importFile(event.target,"json"));
by("csv-template").addEventListener("click",()=>download(
  "\uFEFFproduct,type,title,keyword,audience,notes,tradeoff,source,affiliate,checked\nSample product,review,,,,\"Illustrative note, replace with your evidence\",,,,",
  "text/csv;charset=utf-8","affiliatewriter-template.csv"
));
by("backup").addEventListener("click",()=>download(JSON.stringify({version:1,drafts},null,2),"application/json","affiliatewriter-drafts.json"));
by("add-product").addEventListener("click",()=>{
  const draft=current();
  if (draft.products.length>=maxProducts) return;
  draft.products.push(freshProduct());
  save();showProducts(draft);notifySaved();
  fields.lastElementChild.querySelector("[data-field=name]").focus();
});
fields.addEventListener("click",event=>{
  const remove=event.target.closest("[data-remove-product]");
  if (!remove) return;
  const draft=current();
  if (draft.products.length<=1) return;
  draft.products.splice(Number(remove.closest("fieldset").dataset.index),1);
  save();showProducts(draft);notifySaved();by("add-product").focus();
});
draftForm.addEventListener("input",event=>{
  const input=event.target, draft=current();
  if (keys.includes(input.name)) draft[input.name]=input.value;
  else if (input.dataset.field) draft.products[Number(input.closest("fieldset").dataset.index)][input.dataset.field]=input.value;
  save();list();showPreview(draft,false);notifySaved();
});
draftForm.addEventListener("submit",build);
markdown.addEventListener("input",()=>{
  const draft=current();
  draft.markdown=markdown.value;
  save();
  showPreview(draft,false);
  if (!draft.markdown.trim()) by("preview-title").focus();
  notifySaved();
});
by("copy").addEventListener("click",copyArticle);
by("download-md").addEventListener("click",()=>{
  const draft=current();
  download(draft.markdown,"text/markdown;charset=utf-8",fileName(draft)+".md");
});
by("download-html").addEventListener("click",()=>download(renderCurrent(),"text/html;charset=utf-8",fileName(current())+".html"));
if (new URLSearchParams(location.search).get("sample")==="1") {
  const url=new URL(location.href);
  url.searchParams.delete("sample");
  history.replaceState(null,"",url);
  loadExample();
}
