import guides from './guides.mjs';

const english = {
  nav: ["Tools", "Calculator", "Guides"], open:"Open the editor", home:"Home", edit:"Editor", guides:"Guides", calc:"Commission calculator", privacy:"Privacy", contact:"Contact",
  note:"Editorial tools for affiliate publishers.", language:"Español", skip:"Skip to content", menu:"Menu", breadcrumb:"Breadcrumb"
};
const spanish = {
  nav: ["Herramientas", "Calculadora", "Guías"], open:"Abrir el editor", home:"Inicio", edit:"Editor", guides:"Guías", calc:"Calculadora de comisiones", privacy:"Privacidad", contact:"Contacto",
  note:"Herramientas editoriales para afiliados.", language:"English", skip:"Saltar al contenido", menu:"Menú", breadcrumb:"Ruta de navegación"
};
const paths = {
  en: {home:"/",editor:"/editor/",calc:"/calculator/",guides:"/blog/",privacy:"/privacy/",contact:"/contact/",missing:"/404.html"},
  es: {home:"/es/",editor:"/es/editor/",calc:"/es/calculadora/",guides:"/es/guias/",privacy:"/es/privacidad/",contact:"/es/contacto/"}
};
const host = "https://www.affiliatewriterai.com";
const brand = "AffiliateWriterAI";
const origin = path => host + path;

function e(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
}

function nav(lang, path, alternate) {
  const t = lang === "es" ? spanish : english;
  const p = paths[lang];
  const other = lang === "es" ? "en" : "es";
  const links = [[p.home+"#features",t.nav[0]],[p.calc,t.nav[1]],[p.guides,t.nav[2]]];
  return `<header class="masthead"><div class="frame masthead-inner">
    <a class="wordmark" href="${p.home}" aria-label="${brand}"><span class="wordmark-icon" aria-hidden="true">a<span>.</span></span><span>AffiliateWriter<span class="wordmark-period">.</span></span></a>
    <nav class="primary-nav" aria-label="${lang==="es"?"Navegación principal":"Main navigation"}">${links.map(([url,label])=>`<a href="${url}"${path===url?' aria-current="page"':""}>${label}</a>`).join("")}</nav>
    <div class="masthead-actions"><a class="locale" href="${alternate??paths[other].home}" hreflang="${other}" lang="${other}">${t.language}</a><a href="${p.editor}" class="button button-small">${t.open} <span aria-hidden="true">→</span></a></div>
    <details class="mobile-nav"><summary>${t.menu}</summary><nav aria-label="${lang==="es"?"Menú móvil":"Mobile navigation"}">${links.map(([url,label])=>`<a href="${url}">${label}</a>`).join("")}<a href="${p.editor}">${t.open}</a><a href="${alternate??paths[other].home}" hreflang="${other}" lang="${other}">${t.language}</a></nav></details>
  </div></header>`;
}

function footer(lang) {
  const t = lang === "es" ? spanish : english;
  const p = paths[lang];
  return `<footer class="footer"><div class="frame footer-inner"><div><a class="footer-brand" href="${p.home}">${brand}</a><p>${t.note}</p></div>
    <nav aria-label="${lang==="es"?"Enlaces de pie de página":"Footer links"}"><a href="${p.editor}">${t.edit}</a><a href="${p.guides}">${t.guides}</a><a href="${p.privacy}">${t.privacy}</a><a href="${p.contact}">${t.contact}</a></nav></div></footer>`;
}

