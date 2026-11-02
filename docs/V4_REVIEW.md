# Portfolio V4 · auditoría y validación

## Auditoría inicial

- Arquitectura: `index.html`, `style.css`, `workspace.css`, `projects.css`, `stories.css`, `script.js`, `workspace.js`. HTML/CSS/JS sin build ni framework.
- Secciones: hero, Sobre mí, stack/IDE, proyectos, dos casos de estudio, Journey, servicios y workflow, terminal, FAQ, contacto y footer.
- Proyectos preservados: Resbix, Carteliax, PresuVoz, Autoescuela Ramis, María José Císcar, Web Ainhoa, GeneraBD, Look&Luxe, TechZone, FitTrack y MySong.
- Funciones a conservar: boot con failsafe, anclas/historial, Ctrl+K y foco contenido, terminal con historial/Tab, IDE con teclado, EmailJS y estados, CV, favicon, lluvia de código y su control, enlaces y proyectos locales.
- Evidencia inicial: capturas de Chrome/Playwright a 1440 y 390 px en `/tmp/jcasol-v4/before-*.png`; posición inicial 0 y ancho de documento 390 px en móvil.
- Crítica: excesiva uniformidad oscura; ausencia de fotografía; terminal del hero demasiado vacía durante su escritura; los diagramas explican arquitectura pero permiten poca exploración. Mantener las interfaces y el contenido real como protagonistas.

## Skills consultadas

Impeccable 4.8.0: launcher `context` y referencias reales de init, document, critique, bolder, layout, typeset, animate, delight, overdrive, craft-floor, audit y polish. También frontend-design y Vercel verification. Los nombres anteriores corresponden a guías consultadas, no a comandos de ejecución inventados. UI Skills no está instalada. No se instalan dependencias.

## Validación final

**17/17 comprobaciones aprobadas**, con Chrome 147 y Playwright. Pruebas reproducibles en `tests/portfolio-check.cjs`; resultados completos en `/tmp/jcasol-v4/validation-results.json`.

| Comprobación | Evidencia |
| --- | --- |
| Conservación | Los 11 proyectos, todos los IDs originales salvo el boot retirado, destinos de enlaces y párrafos originales de `main` se comparan con `git show HEAD:index.html`. Sin IDs duplicados. |
| Responsive | 320, 375, 390, 768, 1024 y 1440 px: ancho del documento igual al viewport y scroll inicial 0. |
| Boot | Desaparece sin bloquear el scroll; ausencia inmediata con movimiento reducido y oculto sin JS. |
| Historial y anclas | Inicio en 0; enlaces a proyectos; Atrás hasta 0; enlace directo a `#case-carteliax` respetado después del boot. Se corrigió una carrera entre el scroll suave del compositor y `popstate`, esperando un frame del navegador. |
| Ctrl+K | Búsqueda, Enter, flechas, Shift+Tab, Escape, retorno de foco y fondo inerte comprobados. |
| Terminal | Comandos, Tab, historial, salida de error 127, texto no interpretado como HTML, Ctrl+L, clear y accesos táctiles. |
| IDE | Selección con flechas, lenguaje/archivo, tokens de sintaxis y línea activa con teclado. |
| Explorer | Filtros 3/2/6/11 sobre las tarjetas existentes; una ancla a un proyecto oculto restaura su visibilidad antes de navegar. |
| SaaS | Conversación acotada y repetible de Resbix; estados del recorrido Carteliax; arquitectura seleccionable con Enter. |
| EmailJS | Servicio `service_l69lpba`, plantilla `template_6kzyzx2` y campos originales conservados. Éxito, rechazo y biblioteca ausente simulados; los errores conservan lo escrito. No se ha enviado correo real. |
| Sin JS | Nombre, retrato, 11 proyectos, enlaces y contacto por email disponibles. Se ocultan controles que necesitan JS. |
| Movimiento reducido | Boot y lluvia desactivados, sin animaciones en ejecución ni transformación del retrato. También se comprueba el cambio de preferencia durante la sesión. |
| Táctil | Eventos táctiles sintetizados en Chromium: paleta, comandos rápidos y filtro SaaS. |
| Recursos | Referencias locales, anclas, PDF, favicon y retratos comprobados; todas las imágenes cargan. Sin excepciones JS ni solicitudes fallidas en la sesión de regresión. |

### Accesibilidad

