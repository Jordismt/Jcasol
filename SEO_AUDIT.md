# Auditoría y optimización SEO — Jordi Casanova

Fecha: 3 de octubre de 2026. URL pública comprobada: https://jordismt.github.io/Jcasol/.

## Alcance y arquitectura

Se revisaron el HTML principal, todos los CSS y JavaScript vinculados, las cuatro demos locales, imágenes, CV, enlaces, README, metadatos, robots y sitemap antes de modificar archivos. El proyecto es estático, sin framework ni proceso de compilación. GitHub Pages sirve el portfolio bajo `/Jcasol/`; se mantienen las rutas existentes y el canonical público. No existe dominio personalizado ni manifest; no se necesita un manifest para indexar este portfolio.

Los cambios se aplican sobre el estado local existente al comenzar esta auditoría, incluidas las mejoras anteriores del portfolio. No se han publicado todavía. La versión pública consultada corresponde a un estado anterior.

## Problemas encontrados y soluciones

| Área | Situación inicial | Cambio |
| --- | --- | --- |
| Identidad profesional | Metadatos presentes, pero poco conectados con la doble intención | Title y descripción naturales: nombre, Full Stack, Vue.js, Node.js, desarrollo web, APIs, SaaS, empleo y freelance |
| Encabezados | El H1 sólo identificaba el nombre; títulos visuales no explicaban siempre la sección; algunos saltos de nivel | Un H1 con profesión y nombre; H2 que agrupan las etiquetas existentes y sus títulos; H3 de proyectos y H4 de elementos subordinados |
| Datos estructurados | Ausentes | Grafo JSON-LD que relaciona sitio, página de perfil, persona y once proyectos |
| Redes sociales | Metadatos incompletos y descripciones distintas | Open Graph y Twitter coherentes, dimensiones/tipo/ALT de la imagen existente y nombre del sitio |
| Rastreo | Sitemap antiguo incluía demos comerciales ficticias | Sitemap de una única URL indexable; demos con `noindex, follow`, título descriptivo y canonical propio |
| Robots | Archivo dentro del subdirectorio del proyecto | Reglas limpias y referencia al sitemap; documentada la limitación de ubicación |
| Fuentes | Hoja externa de Google Fonts en la ruta de renderizado | Mismas fuentes Inter y JetBrains Mono alojadas localmente, WOFF2, `font-display: swap` y preload de Inter |
| Dependencias | Inicialización ligada a scripts externos diferidos | Scripts externos asíncronos e inicialización segura antes o después de su carga; Lucide mantiene su versión y usa URL directa |
| Interacción | Progreso de scroll y cursor actualizados por evento | Agrupación mediante requestAnimationFrame; cursor con transform en lugar de left/top |
| HTML | Botón dentro de enlace en PresuVoz; fechas de intervalos en time | Enlace de cobertura y formulario independientes, mismos destinos y botón; fechas visibles preservadas como texto |
| Imágenes de demos | Dimensiones y políticas de carga incompletas | Dimensiones comprobadas, decoding y lazy debajo del primer viewport; hero de Look&Luxe con prioridad alta |
| Accesibilidad | Etiquetas incompletas, contraste de algunos textos secundarios, números decorativos anunciados | Labels y nombres accesibles, pequeños ajustes dentro de la paleta, números decorativos aria-hidden; focus y reduced-motion en demos |
| Móvil | Riesgo de zoom en inputs y desbordamientos en demos | Inputs principales de 16px; controles móviles y ajustes puntuales de navegación/chat/iframes |

No se han eliminado secciones, proyectos, botones, enlaces ni animaciones. La marca, colores principales, tipografía, mockups y protagonismo de Resbix se conservan. No se han añadido métricas, experiencia, testimonios ni tecnologías inventadas. Los textos comerciales ficticios que ya existían en demos siguen presentes, pero esas páginas no se presentan como pruebas de clientes reales ni se incluyen como negocios en Schema.

## Estrategia on-page

