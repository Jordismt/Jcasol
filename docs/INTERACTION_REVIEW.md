# Evolución de interacciones del portfolio

Se trabaja sobre `index.html`, `style.css` y `script.js`, en HTML, CSS y JavaScript
vanilla. Se mantienen las secciones, los once proyectos, los textos originales,
los destinos de los enlaces, el favicon y la configuración de EmailJS.

## Skills comprobadas

Se han leído y aplicado `frontend-design` y `vercel:verification`, disponibles en
el entorno. Impeccable, Web Design Guidelines y UI Skills no aparecen instaladas
en el catálogo ni en los directorios locales de skills inspeccionados. No se
atribuyen técnicas a esas skills ni se instalan dependencias en el portfolio.

## Dirección y cambios

Se conserva la composición y la paleta: Inter y JetBrains Mono, azul `#2563eb`,
fondo `#f8fafc`, slate `#334155`, terminal `#07111f` y el violeta propio de Resbix.
El movimiento evoca una sesión de trabajo: arranque, shell, explorador, producto
y envío de mensaje. Se mantiene el scroll natural del navegador.

- Boot con líneas progresivas, barra mediante `scaleX`, salida breve y retirada
  de seguridad en JavaScript y CSS. No bloquea el scroll ni lo reposiciona al acabar.
- Entrada coordinada del hero y reveal por máscaras del nombre. Terminal que
  escribe los comandos con pausas variables y presenta sus resultados una sola vez.
  La salida reserva su altura; existe una versión accesible del texto completo.
- Entradas de secciones, tarjetas y commits mediante IntersectionObserver y Web
  Animations API. El contenido base es visible aunque falle un efecto.
- Fondo del hero con movimiento sutil, progreso mediante transform y navegación
  activa con un indicador que se desplaza entre enlaces.
- Tarjetas con inclinación leve, iluminación localizada y reflejo del borde.
  Resbix y PresuVoz conservan sus previews; sus capas internas responden al ratón.
  Los botones principales tienen un desplazamiento magnético máximo de 3 px.
- IDE con pestañas accesibles, flechas/Home/End, resaltado sin librerías, números
  de línea, lenguaje del archivo en la barra inferior y altura estable al cambiar.
- Terminal interactiva con historial arriba/abajo, recuperación del borrador,
  autocompletado cíclico con Tab, salidas agrupadas y estados de éxito/error.
  Se conservan todos los comandos originales; se añaden `git status` y `sudo`
  como pequeños descubrimientos. Botón de ejecución y teclado móvil adecuados.
- Ctrl/Cmd+K con entrada/salida animada, búsqueda, estado sin resultados, selección,
  flechas, Enter, Escape, foco contenido y fondo inerte mientras permanece abierta.
- Contacto con foco animado, estados ready/sending/sent/error, indicador de envío,
  prevención de envíos duplicados y recuperación tras error. Misma clave pública,
  servicio, plantilla, nombres de campos y SDK de EmailJS.
- Los efectos de puntero se desactivan con puntero grueso, touch y movimiento
  reducido. Las animaciones activas también se cancelan al cambiar la preferencia.
  Los previews continuos se pausan fuera de la vista o con la pestaña oculta.

## Problemas detectados y resueltos

1. Varias correcciones de scroll y bloqueos durante el boot podían devolver al
   visitante arriba después de empezar a navegar. Se conserva únicamente el
   inicio arriba cuando no hay ancla; el final del boot no modifica la posición.
2. La terminal enfocaba de nuevo el input después de navegar, pudiendo provocar
   un salto de vuelta. Ahora enfoca el destino y usa `preventScroll` para el foco.
3. La restauración manual dejaba el botón atrás en la sección equivocada. La
   navegación atrás/adelante vuelve a enfocar y mostrar el ancla correspondiente.
4. Las reglas del titular de Resbix afectaban también a su marca y partían tanto
   el nombre como el símbolo Rx. Se acotan los estilos y se conserva el logotipo.