axe-core con reglas WCAG 2 A/AA, 2.1 AA y 2.2 AA a 390 y 1440 px: **0 infracciones automáticas**. Se corrigió el contraste del nombre de archivo de PresuVoz (2.56:1 antes) y los nombres accesibles de grupos genéricos. Las comprobaciones incompletas de axe son contraste sobre fondos con degradados y el control de una paleta oculta: el destino `palette` existe y sus estados/foco se han probado. No equivale a certificación completa; no se ha probado con un lector de pantalla real.

### Diseño y acabado

Revisión propia mediante capturas del hero, Sobre mí, stack, SaaS y casos de estudio. Detectores reales `impeccable detect --scope layout` y `--scope type` ejecutados antes y después. Los avisos finales se han contrastado con el render:

- Marcos con altura y alineación flex aparecen como padding insuficiente aunque el texto está centrado dentro del chrome.
- La interfaz de un producto dentro de su presentación produce un aviso de tarjetas anidadas; aquí representa la aplicación que se está mostrando.
- Inter autoalojada y la etiqueta WORKFLOW son parte del sistema existente que el encargo pide conservar.
- Persisten tamaños tipográficos pequeños heredados en metadatos de las interfaces y valores fuera de la rampa resumida de DESIGN.md; no se presentan los detectores como limpios.

La crítica formal con dos subagentes de Impeccable no se ha ejecutado: su guía exige una autorización específica, solicitada durante el trabajo y no recibida. Se ha realizado revisión visual propia, revisión mecánica y regresión funcional; no se atribuyen a revisores independientes.

### Rendimiento y límites

Sin dependencias de producción nuevas. El retrato del hero pesa 73.230 bytes en WebP con alfa; se precarga solo esa versión. Sobre mí utiliza el logo original, sin fotografía personal. La copia natural optimizada de 34.682 bytes queda conservada como asset sin uso en esa sección. Los dos scripts locales suman 60.648 bytes antes de compresión. El movimiento nuevo usa WAAPI, transform/opacity, IntersectionObserver y frames a demanda. Las demos se pausan fuera de vista y con la pestaña oculta.

Medición orientativa en servidor local, Chrome de escritorio sin throttling y movimiento reducido: DOMContentLoaded ~96 ms, load ~167 ms, LCP observado ~168 ms y una tarea de 75 ms al arrancar. Estos datos no son Lighthouse, datos de producción, FPS garantizados ni una prueba de un móvil físico. No se han probado Safari/Firefox ni dispositivos reales. Los enlaces externos mantienen sus destinos; no se certifica el estado de cada servicio remoto.

## Archivos y experiencias implementadas

| Archivo | Cambio |
| --- | --- |
| `index.html` | Integración del retrato, accesos a SaaS, stack principal, explorer, controles de las demos y grupos accesibles. |
| `workspace.css` | Hero, retrato sin fondo detrás del shell, composición móvil, superficies técnicas, foco, IDE, terminal y workflow. |
| `projects.css` | Filtros, recorrido de reserva, demo Carteliax, acabado de previews y contraste de PresuVoz. |
| `stories.css` | Sobre mí oscuro con composición editorial, logo original, ficha interactiva y capas explorables de arquitectura. |
| `script.js` | Entrada del perfil, sintaxis en el shell, stack principal, línea activa del IDE, comandos y restauración del historial. |
| `workspace.js` | Explorer sin duplicación, arquitectura interactiva, conversación repetible, recorrido carta/QR/cliente, accesos rápidos y parallax del retrato. |
| `assets/portrait-jcasol.webp` | Copia optimizada del original conservada; retirada de Sobre mí a petición del usuario. |
| `assets/portrait-jcasol-cutout.png` y `.webp` | Recorte con transparencia y versión servida en el hero. |
| `PRODUCT.md` y `DESIGN.md` | Contexto, restricciones y sistema visual vigente. |
| `tests/portfolio-check.cjs` | Regresión de funciones existentes, nuevas experiencias y fallback. |

No se cambia de arquitectura ni se crea una segunda web. No se publica, despliega, hace commit ni push. `.codex/`, `.cursor/` y los archivos previos del usuario no se modifican.

## Fotografía: ajuste solicitado durante la revisión

Se sustituyó la primera composición enmarcada por el retrato **sin fondo y sin zoom**, detrás de `profile.sh`, a escala contenida y con la cara despejada. El original `foto_jcasol.png` permanece intacto: 1.601.922 bytes; SHA-256 `7862fc58d07bd8146ddead567a487373a0eba2e79db2c5d46e0e3697b172d5ba`.

