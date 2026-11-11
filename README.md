# AffiliateWriterAI

Herramientas editoriales bilingües para preparar reseñas y comparativas de afiliación a partir de notas propias, estimar comisiones y exportar borradores a WordPress.

## Desarrollo

Se requiere Node.js 20 o posterior. La web estática se compila con `npm run build` y se abre en `http://127.0.0.1:4173` con `npm run preview`. `npm run dev` compila y abre la vista local en un paso. `npm run lint` comprueba la sintaxis de los módulos.

`src/site.mjs` define las páginas, `src/guides.mjs` contiene las guías y `assets/` contiene la interfaz y sus recursos. Las rutas inglesas del blog original conservan sus URL. Los borradores se guardan por origen en el navegador y se pueden trasladar con la copia de seguridad JSON.

## Publicación en Hostinger

1. Descarga una copia de `public_html`, incluido el archivo `.htaccess` actual.
2. Compila con `npm run build`. Sube el contenido de `dist/` al `public_html` de **affiliatewriterai.com**. Incluye `.htaccess`. Si el alojamiento ya contiene reglas propias, conserva esas reglas al incorporar la redirección, el tipo MIME y las cabeceras de seguridad.
3. Comprueba HTTPS, la redirección del dominio sin `www`, las siete rutas históricas, el sitemap, el código 404 y las exportaciones. Purga la caché de Hostinger si sigue sirviendo la versión anterior.
4. Si el despliegue falla, restaura la copia de `public_html` y purga la caché.

El editor y la calculadora se ejecutan en el navegador. El sitio carece de un servicio de cuentas, suscripciones y publicación remota. La exportación WordPress es un fragmento HTML para pegar en un borrador del CMS.

Las fuentes DM Sans e Instrument Serif se incluyen con sus licencias OFL en `assets/fonts/`.