5. A 320 px, el tamaño mínimo de los hijos de PresuVoz desbordaba el interior de
   la tarjeta y recortaba nombre y preview. Se corrigen mínimos y tamaño móvil.
6. El autocompletado y los comandos verifican propiedades propias: entradas como
   `constructor` se interpretan como comandos desconocidos, sin heredar respuestas.

## Verificación realizada

Pruebas con Chrome real mediante Playwright, instalado únicamente en `/tmp`, y
un servidor HTTP local. La suite principal superó 76 comprobaciones; las pruebas
adicionales de los últimos ajustes también pasaron.

- Comparación del HTML con HEAD: ningún texto del cuerpo, enlace o ID original
  eliminado. Favicon y CV responden HTTP 200.
- Boot finalizado y scroll desbloqueado; inicio en `scrollY = 0`; scroll iniciado
  durante el boot conservado; enlace directo a `#services` respetado.
- Todos los comandos originales, errores, clear, historial, borrador, Tab y
  destinos de GitHub/LinkedIn/CV comprobados. Navegación de terminal enfoca destino.
- Paleta comprobada con Ctrl+K, Cmd+K, búsqueda, cero coincidencias, Shift+Tab,
  flechas, Enter, Escape y retorno del foco sin scroll involuntario.
- Cuatro pestañas del IDE, estado ARIA, lenguaje, resaltado, flechas, Home y altura
  estable comprobados. Preferencia de movimiento cambiada durante una transición.
- EmailJS real cargado. Respuestas de envío simuladas: pendiente, éxito, rechazo
  y biblioteca ausente. Cuenta, servicio, plantilla y campos originales comprobados.
- Luz e inclinación de las tarjetas comprobadas con ratón; en táctil están desactivadas.
- Navegación activa, progreso final y botones atrás/adelante comprobados.
- Responsive a 320, 375, 768, 1024 y 1440 px sin desbordamiento de página. Título y
  preview de PresuVoz comprobados dentro de la tarjeta tras corregir el recorte.
- Terminal móvil ejecutada con el botón táctil. Capturas del hero, IDE, productos,
  terminal y formulario revisadas visualmente.
- Sin JavaScript: boot oculto, contenido visible y contacto/navegación alternativos.
- Movimiento reducido: contenido visible y cero animaciones activas, también tras
  cambiar la preferencia durante la sesión.
- Cero excepciones JavaScript y errores de consola en las pruebas principales.
- `node --check script.js` y `git diff --check` correctos.

## Límites

No se envían correos reales ni se confirma la entrega por EmailJS. No se prueban
Safari/Firefox ni dispositivos físicos iPhone/Android: el móvil se emula en Chrome.
No se garantiza 60 FPS en hardware real ni se atribuye una puntuación Lighthouse.
Los destinos externos se conservan; no se auditan sus productos ni sus servidores.
No se realizan commits ni despliegues.

## Segunda pasada: UI de estación de desarrollo

Por petición posterior se refuerza la apariencia terminal/hacker con una capa visual
oscura sobre la misma estructura. Se preservan el azul, el violeta de Resbix, las
fuentes, todos los textos y enlaces, las once fichas y sus interfaces de producto.
La comparación toma como referencia los archivos existentes al empezar esta pasada,
incluyendo la línea de stack modificada por el propietario entre peticiones.

Archivos nuevos:

- `workspace.css`: entorno oscuro, marcos de shell, decoraciones de código,
  pestañas y sintaxis del editor, navegación y command palette oscuros, tarjetas,
  separadores y barra inferior. Las previews claras conservan su propia apariencia.
- `workspace.js`: lluvia de caracteres y símbolos de programación en canvas,
  control de pausa, persistencia opcional y ciclo de vida independiente del resto.

Integración en `index.html` y `script.js`:

- Fondo decorativo sin eventos de puntero ni contenido accesible redundante.
- Etiquetas `<developer>` y `</developer>`, cabecera `profile.sh`, detalle cromático
  de shell y una respuesta breve de señal al pasar por el nombre.
- Barra inferior con rama visual, ruta de la sección y porcentaje real de scroll.
  El pie tiene espacio suficiente y el indicador SCROLL queda sobre la barra.
- Control `FX on/off` con área táctil de 44 px, estado ARIA y preferencia recordada.
  El comando adicional `matrix` alterna el fondo; los comandos anteriores se mantienen.
- La barra queda inerte junto con el resto del fondo al abrir Ctrl/Cmd+K.

El canvas utiliza pequeñas imágenes de columnas precalculadas, resolución en píxeles
CSS y un máximo de 30 dibujos por segundo en escritorio / 20 en móvil. No añade
bibliotecas. No intercepta clics ni scroll. Al pausar se cancela requestAnimationFrame;
con movimiento reducido no se dibuja y el control explica la preferencia del sistema.
La pestaña oculta detiene el bucle. El script tiene protección contra inicialización
repetida y el almacenamiento local no es necesario para que funcione.

Verificación de esta pasada:

- Las 76 comprobaciones de regresión vuelven a pasar con la nueva apariencia,
  incluyendo conservación de textos/URLs/IDs, favicon, CV, boot, anclas, terminal,
  IDE, paleta, EmailJS simulado, sin JS y movimiento reducido.
- Otras 14 comprobaciones pasan: píxeles en movimiento, pausa real sin nuevos frames,
  preferencia tras recargar, `matrix` on/off, script cargado dos veces, respuesta al
  evento de visibilidad simulado, ruta activa, preferencia de movimiento en vivo y
  tamaños 320/375/768/1024 px. Sin errores de consola ni excepciones.
- Capturas de hero, IDE, Resbix, paleta y formulario móvil revisadas.
- El campo de código mantiene baja opacidad y se atenúa detrás de los textos.
- `node --check script.js`, `node --check workspace.js` y `git diff --check` correctos.

Se mantienen los límites anteriores: no hay envío real de correo, pruebas en
Safari/Firefox/dispositivos físicos, medición de FPS reales, commits ni despliegue.

## Tercera pasada: presentación de Proyectos

Ámbito exclusivo de esta pasada: contenido de `#projects` en `index.html`, una
hoja nueva `projects.css`, y seis capturas locales en `assets/projects/`. Todos los
selectores nuevos están limitados a `#projects`. Se comprueba que el HTML exterior
permanece idéntico, salvo el enlace a esa hoja de estilo; `script.js`, `style.css`,
`workspace.css` y `workspace.js` permanecen idénticos a la versión anterior.

- Cabecera más compacta y directorio de tres accesos: productos propios, webs
  para negocios y más proyectos. Son anclas: no filtran ni ocultan contenido.
- Resbix mantiene todas sus interfaces, textos, enlaces y arquitectura. Su ventana,
  distribución, escalas, botón y chat se refinan; la etiqueta del preview deja de
  flotar encima del contenido.
- PresuVoz y Cartaliax comparten una fila y un lenguaje visual. Se conserva el
  presupuesto de ejemplo y su formulario. El enlace vacío que cubría PresuVoz se
  convierte en un botón visible con la misma URL, sin interceptar la selección de texto.
- Cartaliax añade un diagrama decorativo en HTML/CSS de sus capacidades ya descritas:
  carta digital, productos/categorías, QR y administración. No es una captura del producto.
- Las webs de clientes muestran capturas reales en marcos de navegador.
- Galería de seis tarjetas: Web Ainhoa, GeneraBD, Look&Luxe, TechZone, FitTrack y MySong.
  MySong conserva íntegros su explicación, tecnologías y código. FitTrack y MySong
  usan composiciones decorativas CSS, sin inventar URLs, estadísticas o interfaces reales.