Recorte producido con la herramienta integrada image_gen, según la skill imagegen; sin CLI ni claves API. Prompt aplicado: «Use case: background-extraction. Edit target: supplied original personal portrait of Jordi Casanova. Primary request: remove ONLY the plain white background and return the same photographic person as a clean transparent PNG cutout. Preserve identity absolutely: same exact face, hair, skin texture, expression, earrings, black shirt, pose, lighting and proportions. Do not regenerate, beautify, retouch, stylize, relight, enlarge or change the person. Preserve natural fine hair edges, original full visible shoulders and torso. True alpha transparency outside the person, including around hair; no white background, no checkerboard painted into pixels, no new shadow, no outline, no added content or text. This cutout will sit behind a terminal window in the person's developer portfolio». Se revisó la salida y se guardó en los assets del proyecto; el WebP conserva canal alfa. El recorte es una salida de edición generativa, no una garantía de igualdad de píxeles con la fuente.

## Capturas y reproducción

- Antes: `/tmp/jcasol-v4/before-desktop.png`, `before-mobile.png`.
- Después con efectos normales: `/tmp/jcasol-v4/validated-{320,375,390,768,1024,1440}.png`.
- Hero sin movimiento: `/tmp/jcasol-v4/final-desktop.png`.
- Secciones: `/tmp/jcasol-v4/final-about.png`, `final-stack.png`, `final-rbx-card.png`, `final-cartaliax-card.png`, `final-case-resbix.png`, `final-contact.png`.
- SaaS móvil: `/tmp/jcasol-v4/final-resbix-mobile.png`, `final-carteliax-mobile.png`.
- Informes: `/tmp/jcasol-v4/validation-results.json`, `accessibility-results.json`, `performance-results.json`, `final-layout-detect.json`, `final-type-detect.json`.

Las capturas son artefactos locales; `/tmp` no es almacenamiento permanente ni se incorpora al sitio publicado.

Para reproducir la regresión: arrancar `python3 -m http.server 4173 --bind 127.0.0.1` y ejecutar `PLAYWRIGHT_MODULE=/ruta/a/playwright node tests/portfolio-check.cjs`. Playwright se reutilizó de una instalación local existente; no se añadió al portfolio.

## Revisión posterior: Sobre mí oscuro y logo original

A petición del usuario se retira la superficie blanca y el retrato de Sobre mí. Se refuerza la composición editorial sobre azul tinta con el contenido completo, una ficha profile.yaml y el logo azul existente `img/logo_jcasol.png` en lugar del monograma JC. Tres pestañas exploran perfil, productos y colaboración con enlaces contextuales, estados accesibles y teclado. El manifest original sigue visible. La sección termina con una transición al stack. El hero y su retrato no cambian.

Prueba específica: `/tmp/jcasol-v4/about-review.cjs`; evidencias en `about-results.json` y `about-new-{desktop,390,768,1024}.png`. Se comprueban seis anchos, fondo oscuro, ausencia de retratos, carga del logo, pestañas con flechas/End, enlace contextual y fallback sin JavaScript. La revisión axe de la sección no presenta infracciones ni comprobaciones incompletas.

## Revisión posterior: hero más breve e IA visible

Se reduce el texto visible de entrada sin eliminar información: frase solicitada «Proyectos web e Integraciones con IA», iconos de ubicación/formación, proyectos y CV, GitHub/LinkedIn con nombre accesible y superficie de 44×44 px, y accesos a los dos SaaS. Los dos párrafos originales, el stack completo y los enlaces secundarios quedan en un details nativo, abierto con Enter/Espacio o clic y operable sin JavaScript. El retrato sigue detrás de profile.sh. La terminal animada incorpora `ai: ["Groq"]`; su respaldo HTML incluye `IA: Groq`.

Validación específica: `/tmp/jcasol-v4/hero-review.cjs`, resultados en `hero-results.json`; seis anchos sin desbordamiento de página ni contenido cortado dentro del terminal. Se comprueban el texto literal, Groq, tamaños de los controles, apertura/cierre con teclado, contenidos originales accesibles y respaldo sin JS. Axe en el hero expandido: cero infracciones. Regresión general tras simplificar: 17/17 aprobadas. Capturas actualizadas: `hero-compact-1440.png`, `hero-compact-390.png` y `hero-compact-expanded.png` dentro de `/tmp/jcasol-v4/`. Sin dependencias, despliegue ni push.

