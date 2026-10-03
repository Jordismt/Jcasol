document.documentElement.classList.add("js");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const scrollBehavior = () => motionPreference.matches ? "auto" : "smooth";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* =========================================================
   SCROLL RESTORATION
========================================================= */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Evita que el navegador recuerde una posición anterior.
if (!location.hash) window.scrollTo(0, 0);

window.addEventListener("pageshow", () => {
  if (!location.hash) window.scrollTo(0, 0);
});

/* =========================================================
   DOM READY
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------
     START AT TOP
  ------------------------------------------------------- */

  if (!location.hash) window.scrollTo(0, 0);

  // Mientras aparece el boot no permitimos hacer scroll.
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  /* -------------------------------------------------------
     LUCIDE
  ------------------------------------------------------- */

  function initializeIcons() {
    if (window.lucide) {
      lucide.createIcons({ attrs: { "aria-hidden": "true", focusable: "false" } });
    }
  }
  initializeIcons();
  $("#iconScript")?.addEventListener("load", initializeIcons, { once: true });

  /* -------------------------------------------------------
     CURRENT YEAR
  ------------------------------------------------------- */

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =======================================================
     BOOT SCREEN
  ======================================================= */

  const boot = $("#boot");
  const bootLinesContainer = $("#bootlines");

  const bootLines = [
    "> initializing portfolio...",
    "> loading projects [ok]",
    "> loading stack [ok]",
    "> loading terminal [ok]",
    "> ready.",
  ];

  let bootIndex = 0;

  if (boot && bootLinesContainer) {
    const bootInterval = setInterval(() => {
      if (bootIndex < bootLines.length) {
        const line = document.createElement("div");

        line.textContent = bootLines[bootIndex];

        bootLinesContainer.appendChild(line);

        bootIndex++;
      } else {
        clearInterval(bootInterval);
      }
    }, 180);

    setTimeout(() => {
      boot.style.opacity = "0";
      boot.style.pointerEvents = "none";

      setTimeout(() => {
        boot.remove();

        // Reactivamos el scroll.
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // MUY IMPORTANTE:
        // volvemos arriba una vez desaparece el boot.
        if (!location.hash) window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });

        // Por si el navegador intenta recolocar el scroll
        // durante el siguiente frame.
        requestAnimationFrame(() => {
          if (!location.hash) window.scrollTo(0, 0);
        });
        if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "auto" });
      }, motionPreference.matches ? 0 : 600);
    }, motionPreference.matches ? 0 : 1250);
  } else {
    // Si por cualquier razón no existe el boot,
    // nunca dejamos la página bloqueada.
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (!location.hash) window.scrollTo(0, 0);
  }

  /* =======================================================
     HERO TERMINAL
  ======================================================= */

  const heroTerminal = $("#heroTerm");

  const heroLines = [
    ["$ whoami", "prompt"],
    ["> Jordi Casanova — Full Stack Developer", "answer"],
    ["", "answer"],

    ["$ cat stack.json", "prompt"],
    ["> {", "answer"],
    ['>   frontend: ["Next.js", "Vue", "Nuxt", "TypeScript"],', "answer"],
    ['>   backend: ["Node.js", "Express", "Spring Boot"],', "answer"],
    ['>   data: ["Supabase", "PostgreSQL", "MongoDB"]', "answer"],
    ["> }", "answer"],
    ["", "answer"],

    ["$ status", "prompt"],
    ["> available_for_work: true", "success"],
  ];

  let heroLineIndex = 0;

  function typeHeroLine() {
    if (!heroTerminal) return;

    if (heroLineIndex >= heroLines.length) {
      const caret = document.createElement("span");

      caret.className = "caret";

      heroTerminal.appendChild(caret);

      return;
    }

    const [text, className] = heroLines[heroLineIndex++];

    const line = document.createElement("div");

    line.className = className;

    heroTerminal.appendChild(line);

    // Línea vacía.
    if (!text) {
      line.innerHTML = "&nbsp;";

      setTimeout(typeHeroLine, 40);

      return;
    }

    if (motionPreference.matches) {
      line.textContent = text;
      typeHeroLine();
      return;
    }
    let characterIndex = 0;

    const typingInterval = setInterval(() => {
      characterIndex++;

      line.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        clearInterval(typingInterval);

        setTimeout(typeHeroLine, 110);
      }
    }, 16);
  }

  // Empieza cuando el boot prácticamente ha terminado.
  setTimeout(() => {
    if (heroTerminal) {
      heroTerminal.innerHTML = "";

      typeHeroLine();
    }
  }, 1500);

  /* =======================================================
     REVEAL ON SCROLL
  ======================================================= */

  const revealElements = $$(".reveal");

  $$(".stack-summary, .service-grid, .clientGrid, .projectGrid").forEach((group) => {
    [...group.children].forEach((item, index) => item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`));
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  const progress = $("#progress");

  function updateProgress() {
    if (!progress) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
      progress.style.transform = "scaleX(0)";

      return;
    }

    const percentage = Math.min(Math.max((window.scrollY / documentHeight) * 100, 0), 100);

    progress.style.transform = `scaleX(${percentage / 100})`;
  }

  let progressFrame = 0;
  function scheduleProgress() {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      progressFrame = 0;
      updateProgress();
    });
  }
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress, { passive: true });
  updateProgress();

  /* =======================================================
     CURSOR GLOW
  ======================================================= */

  const cursor = $("#cursor");

  if (cursor && !motionPreference.matches && window.matchMedia("(pointer: fine)").matches) {
    let cursorFrame = 0;
    let cursorX = 0;
    let cursorY = 0;
    window.addEventListener("mousemove", (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (cursorFrame || motionPreference.matches) return;
      cursorFrame = requestAnimationFrame(() => {
        cursorFrame = 0;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      });
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "";
    });
  }

  /* =======================================================
     STACK / IDE TABS
  ======================================================= */

  const stackData = {
    front: [
      "frontend.tsx",

      `export const frontend = {
  frameworks: [
    "Next.js",
    "Vue 3",
    "Nuxt"
  ],

  languages: [
    "TypeScript",
    "JavaScript"
  ],

  ui: [
    "Tailwind CSS",
    "Responsive UI"
  ],

  mobile: [
    "Flutter"
  ],

  focus: "interfaces that ship"
};`,
    ],

    back: [
      "backend.js",

      `const backend = {
  runtime: "Node.js",

  api: [
    "Express",
    "REST"
  ],

  java: [
    "Spring Boot",
    "Hibernate"
  ],

  ai: [
    "Groq",
    "Whisper"
  ],

  payments: "Stripe"
};

export default backend;`,
    ],

    data: [
      "database.sql",

      `-- production data layer

SELECT
  technology
FROM stack
WHERE category IN (
  'PostgreSQL',
  'Supabase',
  'MongoDB',
  'MySQL',
  'Auth / RLS'
);

-- multi-tenant ready
-- secure access
-- production data`,
    ],

    infra: [
      "deploy.yml",

      `deploy:
  hosting:
    - Vercel

  containers:
    - Docker

  os:
    - Linux

  version_control:
    - Git
    - GitHub

  pipeline:
    - CI/CD

  status: production-ready`,
    ],
  };

  const fileName = $("#fileName");
  const codePanel = $("#codePanel");

  function setTab(key) {
    if (!stackData[key]) return;

    $$(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === key);
      tab.setAttribute("aria-pressed", String(tab.dataset.tab === key));
      tab.setAttribute("aria-controls", "codePanel");
    });

    if (fileName) {
      fileName.textContent = `${stackData[key][0]} ×`;
    }

    if (codePanel) {
      codePanel.textContent = stackData[key][1];
      if (!motionPreference.matches && codePanel.animate) {
        codePanel.animate([{ opacity: .4, transform: "translateY(5px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "ease-out" });
      }
    }
  }

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      setTab(tab.dataset.tab);
    });
  });

  if (fileName && codePanel) {
    setTab("front");
  }

  /* =======================================================
     COMMAND PALETTE
  ======================================================= */

  const palette = $("#palette");
  const paletteInput = $("#paletteInput");
  const commandButton = $("#cmdBtn");

  let paletteReturnFocus;
  function togglePalette(force) {
    if (!palette) return;

    const shouldOpen = typeof force === "boolean" ? force : !palette.classList.contains("open");

    if (shouldOpen) {
      paletteReturnFocus = document.activeElement;
      paletteInput.value = "";
      $$(".palette a").forEach((item) => item.style.display = "");
    }
    const wasOpen = palette.classList.contains("open");
    palette.classList.toggle("open", shouldOpen);
    commandButton?.setAttribute("aria-expanded", String(shouldOpen));
    $("main").inert = shouldOpen;
    $("nav").inert = shouldOpen;
    $("footer").inert = shouldOpen;
    if (!shouldOpen && wasOpen) paletteReturnFocus?.focus();

    if (shouldOpen && paletteInput) {
      setTimeout(() => {
        paletteInput.focus();
      }, 50);
    }
  }

  if (commandButton) {
    commandButton.addEventListener("click", () => {
      togglePalette();
    });
  }

  if (palette) {
    palette.addEventListener("click", (event) => {
      if (event.target === palette) {
        togglePalette(false);
      }
    });
  }

  $$(".palette a").forEach((link) => {
    link.addEventListener("click", () => {
      togglePalette(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (palette?.classList.contains("open")) {
      const focusable = [paletteInput, ...$$(".palette a").filter((a) => a.style.display !== "none")];
      const index = focusable.indexOf(document.activeElement);
      if (event.key === "Tab") {
        event.preventDefault();
        focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        focusable[(index + (event.key === "ArrowDown" ? 1 : -1) + focusable.length) % focusable.length].focus();
      }
      if (event.key === "Enter" && document.activeElement === paletteInput) {
        event.preventDefault();
        focusable[1]?.click();
      }
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();

      togglePalette();
    }

    if (event.key === "Escape") {
      togglePalette(false);
    }
  });

  /* -------------------------------------------------------
     COMMAND PALETTE SEARCH
  ------------------------------------------------------- */

  if (paletteInput) {
    paletteInput.addEventListener("input", () => {
      const query = paletteInput.value.trim().toLowerCase();

      $$(".palette a").forEach((item) => {
        const text = item.textContent.toLowerCase();

        item.style.display = text.includes(query) ? "" : "none";
      });
    });
  }

  /* =======================================================
     INTERACTIVE TERMINAL
  ======================================================= */

  const commands = {
    help: "help · about · stack · projects · experience · services · contact · github · linkedin · cv · clear",
    experience: "Prácticas en Gesdata Consulting y Venalsol Smart Light; desarrollo freelance y productos propios. Consulta Journey o el CV.",
    services: "Webs para negocios · aplicaciones Full Stack · SaaS · APIs e integraciones.",

    about: "Jordi Casanova — Full Stack Developer · Valencia / Remote. DAM + DAW. Abierto a empleo y proyectos freelance.",

    stack:
      "Next.js · Vue · Nuxt · TypeScript · Node.js · Express · Spring Boot · Supabase · PostgreSQL · MongoDB · Docker",

    projects:
      "Resbix · Cartaliax · MySong · PresuVoz · Autoescuela Ramis · María José Císcar · Web Ainhoa · GeneraBD · Look&Luxe · TechZone · FitTrack",

    contact: "Email: jcasoldev@gmail.com",

    github: "Opening GitHub...",

    linkedin: "Opening LinkedIn...",

    cv: "Opening CV...",
  };

  const terminalForm = $("#termForm");
  const terminalInput = $("#termInput");
  const terminalHistory = $("#termHistory");

  function addTerminalOutput(command, output) {
    if (!terminalHistory) return;

    const commandLine = document.createElement("p");

    const prompt = document.createElement("b");

    prompt.textContent = "jordi@portfolio:~$ ";

    commandLine.appendChild(prompt);

    commandLine.appendChild(document.createTextNode(command));

    const outputLine = document.createElement("p");

    outputLine.className = "muted";

    outputLine.textContent = output;

    terminalHistory.appendChild(commandLine);
    terminalHistory.appendChild(outputLine);

    terminalHistory.scrollTop = terminalHistory.scrollHeight;
  }

  if (terminalForm && terminalInput && terminalHistory) {
    terminalForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const command = terminalInput.value.trim().toLowerCase();

      if (!command) return;

      /* CLEAR */

      if (command === "clear") {
        terminalHistory.innerHTML = "";
        terminalInput.removeAttribute("aria-describedby");

        terminalInput.value = "";

        terminalInput.focus();

        return;
      }

      /* OUTPUT */

      const output = commands[command] ?? `command not found: ${command} — try "help"`;

      addTerminalOutput(command, output);

      /* ACTIONS */
      if (command === "experience" || command === "services") {
        $(command === "experience" ? "#journey" : "#services")?.scrollIntoView({ behavior: scrollBehavior() });
      }

      if (command === "github") {
        window.open("https://github.com/jordismt", "_blank", "noopener,noreferrer");
      }

      if (command === "linkedin") {
        window.open("https://www.linkedin.com/in/jcasoldev/", "_blank", "noopener,noreferrer");
      }

      if (command === "cv") {
        window.open("./docs/Jcasol_CV.pdf", "_blank", "noopener,noreferrer");
      }

      if (command === "contact") {
        const contact = $("#contact");

        if (contact) {
          contact.scrollIntoView({
            behavior: scrollBehavior(),
          });
        }
      }

      if (command === "projects") {
        const projects = $("#projects");

        if (projects) {
          projects.scrollIntoView({
            behavior: scrollBehavior(),
          });
        }
      }

      if (command === "stack") {
        const stack = $("#stack");

        // Solo navegamos si existe una sección
        // con id="stack".
        if (stack) {
          stack.scrollIntoView({
            behavior: scrollBehavior(),
          });
        }
      }

      terminalInput.value = "";

      terminalInput.focus();
    });
  }

  /* =======================================================
     TERMINAL CLICK -> FOCUS INPUT
  ======================================================= */

  const interactiveTerminal = terminalForm?.closest(".terminal") || terminalForm?.parentElement;

  if (interactiveTerminal && terminalInput) {
    interactiveTerminal.addEventListener("click", (event) => {
      // Permitimos seleccionar texto sin robar
      // constantemente el foco.
      if (event.target.tagName !== "A" && event.target.tagName !== "BUTTON") {
        terminalInput.focus();
      }
    });
  }

  /* =======================================================
     EMAILJS
  ======================================================= */

  function initializeEmail() {
    if (window.emailjs) {
      emailjs.init({ publicKey: "IaLhzw35oAG114oNL" });
    }
  }
  initializeEmail();
  $("#emailScript")?.addEventListener("load", initializeEmail, { once: true });

  const contactForm = $("#contactForm");
  const successMessage = $("#successMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (successMessage) {
        successMessage.textContent = "Enviando...";
      }

      if (!window.emailjs) {
        if (successMessage) {
          successMessage.textContent = "No se pudo cargar EmailJS. Escríbeme a jcasoldev@gmail.com.";
        }

        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
      }

      emailjs
        .sendForm("service_l69lpba", "template_6kzyzx2", this)
        .then(() => {
          if (successMessage) {
            successMessage.textContent = "Mensaje enviado ✓";
          }

          this.reset();

          if (submitButton) {
            submitButton.disabled = false;
          }
        })
        .catch((error) => {
          console.error("EmailJS error:", error);

          if (successMessage) {
            successMessage.textContent = "Error al enviar. Escríbeme a jcasoldev@gmail.com.";
          }

          if (submitButton) {
            submitButton.disabled = false;
          }
        });
    });
  }

  /* =======================================================
     INTERNAL NAVIGATION
  ======================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      history.pushState(null, "", href);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: scrollBehavior(),
        block: "start",
      });
    });
  });

  // Keep existing continuous animations, but pause them outside the viewport.
  if ("IntersectionObserver" in window) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("motion-paused", !entry.isIntersecting));
    }, { rootMargin: "80px" });
    $$(".heroProject, .rbx-card, .ticker").forEach((element) => motionObserver.observe(element));
  }

  // Card lighting follows the pointer only where hover and motion are appropriate.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".skill-card").forEach((card) => {
      let frame;
      card.addEventListener("pointermove", (event) => {
        if (motionPreference.matches) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--light-x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--light-y", `${event.clientY - rect.top}px`);
        });
      });
      card.addEventListener("pointerleave", () => cancelAnimationFrame(frame));
    });
  }
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$(".navlinks a").forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    $$("section[id]").forEach((section) => sectionObserver.observe(section));
  }

  /* =======================================================
     FINAL SAFETY CHECK
  ======================================================= */

  // Algunos navegadores intentan restaurar el scroll
  // unos milisegundos después de cargar el DOM.
  // Mientras el boot siga visible, impedimos que ocurra.
  setTimeout(() => {
    if ($("#boot")) {
      if (!location.hash) window.scrollTo(0, 0);
    }
  }, 100);

  setTimeout(() => {
    if ($("#boot")) {
      if (!location.hash) window.scrollTo(0, 0);
    }
  }, 500);
});