- Las seis capturas se obtienen de los destinos ya enlazados, con respuesta HTTP 200:
  `ramisautoescola.com`, `mariajoseciscar.com`, `tfg-daw-rfrw.vercel.app`,
  `jordismt.github.io/GeneraBD_Jcasol/`, `look-luxe.vercel.app` y la demo local TechZone.
  Las redirecciones de los dos primeros a www no cambian los enlaces originales.
  Las imágenes se guardan localmente en JPEG: unos 458 KB en total, carga diferida,
  dimensiones declaradas y texto alternativo. La web no necesita embeber webs ajenas.

Validación en Chrome/Playwright:

- 53 comprobaciones superadas: conservación exacta del texto, URLs e IDs anteriores;
  once proyectos, cero IDs duplicados y alcance limitado a esta sección.
- Capturas cargadas, anclas y foco de grupos, accordion con teclado y tres acciones
  de los SaaS comprobadas. Las salidas de esos botones se interceptan localmente para
  verificar su destino sin navegar realmente a Resbix/PresuVoz en esa prueba.
- Acceso desde Ctrl+K, iluminación y profundidad anteriores conservados.
- 320/375/768/1024/1440 px sin desbordamiento: once tarjetas dentro de la sección,
  previews de Cartaliax/PresuVoz completas, movimiento reducido y contenido sin JS.
- Comprobación adicional a 500 px para el arte decorativo en tarjetas estrechas.
- Capturas de escritorio y móvil revisadas. Cero errores de consola o JavaScript.
- `git diff --check` correcto. No se cambia EmailJS ni se envía correo, y no se
  realizan commits o despliegues. No se prueban navegadores o dispositivos físicos adicionales.

## Cuarta pasada: productos lanzados, casos de estudio y perfil

Se incorporan tres secciones: Sobre mí (`#about`), casos de estudio
(`#case-studies`) y preguntas frecuentes (`#faq`). Se mantienen todas las secciones
anteriores y los once proyectos. La terminal existente recibe un ID para poder
navegar hasta ella; no se sustituye su contenido ni su comportamiento.

### Fuentes y límites del contenido

La fuente prioritaria es la descripción técnica facilitada expresamente por el
propietario en esta conversación. El CV local aporta la formación DAM/DAW,
ubicación en Valencia, experiencia en prácticas y desarrollo freelance. No se
inventan motivaciones personales, hobbies, clientes, testimonios, estadísticas,
ingresos, resultados comerciales ni decisiones técnicas no confirmadas.

- Resbix: plataforma multi-tenant con clientes, reservas, servicios, empleados y
  configuraciones por negocio. Agente Groq con servicios/precios, disponibilidad
  y reservas; WhatsApp mediante Evolution API; autenticación y aislamiento con
  Supabase; funcionalidades del panel por plan. Stack confirmado: Node.js,
  Express, JavaScript, Supabase, Groq, Stripe y Evolution API.
- Carteliax: plataforma multi-tenant para restaurantes y bares; gestión de negocios,
  cartas, categorías y productos; QR permanente; imágenes, alérgenos, disponibilidad,
  idiomas, plantillas y personalización. Stack confirmado: Nuxt, Vue 3, Tailwind CSS,
  Node.js, Express y Supabase.
- Ambos se presentan como productos desarrollados y lanzados en solitario en 2026,
  según confirmación del propietario.

Los dominios se verifican mediante Chrome: Resbix responde HTTP 200; Carteliax
redirige a www y responde HTTP 200. Se añaden dos capturas reales y locales de
sus páginas públicas, con dimensiones declaradas y carga diferida. Los ejemplos
que aparecen dentro de esas páginas públicas no se presentan como clientes reales
ni como resultados del portfolio. No se accede a paneles privados.

### Cambios

- `index.html`: nuevos contenidos, imágenes, accesos y metadatos de Carteliax.
  El nombre se corrige de Cartaliax a Carteliax; se conserva `project-cartaliax`
  como ID para no romper anclas anteriores.
