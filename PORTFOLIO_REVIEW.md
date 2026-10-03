# Evolución del portfolio

## Análisis previo

Se revisaron `index.html`, `style.css` completo, `script.js` completo, README, robots,
sitemap, el mapa CSS histórico, el CV y los HTML/CSS/JavaScript de las demos locales
TechZone, restaurante, dentista y Look&Luxe. Las demos se mantienen como proyectos
independientes; sus contenidos de muestra no se utilizan como testimonios o métricas reales.

La identidad existente combina Inter, JetBrains Mono, azul, fondos claros, bloques
oscuros, terminal, IDE, historial Git y tarjetas de producto. Se conserva la UI,
las secciones originales y el protagonismo de Resbix, incluida su composición de
marca, chat, órbitas, etiquetas y enlace.

El hero ya explicaba el desarrollo Full Stack; Stack, Work, Journey, Playground y
Contact ya cumplían funciones útiles. Faltaban experiencia profesional visible,
un resumen del stack independiente del IDE, detalles técnicos de los SaaS y una
explicación de servicios y proceso conectada con los proyectos. El CV y perfiles
profesionales necesitaban accesos más tempranos. Sin JavaScript, el boot tapaba la
página y los reveals ocultaban el contenido.

## Información utilizada

- `index.html` y `script.js`: proyectos, tecnologías, enlaces e identidad existentes.
- `docs/Jcasol_CV.pdf`: prácticas, desarrollo freelance, tres webs remuneradas,
  funcionalidades de Resbix, Cartaliax, PresuVoz y MySong; idiomas y niveles básicos.
- El proceso describe requisitos, implementación, pruebas y despliegue que ya
  aparecen en el CV; no promete plazos, resultados ni garantías adicionales.
- No se añaden tasas de conversión, ingresos, clientes, enlaces privados ni
  repositorios específicos que no consten en las fuentes. Cartaliax y MySong se
  presentan sin inventar una URL de demo o de código.

## Cambios

### `index.html`

- Presentación equilibrada para equipos de desarrollo y clientes freelance.
- Accesos tempranos a experiencia, servicios, GitHub y LinkedIn; CV original conservado.
- Stack visible por áreas con niveles básicos explícitos donde constan en el CV;
  IDE original conservado con contenido de respaldo.
- Detalle desplegable de arquitectura de Resbix: Vue, APIs Express, Supabase,
  PostgreSQL, autenticación/RLS, Groq, Stripe y capacidades del producto.
- PresuVoz reforzado con exportación PDF y suscripciones; Cartaliax y MySong añadidos
  a Work sin quitar ningún proyecto.
- Experiencia en la sección Journey: freelance, Gesdata, Venalsol y prácticas de
  técnico informático; formación original conservada; descarga de CV e idiomas.
- Servicios vinculados a proyectos y proceso de cuatro pasos.
- Dos caminos de contacto por email con igual jerarquía; formulario EmailJS original.
- Navegación a Services también desde la paleta y navegación sin JavaScript.
- Meta description, canonical, Open Graph, Twitter y theme-color.
- Scripts externos diferidos y Lucide fijado a una versión concreta.
- Enlace para saltar al contenido, nombres accesibles, autocompletado, estado del
  formulario anunciado y salida de terminal accesible. Sin autofocus invasivo.

### `style.css`

- Estilos adicionales basados en las fuentes, colores, radios y composición existentes.
- Cards, resumen de stack, servicios, proceso y detalles técnicos responsive.
- Hover y respuesta al pulsar, iluminación localizada y entradas escalonadas.
- Chat de Resbix con entrada progresiva de mensajes; diseño original conservado.
- Estados de foco visibles, anclas con margen para el menú fijo, contraste mejorado.
- Corrección del título de contacto en móvil estrecho y del ancho mínimo de grids.
- Contenido visible sin JS; boot solo habilitado cuando funciona el script.
- Movimiento reducido global, hover limitado por dispositivo y pausa fuera de pantalla.
- Onda de PresuVoz y progreso de scroll animados mediante transform.

### `projects/landingpages/techzone.css`

- Corrección de un selector previo que posicionaba los dos controles de cierre del
  modal en el mismo punto. Ambos se conservan y vuelven a ser accesibles con el ratón.

### `script.js`

- Revelado escalonado y seguimiento de sección activa.
- Paleta con foco contenido, flechas, Enter, Escape, retorno del foco y fondo inerte.
- Stack con estado accesible de selección; terminal con Resbix, experiencia y servicios.
- Anclas con URL actualizada y foco en destino; enlaces directos a secciones respetados.
- Preferencia de movimiento reducido respetada también al escribir y navegar.
- Iluminación de cards agrupada por requestAnimationFrame y pausa de efectos fuera de vista.
- Integración y envío EmailJS conservados; icons decorativos ocultos a lectores de pantalla.

## Datos pendientes de confirmar

Las fechas de formación del HTML original y del CV difieren:

- SMR: HTML 2020–2022; CV 2018–2020.
- ASIR: HTML 2022; CV 2021–2022.

Se mantienen los datos del HTML por la restricción de conservación. No se elige
una versión por suposición. El CV indica las fechas separadas de DAM y DAW.

No se publica ni despliega el portfolio como parte de esta modificación.

## Validación realizada

- Chrome mediante Playwright a 320, 375, 768, 1024 y 1440 px: sin desbordamiento
  horizontal de página. El explorador de tecnologías conserva su scroll horizontal
  intencionado en móvil.
- Conservación comprobada contra los archivos originales: todos los textos del
  cuerpo, enlaces e identificadores existentes siguen presentes.
- Anclas, identificadores únicos, rutas locales y PDF: comprobados.
- Stack, búsqueda de paleta, Enter, Shift+Tab, Escape y retorno del foco: comprobados.
- Terminal y listado de proyectos, detalle de Resbix y animaciones: comprobados.
- Sin JavaScript: boot oculto, contenido y stack visibles, navegación y contacto por
  email disponibles. Formulario y entrada de terminal se ocultan al necesitar JS.
- Movimiento reducido: efectos continuos desactivados y boot retirado inmediatamente.
- Formulario: biblioteca no disponible, éxito y error comprobados con simulaciones
  locales. No se envió ningún email real; no se confirma entrega externa.
- TechZone: apertura y cierre del modal comprobados después de corregir el solapamiento.
- Cero excepciones JavaScript en las pruebas de navegación e interacciones.
- Acceso directo a `#services`, margen del menú fijo y consola sin errores: comprobados.
- Nueve destinos externos comprobados: ocho HTTP 200; LinkedIn devuelve HTTP 999
  (bloqueo de automatización; no confirma que el enlace esté roto).
- `node --check script.js` y `git diff --check`: correctos.
- Capturas de escritorio y móvil revisadas; se conserva la identidad visual.
- No se atribuye una puntuación Lighthouse: no se ha ejecutado una auditoría Lighthouse.

Archivos de la web modificados: `index.html`, `style.css`, `script.js` y
`projects/landingpages/techzone.css`. Documento nuevo: `PORTFOLIO_REVIEW.md`.
