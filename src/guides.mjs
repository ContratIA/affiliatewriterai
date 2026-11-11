const article = (path, category, title, intro, sections, references, es) => ({path,category,title,intro,sections,references,es});
const google = "https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews";
const spam = "https://developers.google.com/search/docs/essentials/spam-policies";
const helpful = "https://developers.google.com/search/docs/fundamentals/creating-helpful-content";
const data = [
article("jasper-ai-review-affiliate-marketers", "Software", "Jasper for affiliate publishers: what to check", "Decide whether a brand-writing platform fits your review workflow by trying one representative assignment against the tools you already use.", [
  ["Start with one assignment", "Give every tool the same job: a comparison of two products, the reader's budget, the official sources and two notes from your own testing. Ask for an outline, a short verdict and a comparison table. Keep the brief identical so the results are comparable."],
  ["Read the draft with the sources open", "Mark every specification, price and experience claim. Count how many you can trace to your notes. Watch for wording that turns a manufacturer claim into an independent test. Review the links and the disclosure before judging the polish of the prose."],
  ["Measure the cost of finishing", "Track minutes to an editor-approved draft, corrections per page, and whether the export works with your CMS. Compare monthly billing and limits on the vendor's current pricing page. For a team, test sharing a brand style and revising a draft together."]
], [["Jasper pricing", "https://www.jasper.ai/pricing"],["Google's review guidance",google]], {
  path:"jasper-para-afiliados", category:"Software", title:"Jasper para afiliados: qué comprobar", intro:"Usa un encargo representativo para decidir si una herramienta de redacción de marca encaja en tu proceso de reseñas.",
  sections:[
    ["Empieza por un solo encargo", "Entrega el mismo encargo a cada herramienta: dos productos, el presupuesto del lector, las fuentes oficiales y dos notas de tus propias pruebas. Pide un esquema, un veredicto breve y una tabla comparativa."],
    ["Lee el borrador con las fuentes abiertas", "Marca las especificaciones, los precios y las afirmaciones de experiencia. Comprueba cuántas puedes rastrear hasta tus notas. Atribuye al fabricante lo que viene del fabricante y revisa el aviso de afiliación."],
    ["Mide el coste de terminar", "Registra los minutos hasta aprobar el borrador, las correcciones por página y los pasos para llevarlo a tu CMS. Consulta las tarifas actuales del proveedor y, si trabajas en equipo, prueba la edición compartida."]
  ], references:[["Precios de Jasper","https://www.jasper.ai/pricing"],["Guía de reseñas de Google",google]]
}),
article("how-to-write-amazon-affiliate-reviews-with-ai", "Writing", "How to write a useful Amazon affiliate review", "Build the article around a decision your reader needs to make. Document what you checked and what you learned.", [
  ["Describe the decision first", "Identify who is buying, the job the product needs to do and the conditions that matter. A manual grinder review for a small kitchen should explain storage and daily use. A review for espresso drinkers has different questions to answer."],
  ["Keep specifications and observations separate", "Record the exact model, the official specification and its source. When you test an item, write down the conditions and the result. Include your own evidence where you have it. Use the same criteria when you discuss alternatives."],
  ["Edit the links and the disclosure", "Add a clear disclosure where readers can see it before the first affiliate link. Check the disclosure and link requirements for the marketplace and account you use. Verify the model and destination before publishing, and record the date so you can revisit it."],
  ["Give the reader a choice", "Summarize who the product suits and describe a relevant alternative for a different need. Link to the sources that support the decision. Leave the specific price out unless you can maintain it and display it under your programme's conditions."]
], [["Google's review guidance",google],["Amazon Associates Operating Agreement","https://affiliate-program.amazon.com/help/operating/agreement"],["Google link attributes","https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links"]], {
  path:"como-escribir-resenas-de-afiliacion",category:"Redacción",title:"Cómo escribir una reseña de afiliación útil",intro:"Construye el artículo alrededor de una decisión real del lector y explica qué has podido comprobar.",
  sections:[
    ["Define la decisión", "Identifica quién compra, qué necesita y en qué condiciones lo usará. Una reseña para una cocina pequeña debe explicar el espacio que ocupa el producto. Para otro lector pueden importar el mantenimiento o la compatibilidad."],
    ["Distingue ficha y experiencia", "Guarda el modelo exacto, la especificación oficial y el enlace. Si has probado el artículo, registra las condiciones y el resultado e incluye pruebas propias. Usa los mismos criterios al analizar las alternativas."],
    ["Revisa los enlaces y el aviso", "Coloca un aviso claro antes del primer enlace de afiliación. Comprueba las condiciones del programa y el país donde operas. Verifica el modelo, el destino y la fecha de revisión."],
    ["Ayuda a elegir", "Resume a quién le encaja el producto y ofrece una alternativa relevante para otra necesidad. Enlaza las fuentes y publica precios solo cuando puedas mantenerlos conforme a las condiciones del programa."]
  ],references:[["Guía de reseñas de Google",google],["Acuerdo de Amazon Afiliados","https://afiliados.amazon.es/help/operating/agreement"],["Atributos de enlaces según Google","https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links"]]
}),
article("best-free-ai-tools-affiliate-content-2026", "Software", "How to choose free tools for affiliate content", "Choose a tool for each job in your workflow: gathering evidence, organizing the article and preparing it for publication.", [
  ["Research and editorial notes", "Start with the product's official page, documentation and your own measurements. A spreadsheet can hold a row for each claim with its source and last-checked date. That record gives you something to review the next time a product changes."],
  ["Drafting and comparisons", "Try the same sourced brief in your existing editor and in an affiliate-specific writing tool. Autoblogging.ai publishes a free credit allowance and supports product drafts. SEOWriting.ai offers a free plan with a limited set of generations. Confirm current limits on their pages before starting a project."],
  ["Handoff to your CMS", "Paste a sample into WordPress. Check headings, tables, disclosure placement and affiliate link attributes. A plain HTML or Markdown export can be sufficient for an individual publisher. Teams may value draft publishing, roles and editorial review."],
  ["Pick one workflow you can repeat", "Compare the time to prepare, verify and publish a finished piece. A generous generation allowance means little if you spend your editing time removing claims you cannot confirm."]
], [["Autoblogging.ai plans","https://autoblogging.ai/"],["SEOWriting.ai pricing","https://seowriting.ai/pricing"],["WordPress Custom HTML block","https://wordpress.org/documentation/article/custom-html/"]], {
  path:"elegir-herramientas-de-afiliacion",category:"Software",title:"Cómo elegir herramientas gratuitas de afiliación",intro:"Elige una herramienta para cada tarea: reunir pruebas, estructurar el artículo y prepararlo para publicar.",
  sections:[
    ["Documentación y notas", "Empieza por la ficha oficial, la documentación y tus mediciones. Una hoja de cálculo puede registrar cada dato con su fuente y la fecha en que lo comprobaste."],
    ["Borradores y comparativas", "Usa el mismo encargo con fuentes en tu editor habitual y en una herramienta especializada. Autoblogging.ai anuncia créditos gratuitos y SEOWriting.ai publica un plan gratuito limitado. Comprueba las condiciones vigentes en sus páginas."],
    ["Llevar el artículo a tu web", "Pega una prueba en WordPress. Revisa los encabezados, la tabla, la posición del aviso y los atributos de enlace. Si trabajas por tu cuenta, una exportación en HTML o Markdown puede cubrir el flujo."],
    ["Quédate con el proceso que puedas repetir", "Compara el tiempo necesario para preparar, verificar y publicar un artículo terminado. Cuenta también las correcciones de datos."]
  ],references:[["Planes de Autoblogging.ai","https://autoblogging.ai/"],["Precios de SEOWriting.ai","https://seowriting.ai/pricing"],["Bloque HTML de WordPress","https://wordpress.org/documentation/article/custom-html/"]]
}),
article("will-google-penalize-ai-affiliate-content", "Search", "What Google says about AI and affiliate reviews", "Read Google's published guidance alongside your article. Ask whether the page gives the reader evidence and perspective they can use.", [
  ["Review quality", "Google's guidance for reviews recommends evidence of your own experience where relevant, measurements, relevant alternatives and a clear explanation of trade-offs. If your article relies on documentation, attribute it and show how it informs a buying decision."],
  ["Scaled content and thin affiliation", "Google's spam policies discuss content produced at scale to manipulate rankings and affiliate pages that copy merchant material with little added value. Check for repeated descriptions, empty comparison pages and claims without evidence."],
  ["An editorial review before publication", "Ask the reviewer to verify each claim, the date-sensitive information, and where the link goes. Write a distinct title and description for the reader's question. Add sponsored link attributes and use an internal link when a related guide helps."]
], [["Google's review guidance",google],["Google Search spam policies",spam],["Helpful content guidance",helpful]], {
  path:"google-y-resenas-de-afiliacion",category:"SEO",title:"Qué dice Google sobre la IA y las reseñas de afiliación",intro:"Consulta la documentación de Google con el borrador delante y comprueba qué pruebas o información propia aporta.",
  sections:[
    ["Calidad de la reseña", "Google recomienda aportar pruebas de la experiencia, mediciones pertinentes y alternativas relevantes. Si la reseña parte de documentación, cita la fuente y explica cómo ayuda a tomar una decisión."],
    ["Contenido escalado y afiliación de poco valor", "Las políticas de Google abordan la producción masiva para manipular posiciones y las páginas que copian al comercio sin añadir información útil. Revisa las descripciones repetidas y las afirmaciones que carecen de pruebas."],
    ["Revisión antes de publicar", "Verifica cada dato, su vigencia y el destino de los enlaces. Escribe un título y una descripción específicos. Marca los enlaces patrocinados y enlaza a una guía propia cuando ayude al lector."]
  ],references:[["Guía de reseñas de Google",google],["Políticas de spam de Google",spam],["Guía de contenido útil",helpful]]
}),
article("affiliate-niche-research-before-writing", "Research", "How to research an affiliate niche before writing", "Use evidence from search results, the affiliate programme and your own costs to choose the first article worth producing.", [
  ["Start with a buyer's question", "Write down a specific question and inspect the results for the market you serve. Record whether the results are merchant pages, comparisons, guides or forums. Look for unanswered questions a reader would need to resolve before buying."],
  ["Check the economics with your own inputs", "Use your traffic or an explicitly labelled assumption. Multiply monthly visits by the share that click to the merchant, the merchant's order conversion rate, the average order value and the commission rate. Compare three traffic scenarios. Deduct content and tool costs when estimating profit."],
  ["Record a small, testable opportunity", "Pick one article, three sources and the evidence you can add. Measure impressions, clicks to the merchant and confirmed commissions where you have access. Record the date and revisit your assumptions after the first results."]
], [["Google's helpful content guidance",helpful],["Affiliate commission calculator","/calculator/"]], {
  path:"investigar-un-nicho-de-afiliacion",category:"Investigación",title:"Cómo investigar un nicho de afiliación antes de escribir",intro:"Elige el primer artículo con datos del buscador, condiciones del programa y tus propios costes.",
  sections:[
    ["Empieza por una pregunta del comprador", "Anota una pregunta concreta y revisa los resultados en el mercado al que te diriges. Registra si aparecen comercios, comparativas, guías o foros. Busca preguntas que siguen sin respuesta."],
    ["Haz las cuentas con tus datos", "Multiplica visitas mensuales, porcentaje de clic al comercio, conversión del comercio, importe medio de compra y tasa de comisión. Compara tres escenarios y resta tus costes si quieres estimar el beneficio."],
    ["Elige una oportunidad que puedas comprobar", "Selecciona un artículo, tres fuentes y las pruebas que puedes aportar. Mide impresiones, clics al comercio y comisiones confirmadas cuando tengas acceso. Registra la fecha y ajusta los supuestos con los resultados."]
  ],references:[["Guía de contenido útil de Google",helpful],["Calculadora de comisiones","/es/calculadora/"]]
})
];

export default data;