- Dos fichas principales consecutivas para Resbix y Carteliax, con estado de
  lanzamiento, enlace al producto y acceso a su caso de estudio. Carteliax usa una
  captura real, stack confirmado y composición propia. Su descripción y código
  anteriores se mantienen. PresuVoz conserva toda su ficha, preview, formulario y
  enlaces, con una etiqueta neutral de proyecto SaaS para reservar el protagonismo
  de lanzamiento a los dos productos confirmados en esta petición.
- Los casos explican contexto, aportación, reto, arquitectura y stack. Resbix se
  centra en IA contextual, reservas, WhatsApp y planes; Carteliax en administración
  sin conocimientos técnicos y la permanencia del QR. Sus diagramas son mapas
  explicativos del sistema, no capturas de código o paneles privados.
- Sobre mí combina texto profesional basado en el CV y un archivo visual
  `profile.yaml`. Se añaden enlaces al CV y a los casos.
- FAQ con cuatro preguntas útiles para equipos y clientes: colaboración, productos,
  ubicación/remoto y acceso a experiencia/código. Desplegables HTML nativos.
- `stories.css`: estilos de las secciones nuevas y promoción de las dos fichas;
  `projects.css` usa un selector explícito para el texto de Carteliax en lugar de
  depender de su posición como primer hijo.
- `script.js`: nuevas rutas de navegación, comandos `cases`, `faq`, `resbix` y
  `carteliax`; `about` conserva su respuesta y lleva a la sección nueva. El dock
  identifica las secciones nuevas. La paleta mantiene los cinco accesos existentes
  y añade cuatro; su foco puede desplazarse dentro de la lista en pantallas bajas
  sin mover la página de fondo. EmailJS y sus credenciales se mantienen.

Los únicos ajustes del texto anterior, además del contenido añadido, son las
correcciones autorizadas de nombre, stack de Resbix y estado neutral de PresuVoz.
No se cambian URLs anteriores ni se eliminan proyectos o secciones.

### Verificación de esta pasada

72 comprobaciones superadas en Chrome/Playwright:

- Conservación de todos los IDs, anclas, URLs y secciones anteriores; once proyectos;
  sin IDs duplicados ni referencias internas rotas. La comparación del texto admite
  únicamente las correcciones de nombre, stack y etiqueta de estado descritas arriba.
- Dos fichas principales consecutivas, stacks de los dos casos comparados exactamente
  con los proporcionados, año y autoría confirmados, y esquema JSON-LD actualizado.
- Entradas desde las tarjetas, retorno a los títulos de proyecto con margen para el
  menú fijo, detalles de los casos y cuatro FAQ mediante teclado.
- Apertura de los enlaces de Carteliax y Resbix en ventana nueva. En esa comprobación
  se interceptan las respuestas del destino localmente; la disponibilidad pública se
  había verificado antes por separado con HTTP 200 y capturas reales.
- Comandos nuevos y originales, enlaces de productos, historial, borrador, Tab y clear.
- Ctrl+K con nueve accesos y búsqueda de casos. En 375 × 600 px, Shift+Tab deja visible
  el último enlace y Tab vuelve al buscador sin mover el scroll de la página de fondo.
- Estado de éxito del formulario probado con respuesta simulada. Se verifican el
  servicio y plantilla originales de EmailJS; no se envía correo real.
- 320, 375, 768, 1024 y 1440 px sin desbordamiento, con las secciones legibles y la
  captura de Carteliax dentro de su tarjeta. Movimiento reducido sin animaciones activas.
- Capturas locales de ambos SaaS cargadas correctamente. Contenido y FAQ funcionales
  sin JavaScript. Cero errores de consola o excepciones JavaScript.
- Capturas de escritorio y móvil inspeccionadas. `node --check script.js`,
  `node --check workspace.js` y `git diff --check` correctos.

No se prueba entrega de correo real, Safari/Firefox, dispositivos físicos ni FPS
reales. No se realizan commits ni despliegues.