La página principal combina intención profesional (Full Stack Developer, perfil, stack, experiencia, formación, GitHub, LinkedIn y CV) e intención de proyecto (desarrollo web, APIs REST, SaaS, interfaces, bases de datos e integraciones). Las tecnologías se contextualizan en el stack y en proyectos reales, sin repetir artificialmente todas las palabras clave propuestas.

Se conserva Valencia porque ya figuraba en el portfolio. No se añade una dirección, área de servicio, empresa local, certificación o afirmación laboral no acreditada. No se crean páginas artificiales por tecnología ni enlaces de sitemap por fragmentos.

## Metadatos y Schema

Title: `Jordi Casanova | Full Stack Developer · Vue.js y Node.js`.

Descripción: `Jordi Casanova, Full Stack Developer en Valencia. Desarrollo web, APIs y SaaS con Vue.js y Node.js. Proyectos reales, oportunidades profesionales y freelance.`

Canonical: `https://jordismt.github.io/Jcasol/`. Las variantes `/index.html` apuntan al canonical de la portada; no se cambia ninguna URL pública.

JSON-LD estático: 14 nodos, con identificadores y relaciones coherentes:

- WebSite, ProfilePage y Person; sameAs sólo para GitHub y LinkedIn existentes.
- Cinco WebApplication: Resbix, PresuVoz, Cartaliax, Web Ainhoa y GeneraBD.
- Cuatro CreativeWork: Ramis Autoescola, María José Ciscar, Look&Luxe y TechZone.
- Dos SoftwareApplication: FitTrack y MySong.

Nombre, profesión, correo, conocimientos, descripciones y enlaces proceden del contenido existente. No se inventan precios, reseñas, puntuaciones, sistemas operativos, empleadores o disponibilidad de código. La validez del JSON no garantiza resultados enriquecidos; no se rellenan requisitos de esos resultados con información ficticia.

Open Graph y Twitter usan el logo existente en una URL pública real. El favicon pequeño y el icono Apple se derivan del mismo logo; no se cambia la identidad. No se añade meta keywords ni schemas comerciales inapropiados.

## Validación

- Navegador real con el subpath `/Jcasol/`: 320, 375, 768, 1024 y 1440px, sin desbordamiento horizontal, errores JavaScript ni recursos 404 en la portada.
- Metadatos sin duplicados, canonical exacto, un H1, jerarquía de encabezados sin saltos descendentes y JSON-LD parseable.
- Sitemap parseado como XML, únicamente URL pública principal. Las cuatro demos mantienen sus URLs y usan noindex, follow.
- Comparación con una copia previa: todos los IDs y destinos de enlaces originales conservados; mismo número de botones en los cinco HTML; todas las referencias locales existentes.
- Navegación por teclado y diálogo de comandos, retorno del foco, selector de stack, detalles de Resbix y terminal interactivo comprobados.
- Contenido y enlaces principales disponibles sin JavaScript; preferencias de movimiento reducido comprobadas. El envío por EmailJS sigue requiriendo JavaScript y red, como antes; no se envían correos reales durante la auditoría.
- Todas las demos probadas en móvil; navegación interna resuelve sus fragmentos. Imágenes externas comprobadas por separado. Se retiró una referencia a una hoja CSS inexistente de Feather (HTTP 404) en Look&Luxe: no había iconos dependientes de ese recurso ni funcionalidad asociada.
- Axe detectó y permitió corregir el contraste de textos informativos. Permanecen dos avisos de contraste sobre los números de fondo decorativos de las tarjetas de clientes; están marcados aria-hidden y no aportan información necesaria. No se altera ese recurso visual para eliminar un aviso automático.
- Con los scripts externos bloqueados, la portada sigue mostrando el contenido, termina el boot y carga ambas fuentes locales sin errores JavaScript; los servicios que requieren red mantienen esa dependencia.
- Sintaxis de los JavaScript modificados y `git diff --check` correctos.

### Rendimiento: laboratorio, no datos de usuarios reales

Lighthouse móvil sobre servidor local, antes/después de los cambios SEO: rendimiento 94/94, accesibilidad 100/100, buenas prácticas 100/100 y SEO 100/100. LCP 2,7/2,8s, CLS 0,012/0,011 y TBT 30/100ms en esas ejecuciones. Son muestras con variación de red/CPU, no evidencia de una mejora de Core Web Vitals en producción. El SEO 100 inicial no comprobaba la calidad semántica, Schema ni la situación del robots en el dominio.