function render(page, preview) {
  const {lang, path, alternate, title, desc, body, script, structured, home, noindex} = page;
  const t = lang === "es" ? spanish : english;
  const robots = preview || noindex ? "noindex, follow" : "index, follow, max-image-preview:large";
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="${e(desc)}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#f7f4eb">
  ${noindex ? "" : `<link rel="canonical" href="${origin(path)}">`}
  ${alternate ? `<link rel="alternate" hreflang="${lang}" href="${origin(path)}">
  <link rel="alternate" hreflang="${lang==="en"?"es":"en"}" href="${origin(alternate)}">
  <link rel="alternate" hreflang="x-default" href="${origin(lang==="en"?path:alternate)}">` : ""}
  <meta property="og:type" content="${structured?.["@type"]==="Article"?"article":"website"}">
  <meta property="og:site_name" content="${brand}">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(desc)}">
  <meta property="og:url" content="${origin(path)}">
  <meta property="og:image" content="${origin("/og-image.jpg")}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(title)}">
  <meta name="twitter:description" content="${e(desc)}">
  <meta name="twitter:image" content="${origin("/og-image.jpg")}">
  <link rel="icon" href="/assets/favicon.png" type="image/png">
  <link rel="preload" href="/assets/fonts/instrument.woff2" as="font" type="font/woff2" crossorigin>
  ${home?'<link rel="preload" href="/assets/desk.webp" as="image">':""}
  <link rel="stylesheet" href="/assets/styles.css">
  ${structured?`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org",...structured}).replace(/</g,"\\u003c")}</script>`:""}
  ${script?`<script type="module" src="/assets/${script}.mjs"></script>`:""}
</head>
<body>
  <a class="skip" href="#main">${t.skip}</a>
  ${nav(lang,path,alternate)}
  <main id="main">${body}</main>
  ${footer(lang)}
