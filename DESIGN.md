---
name: Jcasol Developer Workspace
description: Evolución editorial de un entorno de desarrollo personal.
colors:
  workspace: "#070e19"
  panel: "#0c1726"
  ink: "#e4edf9"
  muted: "#9aaec7"
  cyan: "#76d7ed"
  blue: "#2563eb"
typography:
  display:
    fontSize: "96px"
    fontFamily: "Inter, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.04em"
    lineHeight: 0.96
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.8
  code:
    fontSize: "12px"
    fontFamily: "JetBrains Mono, monospace"
    lineHeight: 1.8
  interface-small:
    fontSize: "10px"
  metadata:
    fontSize: "11px"
  control:
    fontSize: "13px"
  secondary:
    fontSize: "14px"
  caption:
    fontSize: "15px"
  lead:
    fontSize: "18px"
  intro:
    fontSize: "22px"
  subtitle:
    fontSize: "30px"
  heading-phone:
    fontSize: "38px"
  title-phone:
    fontSize: "40px"
  name-phone:
    fontSize: "42px"
  name-min:
    fontSize: "64px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
rounded:
  control: "8px"
  window: "16px"
---

## Overview

La autoridad visual existente es el workspace oscuro: Inter y JetBrains Mono autoalojadas, terminales azules, IDE, Git y ventanas de producto. V4 conserva ese lenguaje y concentra el momento principal en el retrato recortado sin fondo detrás de su terminal. Corrección explícita del usuario: sin marco blanco, sin ampliación y con profile.sh delante. Modo de esta superficie: Experience. Brief proporcionado por el usuario; no hay decisiones pendientes que bloqueen su implementación.

## Colors

Base azul tinta, texto frío y cian como señal de interacción. Azul para acciones primarias. La sección personal mantiene el azul tinta, con jerarquía editorial y una ficha profile.yaml; el usuario ha descartado tanto el fondo blanco como repetir su retrato en Sobre mí. Resbix conserva su identidad violeta localizada; Carteliax, verde. Estos colores no invaden el resto de la web.

## Typography

Inter para nombre, titulares y lectura. JetBrains Mono para comandos, archivos, datos del perfil e interfaces del editor. Nombre en dos líneas, tracking mínimo -0.04em; nunca texto con degradado. Prosa de 45–75 caracteres, titulares equilibrados, secundarios con contraste suficiente.

## Layout

Hero asimétrico: identidad y acciones a la izquierda; retrato sin fondo a escala contenida detrás del shell a la derecha. En móvil, identidad → frase breve → ubicación y formación con iconos → CTA/redes → SaaS → escena de retrato y terminal → detalles ampliables; DOM y foco siguen ese mismo orden. Nunca tapar la cara. Sección personal oscura con logo original, stack oscuro y productos con interfaces propias. Separación generosa entre secciones; agrupación compacta en las herramientas. Reutilizar las 11 tarjetas en el explorador; nunca duplicarlas.

## Elevation & Depth

Profundidad reservada al perfil y SaaS principales. Reflejo localizado y giro leve solo con puntero fino. El shell funciona como una ventana delante del retrato, sin cubrir la cara. Ningún efecto intercepta enlaces o scroll.

## Shapes

Ventanas con radios de 12–16 px; controles de 8 px. Los círculos de estado y botones del marco pertenecen al lenguaje de aplicaciones existente. El retrato mantiene proporciones y colores naturales.

## Components

Hero: lectura inicial breve («Proyectos web e Integraciones con IA»), ubicación/formación con iconos Lucide, acciones y redes accesibles, accesos a Resbix/Carteliax. Los párrafos completos, el stack y los enlaces secundarios se conservan en un details nativo «Más sobre mí y mi stack», utilizable con teclado y sin JS. La terminal conserva el perfil e incluye ai: ["Groq"]; altura adaptativa en móvil para no cortar líneas.

Sobre mí: readme personal con cuatro notas desplegables: persona, experiencia, productos y colaboración. Sus resúmenes e iconos permiten explorar el perfil sin un bloque largo de texto; todos los párrafos originales se conservan íntegros dentro de details nativos, accesibles con teclado y sin JavaScript. La ventana profile.yaml usa el logo existente, pestañas Perfil/Productos/Colaborar con iconos, flechas y Home/End, manifest en dos columnas en escritorio y filas en móvil, enlaces contextuales y barra de estado real de selección. Los iconos del recorrido cambian con cada pestaña. Sin JavaScript permanecen las notas, los datos, los enlaces a productos y el CV; se ocultan las pestañas y el panel dependiente. El espaciado es compacto y los resúmenes mantienen superficies táctiles amplias.

Stack: composición asimétrica con un mapa de arquitectura a la izquierda y los tres resúmenes originales a la derecha. Los nodos se disponen escalonados, con marcos de navegador/runtime, logos SVG locales y trazas SVG entre las tres capas reales (Vue.js/JavaScript → Node.js/Express → Supabase). Las trazas responden a hover/foco, sin movimiento continuo. La capa seleccionada se refleja con aria-current. Cada capa selecciona su área del Explorer y lleva el foco a su pestaña. En móvil, el mapa se lee en vertical con los mismos destinos. Resúmenes originales completos y accesos a WordPress/Elementor e IA/chatbots/CRM. Explorer con seis pestañas y dos paneles: explicación, tecnologías y enlace a un ejemplo real a la izquierda; código resaltado y ampliable a la derecha. En móvil se apilan y los controles mantienen superficies táctiles amplias. Los seis archivos existentes permanecen íntegros, al igual que los resúmenes y todos los controles. «Ampliar código» permite leer todas las líneas sin scroll interior. Navegación con flechas, Home/End y enlaces directos; sin JavaScript, el respaldo de texto incluye las seis áreas y los accesos llevan al código. No presentar los logos como botones si no tienen destino.

Entrada: nombre enmascarado y ventana de perfil coordinados con el boot existente; contenido visible por defecto. Estado/feedback: 150–280 ms. Momento principal: hasta 800 ms. Demos de SaaS de una sola pasada con repetición explícita. Diagramas exploran capas reales mediante botones y texto. Pausar movimiento fuera de vista, al ocultar pestaña y con movimiento reducido. No añadir librerías de animación.

## Do's and Don'ts

Conservar todo el contenido, IDs, enlaces y funciones. El PNG original es inmutable. El hero sirve el recorte con alfa en WebP; Sobre mí no repite la fotografía: utiliza el logo azul original del proyecto. El recorrido carta → QR → cliente es una explicación ilustrativa, no una sesión real ni datos de clientes. No inventar resultados ni estadísticas. Sin scroll hijacking, dependencias nuevas, sonido, despliegue o push.