Se reduce dependencia de fuentes externas y trabajo por eventos sin eliminar efectos. Las dos fuentes locales suman 79.688 bytes. Las imágenes grandes antiguas no referenciadas por la portada no se cargan; se conservan los archivos. No se elimina CSS por estimaciones de código no usado, ni se introduce un framework para minificar. Los avisos de caché/compresión del servidor local no representan necesariamente GitHub Pages, cuyos encabezados no se configuran desde este HTML.

INP necesita medición real de interacciones; Lighthouse no sustituye los datos de campo de Search Console/CrUX. Se mantiene la experiencia visual aunque una animación no mejore una puntuación sintética.

## Limitaciones externas y pendientes

1. El robots válido para el host es `https://jordismt.github.io/robots.txt`, que devuelve 404 en la comprobación. El archivo `/Jcasol/robots.txt` no sirve como robots raíz. Ese 404 no bloquea por sí mismo la indexación. Si controlas el repositorio del sitio raíz `jordismt.github.io`, publica allí las reglas adecuadas y la referencia a este sitemap, respetando las reglas de otros proyectos. No se puede corregir desde este repositorio sin gestionar ese sitio.
2. Seis fotografías existentes de la demo restaurante devuelven 404 en Unsplash: identificadores `1600891964309-c3e4a8ef1c8c`, `1600891964525-37f2b0c84c3d`, `1608759265467-2e04bb10ecf2`, `1555992336-cbf7c6cdb677`, `1564758565413-56c1b1fcb0e4`, `1533777324565-a040eb52fac1`. No se sustituyen por fotos distintas sin conocer los originales. Recupera esos archivos o elige reemplazos adecuados. La portada no depende de ellos y la demo queda noindex.
3. LinkedIn puede devolver restricciones a clientes automatizados; eso no demuestra un enlace roto. Los destinos importantes se conservan y las respuestas deben interpretarse según las restricciones del servicio.
4. El portfolio conserva las discrepancias históricas de formación ya señaladas en PORTFOLIO_REVIEW.md; no se decide cuál dato personal es correcto por conjetura.

## Acciones fuera del código

1. Publicar los cambios mediante el flujo habitual de GitHub Pages; después verificar canonical, favicon, fuentes, sitemap y códigos HTTP en la URL pública.
2. Verificar una propiedad URL-prefix `https://jordismt.github.io/Jcasol/` en Google Search Console (o una propiedad de dominio que controles). Se conserva el archivo de verificación existente.
3. Enviar `https://jordismt.github.io/Jcasol/sitemap.xml` e inspeccionar la portada; solicitar indexación tras publicar. Las demos deben mostrar su exclusión por noindex, no enviarse para indexar.
4. Comprobar el marcado publicado con Rich Results Test y Schema Markup Validator. Schema válido no implica elegibilidad para todas las presentaciones enriquecidas.
5. Supervisar cobertura/indexación, canonical elegido, consultas relevantes y Core Web Vitals de campo. No se prometen posiciones ni plazos de indexación.
6. Resolver el robots raíz sólo si gestionas ese sitio, y recuperar las seis fotos externas de la demo.

Referencias oficiales: [ubicación y creación de robots.txt](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [políticas de datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Archivos de esta optimización

Modificados: `index.html`, `style.css`, `script.js`, `robots.txt`, `sitemap.xml`; HTML y CSS de `techzone`, `restaurante` y `dentista`; `projects/landingpages/Look&Luxe/peluqueriaainhoa.html`, `styles.css` y `script.js` (14 archivos).

Nuevos: este informe; `assets/fonts/inter-latin.woff2`, `jetbrains-mono-latin.woff2`, `Inter-OFL.txt`, `JetBrainsMono-OFL.txt`; `img/favicon-32.png` y `img/apple-touch-icon.png` (7 archivos). Licencias de las fuentes incluidas. `PORTFOLIO_REVIEW.md` y otros cambios previos ya existían al comenzar esta tarea y se conservan.