## Revisión posterior: Sobre mí más visual y con menos texto inicial

Los cuatro párrafos originales se conservan íntegros en cuatro notas nativas desplegables, con iconos y resúmenes para persona, experiencia, productos y colaboración. Los enlaces al CV y los casos de estudio permanecen visibles. La ficha incorpora iconos en las pestañas, los datos, los productos y el recorrido de tres capas; este último cambia sus iconos y etiquetas según la pestaña. Se compacta el espaciado y se evita añadir marcos a los iconos del recorrido.

La prueba específica `about-review.cjs` compara el HTML anterior de la sección con el actual: ningún párrafo, enlace o identificador perdido. También comprueba seis anchos entre 320 y 1440 px, apertura con Enter/Espacio, notas sin JavaScript, navegación de pestañas y enlaces contextuales. Evidencias en `/tmp/jcasol-v4/about-results.json` y `about-new-{desktop,390,768,1024}.png`.

## Revisión posterior: stack visual y Explorer ampliado

El stack principal se presenta como un mapa interactivo: interfaz (Vue.js y JavaScript), lógica (Node.js y Express) y datos (Supabase). Logos SVG locales de Simple Icons, conectores direccionales y respuesta a hover/foco; cada capa selecciona su pestaña del Explorer. El mapa se reorganiza verticalmente en móvil. Se mantienen los tres resúmenes originales, con iconos y mayor jerarquía visual, y se añaden accesos a WordPress/Elementor e IA/chatbots/CRM.

El Explorer conserva sus cuatro archivos originales sin cambios y añade `wordpress.js` e `integrations.js`. Las nuevas áreas incluyen WordPress, Elementor, Contact Form 7, BetterDocs, personalización con CSS/PHP, Groq, Whisper, chatbots, WhatsApp/Evolution API, CRM, reservas, calendarios, APIs REST, webhooks y Stripe. La presentación visual de cada pestaña convive con su código completo, que puede ampliarse o contraerse. Los matices de conocimientos básicos de TypeScript, Nuxt y Docker permanecen visibles.

Validación específica: `/tmp/jcasol-v4/stack-review.cjs`; resultados en `stack-results.json`. Ocho anchos entre 320 y 1440 px sin desbordamiento de página ni pestañas. Las seis áreas, las cinco rutas de acceso, el cambio con flechas/Home/End, ampliación/contracción de código, recarga de enlaces directos y respaldo sin JavaScript pasan. Se comparan los identificadores, resúmenes y cuatro fuentes anteriores: sin pérdidas. Sin excepciones JavaScript. Axe en las dos áreas nuevas, a 390 y 1440 px: cero infracciones automáticas; quedan verificaciones manuales de contraste por degradados y pseudo-elementos. Capturas revisadas: `stack-final-{390,768,1440}.png` y `stack-integrations.png` en `/tmp/jcasol-v4/`.

Los logos se sirven desde `assets/stack/`, con procedencia documentada en su README. Sin dependencias de producción nuevas ni publicación.

Regresión general tras el cambio del stack: **17/17 aprobadas**, sin excepciones JavaScript ni solicitudes de recursos fallidas. Navegación, terminales, IDE, proyectos, movimiento reducido y fallback sin JavaScript verificados con `tests/portfolio-check.cjs`.

### Segunda composición del stack

Se sustituye la fila de tres nodos por un mapa escalonado con trazas SVG y marcos de interfaz/runtime. El mapa comparte fila con los resúmenes originales en una composición asimétrica; WordPress e IA tienen accesos propios debajo. Las trazas reaccionan a hover/foco sin movimiento continuo, y la selección se refleja también en los enlaces del mapa mediante `aria-current`.

El Explorer separa la explicación visual y el código en dos paneles; en móvil se apilan. Cada área enlaza con evidencia real: Carteliax, Resbix, proyectos o trayectoria. Se mantienen las seis fuentes byte por byte respecto a la revisión anterior. La prueba específica añade detección de recortes internos y comprueba los enlaces contextuales y la restauración de la pestaña al volver atrás. Ocho anchos sin contenido recortado, sin errores JS, sin infracciones automáticas de axe en las áreas nuevas. La regresión general vuelve a pasar **17/17** tras esta composición. Las capturas `stack-final-{390,768,1440}.png` reflejan el diseño vigente.