</body>
</html>
`;
}

const homeContent = {
  en:{
    label:"For independent publishers",title:"Good reviews start with",em:"good notes.",desc:"Turn product research into affiliate reviews, comparisons and buying guides. Keep the sources in view from the first note to the WordPress draft.",
    primary:"Start a draft",secondary:"Explore an example", image:"An open notebook, pencil and reference notes on a walnut desk",
    caption:"Research notes", caption2:"Before the first draft", tool:"The publishing toolkit",
    tools:[
      ["Draft editor","Organize product notes, sources and affiliate links in one place. Build a review or comparison you can edit and export.","Open editor"],
      ["Commission calculator","Work out what a topic could earn from your visits, click rate and merchant data. Adjust the assumptions and compare three scenarios.","Run the numbers"],
      ["Publishing guides","Check a review before it goes live. Find practical guidance on evidence, disclosures, affiliate links and choosing what to cover.","Browse guides"]
    ],
    workflow:"The review process", demoTitle:"Give readers something they can verify.",
    demoIntro:"Start with two products and the facts that matter. The editor turns your notes into a side-by-side comparison, keeps source links attached and flags what needs another look.",
    demoLink:"Open the sample comparison", example:"From a sample draft", exampleTitle:"Choosing a manual coffee grinder", exA:"Compact for travel",exB:"More room for beans",exLabel:"What to compare",exFact:"Capacity and storage",exSources:"Sources and trade-offs",
    freeTitle:"Start with your next article.",freeDesc:"The editor, calculator and guides are free to use. Your drafts are saved in this browser and can be downloaded whenever you need them.",
    faqTitle:"Before you start",faq:[
      ["Where are my drafts saved?","Drafts stay in this browser. Download the Markdown, HTML or a backup before changing devices or clearing browser data."],
      ["Can I use the draft in WordPress?","Yes. Copy the formatted article, or download the HTML and paste it in a Custom HTML block. Review it in WordPress before publishing."],
      ["Where do the product data and forecasts come from?","You supply the product evidence and financial assumptions. The editor organizes your notes and the calculator shows how its estimates are derived."]
    ]
  },
  es:{
    label:"Para editores independientes",title:"Una buena reseña empieza con",em:"buenas notas.",desc:"Convierte tu investigación en reseñas, comparativas y guías de compra. Ten las fuentes a mano desde la primera nota hasta el borrador de WordPress.",
    primary:"Empezar un borrador",secondary:"Ver un ejemplo",image:"Un cuaderno abierto, un lápiz y notas de referencia sobre una mesa de nogal",
    caption:"Notas de investigación",caption2:"Antes del primer borrador",tool:"Herramientas de publicación",
    tools:[
      ["Editor de borradores","Reúne notas de producto, fuentes y enlaces de afiliación. Prepara una reseña o comparativa que puedas editar y exportar.","Abrir el editor"],
      ["Calculadora de comisiones","Estima los ingresos de un tema con tus visitas, porcentaje de clics y datos del comercio. Compara tres escenarios.","Calcular comisiones"],
      ["Guías de publicación","Revisa tu artículo antes de publicarlo. Consulta cómo aportar pruebas, avisar de la afiliación y elegir qué tema cubrir.","Ver las guías"]
    ],
    workflow:"El proceso de revisión",demoTitle:"Da a tus lectores datos que puedan comprobar.",
    demoIntro:"Empieza por dos productos y los datos que importan. El editor convierte tus notas en una comparativa, conserva las fuentes y señala los puntos que debes revisar.",
    demoLink:"Abrir la comparativa de ejemplo",example:"Extracto de un borrador de ejemplo",exampleTitle:"Cómo elegir un molinillo manual de café",exA:"Compacto para viajes",exB:"Más capacidad",exLabel:"Qué comparar",exFact:"Capacidad y espacio",exSources:"Fuentes y limitaciones",
    freeTitle:"Empieza tu próximo artículo.",freeDesc:"Puedes usar el editor, la calculadora y las guías gratis. Los borradores se guardan en este navegador y puedes descargarlos cuando quieras.",
    faqTitle:"Antes de empezar",faq:[
      ["¿Dónde se guardan los borradores?","Los borradores se quedan en este navegador. Descarga el Markdown, el HTML o una copia de seguridad antes de cambiar de dispositivo o borrar los datos del navegador."],
      ["¿Puedo usar el borrador en WordPress?","Sí. Copia el artículo con formato o descarga el HTML y pégalo en un bloque HTML personalizado. Revísalo en WordPress antes de publicar."],
      ["¿De dónde salen los datos de producto y las estimaciones?","Tú aportas las pruebas de producto y los supuestos económicos. El editor ordena tus notas y la calculadora muestra cómo obtiene cada estimación."]
    ]
  }
};

function home(lang) {
  const x=homeContent[lang], p=paths[lang];
  return `<section class="frame hero" id="generator">
    <div class="hero-copy"><p class="eyebrow"><span></span>${x.label}</p>
      <h1>${x.title} <em>${x.em}</em></h1><p class="hero-intro">${x.desc}</p>
      <div class="actions"><a class="button" href="${p.editor}">${x.primary} <span aria-hidden="true">→</span></a><a class="text-link" href="${p.editor}?sample=1">${x.secondary} <span aria-hidden="true">→</span></a></div>
    </div>
    <figure class="hero-photo"><img src="/assets/desk.webp" alt="${x.image}" width="1040" height="740" fetchpriority="high">
      <figcaption><span>${x.caption}</span><span>${x.caption2}</span></figcaption>
    </figure>
  </section>
  <section class="frame tools-section" id="features"><h2>${x.tool}</h2><div class="tools-grid">
  ${x.tools.map(([title,desc,link],index)=>`<article class="tool"><span class="tool-mark mark-${index}" aria-hidden="true">${["✎","∑","≡"][index]}</span><h3>${title}</h3><p>${desc}</p><a class="text-link" href="${[p.editor,p.calc,p.guides][index]}">${link} <span aria-hidden="true">→</span></a></article>`).join("")}
  </div></section>
  <section class="workflow" id="comparison"><div class="frame workflow-inner"><div><p class="eyebrow"><span></span>${x.workflow}</p><h2>${x.demoTitle}</h2><p>${x.demoIntro}</p><a class="text-link" href="${p.editor}?sample=1">${x.demoLink} <span aria-hidden="true">→</span></a></div>
    <div class="sample-paper"><p class="paper-label">${x.example}</p><h3>${x.exampleTitle}</h3><div class="sample-row"><strong>${x.exLabel}</strong><span>${x.exFact}</span></div><div class="sample-row"><strong>${x.exA}</strong><span>${x.exB}</span></div><div class="sample-row sample-end">${x.exSources}</div></div>
  </div></section>
  <section class="frame faq" id="faq"><h2>${x.faqTitle}</h2><div>${x.faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
  <section class="frame final-section" id="pricing"><div><h2>${x.freeTitle}</h2><p>${x.freeDesc}</p></div><a class="button" href="${p.editor}">${x.primary} <span aria-hidden="true">→</span></a></section>
  <span id="affiliate-program"></span>`;
}

const editorContent = {
  en:{ title:"Affiliate draft editor", desc:"Prepare product reviews and comparisons from your research. Save drafts in your browser and export to Markdown or WordPress HTML.",
    label:"Writing desk", drafts:"Your drafts", newDraft:"New draft", import:"Import CSV", csv:"CSV template", backup:"Back up drafts", restore:"Restore backup",
    brief:"Article brief", format:"Format", titleLabel:"Working title", titlePlaceholder:"Optional", query:"Target search query", queryPlaceholder:"e.g. best compact coffee grinder",
    audience:"Reader and buying decision", audiencePlaceholder:"e.g. A beginner choosing a grinder for a small kitchen",
    formats:[["review","Product review"],["comparison","Comparison"],["guide","Buying guide"],["roundup","Product roundup"],["email","Affiliate email"],["social","Social post"]],
    products:"Products and sources", add:"Add product", create:"Build draft", sample:"Load example",preview:"Draft preview",
    previewEmpty:"Build a draft from your brief and product notes. The preview and export will appear here.",edit:"Edit Markdown", draftLabel:"Markdown draft", copy:"Copy formatted article", download:"Markdown",html:"WordPress HTML",
    help:"Paste the downloaded HTML into a Custom HTML block in WordPress, or paste the formatted article in your editor.",
    checks:"Before you publish", local:"Drafts are stored in this browser. Back up your work before clearing browser data."
  },
  es:{ title:"Editor de borradores de afiliación", desc:"Prepara reseñas y comparativas a partir de tu investigación. Guarda tus borradores en el navegador y expórtalos a Markdown o WordPress.",
    label:"Mesa de trabajo",drafts:"Tus borradores",newDraft:"Nuevo borrador",import:"Importar CSV",csv:"Plantilla CSV",backup:"Guardar copia",restore:"Restaurar copia",
    brief:"Ficha del artículo",format:"Formato",titleLabel:"Título provisional",titlePlaceholder:"Opcional",query:"Consulta objetivo",queryPlaceholder:"p. ej. mejor molinillo compacto",
    audience:"Lector y decisión de compra",audiencePlaceholder:"p. ej. Una persona que empieza y tiene una cocina pequeña",
    formats:[["review","Reseña"],["comparison","Comparativa"],["guide","Guía de compra"],["roundup","Selección de productos"],["email","Correo de afiliación"],["social","Publicación en redes"]],
    products:"Productos y fuentes",add:"Añadir producto",create:"Preparar borrador",sample:"Cargar ejemplo",preview:"Vista del borrador",
    previewEmpty:"Prepara un borrador con la ficha y las notas de producto. Aquí podrás verlo y exportarlo.",edit:"Editar Markdown",draftLabel:"Borrador en Markdown",copy:"Copiar con formato",download:"Markdown",html:"HTML para WordPress",
    help:"Pega el HTML descargado en un bloque HTML personalizado de WordPress o copia el artículo con formato en tu editor.",
    checks:"Antes de publicar",local:"Los borradores se guardan en este navegador. Descarga una copia antes de borrar sus datos."
  }
};

function editor(lang) {
  const x=editorContent[lang];
  return `<div class="frame page-heading"><p class="eyebrow"><span></span>${x.label}</p><h1>${x.title}</h1><p>${x.desc}</p></div>
  <div class="frame workspace">
    <div class="draft-toolbar"><label>${x.drafts}<select id="drafts"></select></label>
      <div class="toolbar-actions">
        <button class="button button-quiet button-small" id="new-draft" type="button">${x.newDraft}</button>
        <button class="button button-quiet button-small" id="sample" type="button">${x.sample}</button>
        <label class="file-action">${x.import}<input type="file" id="csv" accept=".csv,text/csv"></label>
        <button class="plain-button" id="csv-template" type="button">${x.csv}</button>
      </div>
    </div>
    <p id="editor-status" class="status" role="status"></p>
    <div class="workspace-grid">
      <form id="draft-form" class="workspace-panel" novalidate>
        <h2>${x.brief}</h2>
        <label>${x.format}<select name="type">${x.formats.map(([key,val])=>`<option value="${key}">${val}</option>`).join("")}</select></label>
        <label>${x.titleLabel}<input name="title" placeholder="${x.titlePlaceholder}" maxlength="150"></label>
        <label>${x.query}<input name="keyword" placeholder="${x.queryPlaceholder}" maxlength="160"></label>
        <label>${x.audience}<textarea name="audience" rows="2" maxlength="800" placeholder="${x.audiencePlaceholder}"></textarea></label>
        <div class="section-line"><h2>${x.products}</h2><button type="button" class="plain-button" id="add-product">${x.add}</button></div>
        <div id="product-fields"></div>
        <button class="button" type="submit">${x.create} <span aria-hidden="true">→</span></button>
      </form>
      <section class="workspace-panel preview-panel" aria-labelledby="preview-title">
        <h2 id="preview-title" tabindex="-1">${x.preview}</h2>
        <p id="preview-empty" class="preview-empty">${x.previewEmpty}</p>
        <div id="result" hidden>
          <div id="article-preview" class="draft-preview"></div>
          <details class="markdown-details"><summary>${x.edit}</summary><label>${x.draftLabel}<textarea id="markdown" rows="12" maxlength="64000"></textarea></label></details>
          <div class="export-actions"><button class="button button-small" id="copy" type="button">${x.copy}</button><button class="button button-quiet button-small" id="download-md" type="button">${x.download}</button><button class="button button-quiet button-small" id="download-html" type="button">${x.html}</button></div>
          <p class="small-copy">${x.help}</p>
          <section class="review-checks"><h3>${x.checks}</h3><ul id="checks"></ul></section>
        </div>
      </section>
    </div>
    <div class="backup-line"><p>${x.local}</p><div><button type="button" class="plain-button" id="backup">${x.backup}</button><label class="file-action">${x.restore}<input type="file" id="restore" accept=".json,application/json"></label></div></div>
  </div>`;
}

const calcContent = {
  en:{title:"Affiliate commission calculator",desc:"Estimate monthly affiliate commissions using your own traffic, click rate, conversion rate and order value.",label:"Planning tool",inputs:"Your assumptions",
    fields:["Monthly article visits","Visitors who click to the merchant (%)","Merchant conversion rate (%)","Average order value","Commission rate (%)"],currency:"Currency",
    calc:"Calculate",result:"Estimated commission per month",scenarios:"Traffic scenarios", range:"The lower and higher scenarios vary only monthly visits by 25%.", sample:"The starting numbers are an example. Replace them with your own data.",
    table:["Scenario","Visits","Merchant clicks","Orders","Commission"],scenario:["Lower traffic","Base case","Higher traffic"],
    methodology:"How the calculation works", formula:"Monthly visits × click rate × merchant conversion rate × average order value × commission rate.",caveat:"This estimates gross commission before costs, refunds or programme adjustments.",invalid:"Enter valid figures in every field. Percentages must be between 0 and 100."
  },
  es:{title:"Calculadora de comisiones de afiliación",desc:"Estima la comisión mensual con tus visitas, porcentajes de clic y conversión e importe medio de pedido.",label:"Planificación",inputs:"Tus supuestos",
    fields:["Visitas mensuales al artículo","Visitantes que hacen clic al comercio (%)","Conversión del comercio (%)","Importe medio del pedido","Tasa de comisión (%)"],currency:"Moneda",
    calc:"Calcular",result:"Comisión mensual estimada",scenarios:"Escenarios de tráfico",range:"Los escenarios inferior y superior varían solo las visitas mensuales en un 25 %.",sample:"Los valores iniciales son un ejemplo. Sustitúyelos por tus datos.",
    table:["Escenario","Visitas","Clics al comercio","Pedidos","Comisión"],scenario:["Menos tráfico","Escenario base","Más tráfico"],
    methodology:"Cómo se calcula",formula:"Visitas mensuales × porcentaje de clics × conversión del comercio × importe medio del pedido × tasa de comisión.",caveat:"El resultado estima la comisión bruta antes de costes, devoluciones y ajustes del programa.",invalid:"Completa todos los campos con cifras válidas. Los porcentajes deben estar entre 0 y 100."
  }
};

function calculator(lang) {
  const x=calcContent[lang];
  const numbers=[["visits",3000,1,1000000000],["clickRate",25,.01,100],["conversion",4,.01,100],["order",80,.01,1000000],["commission",2.5,.01,100]];
  return `<div class="frame page-heading"><p class="eyebrow"><span></span>${x.label}</p><h1>${x.title}</h1><p>${x.desc}</p></div>
  <div class="frame calculator-layout">
    <form class="workspace-panel" id="calculator" data-invalid="${x.invalid}">
      <h2>${x.inputs}</h2><p class="small-copy">${x.sample}</p>
      <label>${x.currency}<select name="currency"><option value="USD">USD</option><option value="EUR"${lang==="es"?" selected":""}>EUR</option><option value="GBP">GBP</option></select></label>
      ${numbers.map(([key,value,step,max],i)=>`<label>${x.fields[i]}<input name="${key}" type="number" min="0" max="${max}" step="${step}" inputmode="${step===1?"numeric":"decimal"}" value="${value}" required></label>`).join("")}
      <button class="button" type="submit">${x.calc} <span aria-hidden="true">→</span></button>
    </form>
    <div class="calculator-result"><section class="result-tile"><h2>${x.result}</h2><output id="estimate" form="calculator" aria-label="${x.result}" aria-live="polite">—</output><p>${x.caveat}</p></section>
      <section class="scenarios"><h2>${x.scenarios}</h2><p>${x.range}</p><div class="table-scroll" tabindex="0"><table class="scenarios-table"><thead><tr>${x.table.map(t=>`<th scope="col">${t}</th>`).join("")}</tr></thead><tbody>${x.scenario.map((t,i)=>`<tr data-scenario="${i}"><th scope="row">${t}</th><td>—</td><td>—</td><td>—</td><td>—</td></tr>`).join("")}</tbody></table></div></section>
      <section class="method"><h2>${x.methodology}</h2><p>${x.formula}</p></section>
      <p class="status" id="calculator-status" role="status"></p>
    </div>
  </div>`;
}

function guidePath(lang,g) {
  return paths[lang].guides+g.path+".html";
}

function guideIndex(lang) {
  const es=lang==="es", p=paths[lang], items=guides.map(g=>es?g.es:g);
  return `<div class="frame page-heading"><h1>${es?"Guías de afiliación":"Affiliate publishing guides"}</h1>
    <p>${es?"Recursos para investigar un tema, redactar con fuentes y revisar antes de publicar.":"Practical guides for researching topics, writing with sources and checking drafts before publication."}</p></div>
    <div class="frame guide-list">${items.map(g=>`<article><p class="paper-label">${g.category}</p><div><h2><a href="${guidePath(lang,g)}">${e(g.title)}</a></h2><p>${e(g.intro)}</p></div><span class="text-link" aria-hidden="true">→</span></article>`).join("")}</div>`;
}

function guideArticle(lang,g,index) {
  const es=lang==="es", p=paths[lang], t=es?spanish:english;
  const related=guides.filter((_,i)=>i!==index).slice(0,2).map(x=>es?x.es:x);
  return `<article class="frame reading">
    <nav class="crumb" aria-label="${t.breadcrumb}"><a href="${p.guides}">${t.guides}</a><span aria-hidden="true">/</span><span>${g.category}</span></nav>
    <header><h1>${e(g.title)}</h1><p class="article-lead">${e(g.intro)}</p><p class="article-date">${es?"Actualizado el 11 de noviembre de 2026":"Updated November 11, 2026"}</p></header>
    ${g.sections.map(([h,para])=>`<section><h2>${e(h)}</h2><p>${e(para)}</p></section>`).join("")}
    <section class="references"><h2>${es?"Fuentes":"Sources"}</h2><ul>${g.references.map(([label,url])=>`<li><a href="${e(url)}">${e(label)}</a></li>`).join("")}</ul></section>
    <section class="reading-next"><h2>${es?"Sigue leyendo":"Read next"}</h2><ul>${related.map(r=>`<li><a href="${guidePath(lang,r)}">${e(r.title)}</a></li>`).join("")}</ul><a class="button" href="${p.editor}">${t.open} <span aria-hidden="true">→</span></a></section>
  </article>`;
}

function staticPage(lang,key) {
  const es=lang==="es", p=paths[lang];
  const copy = key==="privacy"
    ? es?["Privacidad","El editor y la calculadora funcionan en tu navegador. El editor guarda los borradores en el almacenamiento local de este sitio.","Los archivos CSV y las copias de seguridad se leen en tu dispositivo. Las exportaciones se guardan donde elijas. Puedes quitar los borradores borrando los datos de este sitio desde los ajustes del navegador.","Si abres una fuente, un enlace de afiliación o un enlace a otro sitio, se aplican las condiciones de ese sitio. Si nos escribes, usaremos los datos que incluyas para responder a tu consulta."]
        : ["Privacy","The editor and calculator run in your browser. The editor saves drafts using this site's local browser storage.","CSV files and backups are read on your device. Exports are saved where you choose. You can remove local drafts by clearing this site's data in your browser settings.","When you follow a source, affiliate or other external link, the destination site's policies apply. If you email us, we use the information you send to respond to your enquiry."]
    : es?["Contacto","Escríbenos si tienes una duda sobre las herramientas, detectas un error o quieres hablar de una colaboración."]
        : ["Contact","Email us with a question about the tools, a bug report or a partnership enquiry."];
  return {title:copy[0],desc:copy[1],body:`<article class="frame reading plain-page"><h1>${copy[0]}</h1>${copy.slice(1).map(t=>`<p>${t}</p>`).join("")}<p><a href="mailto:hello@affiliatewriterai.com">hello@affiliatewriterai.com</a></p><a class="text-link" href="${p.home}">${es?"Volver al inicio":"Return home"} →</a></article>`};
}

function websitePages() {
  const all = [];
  for(const lang of ["en","es"]) {
    const es=lang==="es", other=es?"en":"es", p=paths[lang], a=paths[other];
    const page = (key,title,desc,body,extra={}) => ({lang,path:p[key],alternate:a[key],title:title+" | "+brand,desc,body,...extra});
    all.push(
      page("home",es?"Reseñas y comparativas de afiliación":"Affiliate reviews and comparison tools",homeContent[lang].desc,home(lang),{home:true,structured:{"@type":"WebSite",name:brand,url:origin(p.home),inLanguage:lang}}),
      page("editor",editorContent[lang].title,editorContent[lang].desc,editor(lang),{script:"editor",structured:{"@type":"WebApplication",name:editorContent[lang].title,applicationCategory:"BusinessApplication",operatingSystem:"Web",url:origin(p.editor),offers:{"@type":"Offer",price:0,priceCurrency:es?"EUR":"USD"},inLanguage:lang}}),
      page("calc",calcContent[lang].title,calcContent[lang].desc,calculator(lang),{script:"calculator"}),
      page("guides",es?"Guías de afiliación":"Affiliate publishing guides",es?"Guías sobre investigación, reseñas, enlaces y SEO para editores afiliados.":"Guides to affiliate research, product reviews, linking and search.",guideIndex(lang))
    );
    for(const key of ["privacy","contact"]) {
      const info=staticPage(lang,key);
      all.push(page(key,info.title,info.desc,info.body));
    }
    for(const [index,g] of guides.entries()) {
      const t=es?g.es:g, path=guidePath(lang,t);
      all.push({lang,path,alternate:guidePath(other,es?g:g.es),title:t.title+" | "+brand,desc:t.intro,body:guideArticle(lang,t,index),
        structured:{"@type":"Article",headline:t.title,description:t.intro,url:origin(path),datePublished:es?"2026-11-11":"2026-04-06",dateModified:"2026-11-11",inLanguage:lang,author:{"@type":"Organization",name:brand,url:host},publisher:{"@type":"Organization",name:brand,url:host},image:origin("/og-image.jpg")}});
    }
  }
  all.push({lang:"en",path:"/404.html",title:"Page not found | "+brand,desc:"Find the AffiliateWriterAI tools and publishing guides.",noindex:true,body:`<div class="frame reading plain-page"><h1>Page not found</h1><p>Open the editor or browse the publishing guides.</p><div class="actions"><a class="button" href="/editor/">Open editor</a><a class="text-link" href="/blog/">Browse guides →</a></div></div>`});
  return all;
}

export { render, websitePages, host };
