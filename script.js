const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const scrollBehavior = () => motionPreference.matches ? "auto" : "smooth";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One initial position correction. Boot completion and focus never reset scroll.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });

function initializePortfolio() {
  const root = document.documentElement;
  if (root.dataset.portfolioReady) return;
  root.dataset.portfolioReady = "true";
  root.classList.add("js");

  // Track only active animations so a preference change can cancel them at once.
  const motionAnimations = new Set();
  function animate(element, frames, options = {}) {
    if (!element?.animate || motionPreference.matches) return;
    const animation = element.animate(frames, {
      duration: 650, easing: "cubic-bezier(.22,1,.36,1)", ...options,
    });
    motionAnimations.add(animation);
    animation.finished.then(() => motionAnimations.delete(animation), () => motionAnimations.delete(animation));
    return animation;
  }

  function enter(element, index = 0, distance = 22) {
    animate(element, [
      { opacity: 0, transform: `translate3d(0,${distance}px,0)` },
      { opacity: 1, transform: "none" },
    ], { delay: index * 65, fill: "backwards" });
  }
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) motionAnimations.forEach((animation) => animation.cancel());
  });

  function initializeIcons() {
    window.lucide?.createIcons({ attrs: { "aria-hidden": "true", focusable: "false" } });
  }
  initializeIcons();
  $("#iconScript")?.addEventListener("load", initializeIcons, { once: true });
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  /* Boot is a fixed overlay, never a scroll lock. Both JS and CSS have a failsafe. */
  const boot = $("#boot");
  const bootLines = [
    "> initializing portfolio...", "> loading projects [ok]", "> loading stack [ok]",
    "> loading terminal [ok]", "> ready.",
  ];
  let bootFinished = false;
  let resolveBoot;
  const bootReady = new Promise((resolve) => { resolveBoot = resolve; });
  function finishBoot() {
    if (bootFinished) return;
    bootFinished = true;
    root.classList.remove("boot-active");
    root.classList.add("workspace-ready");
    boot?.remove();
    resolveBoot();
  }
  // Schedule removal before initializing any other effect.
  const bootFailsafe = setTimeout(finishBoot, 2400);
  if (boot && $("#bootlines") && !motionPreference.matches) {
    root.classList.add("boot-active");
    bootLines.forEach((text, index) => {
      setTimeout(() => {
        if (bootFinished) return;
        const line = document.createElement("div");
        line.textContent = text;
        $("#bootlines")?.append(line);
        enter(line, 0, 5);
      }, 100 + index * 155);
    });
    setTimeout(() => boot?.classList.add("boot-leaving"), 1050);
    setTimeout(finishBoot, 1420);
  } else finishBoot();
  bootReady.then(() => clearTimeout(bootFailsafe));
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) finishBoot();
  });

  /* Hero: one orchestrated entrance, then a single shell session. */
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
  async function playHeroTerminal() {
    if (!heroTerminal) return;
    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    accessible.textContent = heroLines.map(([text]) => text).join("\n");
    heroTerminal.replaceChildren(accessible);
    // Full text reserves line heights before typing, including on narrow screens.
    const lines = heroLines.map(([text, className]) => {
      const line = document.createElement("div");
      line.className = `${className} shell-line`;
      line.setAttribute("aria-hidden", "true");
      const reserve = document.createElement("span");
      reserve.className = "shell-reserve";
      reserve.textContent = text || "\u00a0";
      const ink = document.createElement("span");
      ink.className = "shell-ink";
      line.append(reserve, ink);
      heroTerminal.append(line);
      return { line, ink, text, className };
    });
    for (const { line, ink, text, className } of lines) {
      if (!motionPreference.matches) await delay(className === "prompt" ? 230 : 65);
      if (className === "prompt" && !motionPreference.matches) {
        line.classList.add("is-typing");
        for (let index = 1; index <= text.length; index++) {
          ink.textContent = text.slice(0, index);
          if (!motionPreference.matches) await delay(28 + Math.random() * 42 + (text[index - 1] === " " ? 60 : 0));
        }
        line.classList.remove("is-typing");
      } else {
        ink.textContent = text || "\u00a0";
        enter(ink, 0, 4);
      }
    }
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    heroTerminal.append(caret);
    heroTerminal.closest(".terminal")?.classList.add("shell-ready");
  }
  bootReady.then(() => {
    if (!location.hash && window.scrollY < window.innerHeight * .4) {
      const copy = $(".heroCopy");
      [...copy.children].filter((element) => !element.matches("h1")).forEach((element, index) => enter(element, index, 15));
      enter($(".overline"), 1, 12);
      $$(".name-line").forEach((line, index) => {
        animate(line, [
          { transform: "translate3d(0,110%,0)" }, { transform: "none" },
        ], { duration: 950, delay: 80 + index * 110, fill: "backwards" });
      });
      enter($(".terminalWrap"), 3, 30);
    }
    playHeroTerminal();
  });

  /* Progressive enhancement: CSS content is always visible if an effect fails. */
  $$(".stack-summary, .service-grid, .clientGrid, .projectGrid, .process ol").forEach((group) => {
    [...group.children].forEach((item, index) => {
      item.dataset.stagger = index % 3;
      item.classList.add("reveal");
    });
  });
  $$(".commit").forEach((commit) => commit.classList.add("reveal"));
  const revealElements = $$(".reveal").filter((element) => !element.matches(".heroCopy, .terminalWrap, .gitlog, .process"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        element.classList.add("visible");
        enter(element, Number(element.dataset.stagger || 0), element.matches(".commit") ? 12 : 24);
        const rule = element.querySelector(".section-meta");
        animate(rule, [{ opacity: .2, transform: "scaleX(.94)", transformOrigin: "left" }, { opacity: 1, transform: "none" }], { duration: 850 });
        observer.unobserve(element);
      });
    }, { threshold: 0, rootMargin: "0px 0px -35px 0px" });
    revealElements.forEach((element) => observer.observe(element));
  } else revealElements.forEach((element) => element.classList.add("visible"));

  /* One scroll frame: progress, active navigation and restrained hero parallax. */
  const progress = $("#progress");
  const grid = $(".hero .grid");
  const navLinks = $$(".navlinks a");
  const marker = document.createElement("span");
  marker.className = "nav-marker";
  marker.setAttribute("aria-hidden", "true");
  $(".navlinks")?.append(marker);
  const sections = $$("section[id]");
  let sectionPositions = [];
  let pageHeight = 1;
  let activeSection;
  let scrollFrame = 0;
  function measurePage() {
    sectionPositions = sections.map((section) => ({ id: section.id, top: section.getBoundingClientRect().top + window.scrollY }));
    pageHeight = Math.max(1, root.scrollHeight - window.innerHeight);
    activeSection = null;
    scheduleScroll();
  }
  function updateScroll() {
    scrollFrame = 0;
    const scrollY = window.scrollY;
    const fraction = Math.min(1, Math.max(0, scrollY / pageHeight));
    if (progress) progress.style.transform = `scaleX(${fraction})`;
    const dockProgress = $("#workspaceProgress");
    if (dockProgress) dockProgress.textContent = `${Math.round(fraction * 100).toString().padStart(2, "0")}%`;
    const active = sectionPositions.filter((section) => section.top <= scrollY + window.innerHeight * .3).at(-1)?.id;
    const dockPath = $("#workspacePath");
    const workspace = active || "portfolio";
    if (dockPath && dockPath.dataset.workspace !== workspace) {
      dockPath.dataset.workspace = workspace;
      dockPath.textContent = `~/${workspace}`;
    }
    if (active !== activeSection) {
      activeSection = active;
      navLinks.forEach((link) => {
        const current = link.hash === `#${active}`;
        if (current) {
          link.setAttribute("aria-current", "location");
          marker.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
        } else link.removeAttribute("aria-current");
      });
      marker.style.opacity = navLinks.some((link) => link.hash === `#${active}`) ? "1" : "0";
    }
    if (grid && finePointer.matches && !motionPreference.matches && scrollY < window.innerHeight * 1.5) {
      grid.style.setProperty("--scroll-drift", `${Math.min(scrollY * .09, 85)}px`);
    }
    $("nav")?.classList.toggle("nav-scrolled", scrollY > 32);
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", measurePage, { passive: true });
  window.addEventListener("load", measurePage, { once: true });
  document.fonts?.ready.then(measurePage);
  if ("ResizeObserver" in window) new ResizeObserver(measurePage).observe(document.body);
  measurePage();

  /* Pointer work is event driven and restricted to fine pointers. */
  const cursor = $("#cursor");
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || motionPreference.matches || event.pointerType === "touch") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (cursor) {
        cursor.classList.add("cursor-active");
        cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0) translate(-50%,-50%)`;
      }
      if (grid && window.scrollY < window.innerHeight) {
        grid.style.setProperty("--pointer-x", `${(pointerX / window.innerWidth - .5) * -16}px`);
        grid.style.setProperty("--pointer-y", `${(pointerY / window.innerHeight - .5) * -12}px`);
      }
    });
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => cursor?.classList.remove("cursor-active"));
  window.addEventListener("blur", () => cursor?.classList.remove("cursor-active"));

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

  /* Small safe tokenizer: source text always goes through textContent. */
  const fileName = $("#fileName");
  const codePanel = $("#codePanel");
  const stackTabs = $$(".tab");
  const languages = { front: "TypeScript React", back: "JavaScript", data: "SQL", infra: "YAML" };
  let currentTab;
  let editorAnimation;
  function highlightCode(source) {
    const fragment = document.createDocumentFragment();
    source.split("\n").forEach((text) => {
      const line = document.createElement("span");
      line.className = "code-line";
      const tokens = /("[^"\n]*"|'[^'\n]*'|\/\/.*$|--.*$|\b(?:export|const|default|SELECT|FROM|WHERE|IN)\b|\b\d+\b|[{}\[\]();,:])/g;
      let offset = 0;
      for (const match of text.matchAll(tokens)) {
        line.append(document.createTextNode(text.slice(offset, match.index)));
        const token = document.createElement("span");
        const value = match[0];
        token.className = /^\/\/|^--/.test(value) ? "syntax-comment" : /^["']/.test(value) ? "syntax-string" : /^\w/.test(value) ? "syntax-keyword" : "syntax-punctuation";
        token.textContent = value;
        line.append(token);
        offset = match.index + value.length;
      }
      line.append(document.createTextNode(text.slice(offset) || (text ? "" : "\u00a0")));
      fragment.append(line);
    });
    return fragment;
  }
  function setTab(key, userInitiated = false) {
    if (!stackData[key] || key === currentTab) return;
    currentTab = key;
    stackTabs.forEach((tab) => {
      const selected = tab.dataset.tab === key;
      tab.id = `stack-tab-${tab.dataset.tab}`;
      tab.classList.toggle("active", selected);
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("aria-controls", "codePanel");
      tab.tabIndex = selected ? 0 : -1;
    });
    if (fileName) fileName.textContent = `${stackData[key][0]} ×`;
    if (codePanel) {
      editorAnimation?.cancel();
      codePanel.replaceChildren(highlightCode(stackData[key][1]));
      codePanel.setAttribute("aria-labelledby", `stack-tab-${key}`);
      codePanel.scrollTop = 0;
      if (userInitiated) editorAnimation = animate(codePanel, [
        { opacity: .2, transform: "translate3d(0,7px,0)" }, { opacity: 1, transform: "none" },
      ], { duration: 280 });
    }
    const status = $(".statusbar span:last-child");
    if (status) status.textContent = `UTF-8 · ${languages[key]}`;
  }
  stackTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab, true));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % stackTabs.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + stackTabs.length) % stackTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = stackTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      setTab(stackTabs[next].dataset.tab, true);
      stackTabs[next].focus({ preventScroll: true });
    });
  });
  function setTabOrientation() {
    $(".ideSide")?.setAttribute("aria-orientation", window.innerWidth <= 900 ? "horizontal" : "vertical");
  }
  setTabOrientation();
  window.addEventListener("resize", setTabOrientation, { passive: true });
  if (codePanel) {
    codePanel.style.setProperty("--code-lines", Math.max(...Object.values(stackData).map(([, source]) => source.split("\n").length)));
    setTab("front");
  }

  /* Command palette: reversible CSS transitions and predictable keyboard focus. */
  const palette = $("#palette");
  const paletteInput = $("#paletteInput");
  const commandButton = $("#cmdBtn");
  const paletteLinks = $$(".paletteBox > a");
  const backgroundRegions = [$("main"), $("nav"), $("footer"), $(".skip-link"), $(".workspace-dock")].filter(Boolean);
  let paletteReturnFocus;
  let paletteFocusFrame;
  function revealPaletteFocus(element) {
    const box = $(".paletteBox");
    if (!box || !element) return;
    const bounds = box.getBoundingClientRect();
    const item = element.getBoundingClientRect();
    if (item.bottom > bounds.bottom - 12) box.scrollTop += item.bottom - bounds.bottom + 12;
    else if (item.top < bounds.top + 12) box.scrollTop -= bounds.top - item.top + 12;
  }
  function selectPaletteLink(link) {
    paletteLinks.forEach((item) => item.classList.toggle("palette-selected", item === link));
  }
  function togglePalette(force, restoreFocus = true) {
    if (!palette) return;
    const wasOpen = palette.classList.contains("open");
    const shouldOpen = typeof force === "boolean" ? force : !wasOpen;
    if (wasOpen === shouldOpen) return;
    cancelAnimationFrame(paletteFocusFrame);
    if (shouldOpen) {
      paletteReturnFocus = document.activeElement;
      paletteInput.value = "";
      $(".paletteBox").scrollTop = 0;
      paletteLinks.forEach((item) => { item.hidden = false; });
      $(".palette-empty").hidden = true;
      selectPaletteLink(paletteLinks[0]);
    }
    palette.inert = !shouldOpen;
    palette.classList.toggle("open", shouldOpen);
    palette.setAttribute("aria-hidden", String(!shouldOpen));
    commandButton?.setAttribute("aria-expanded", String(shouldOpen));
    backgroundRegions.forEach((region) => { region.inert = shouldOpen; });
    if (shouldOpen) paletteFocusFrame = requestAnimationFrame(() => paletteInput?.focus({ preventScroll: true }));
    else if (restoreFocus) paletteReturnFocus?.focus({ preventScroll: true });
  }
  commandButton?.addEventListener("click", () => togglePalette());
  palette?.addEventListener("click", (event) => {
    if (event.target === palette) togglePalette(false);
  });
  // Wheel events on the backdrop cannot scroll the page behind the dialog.
  palette?.addEventListener("wheel", (event) => {
    if (event.target === palette) event.preventDefault();
  }, { passive: false });
  paletteLinks.forEach((link) => {
    link.addEventListener("click", () => togglePalette(false, false));
    link.addEventListener("focus", () => { selectPaletteLink(link); revealPaletteFocus(link); });
    link.addEventListener("pointerenter", () => selectPaletteLink(link));
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePalette();
      return;
    }
    if (!palette?.classList.contains("open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      togglePalette(false);
      return;
    }
    const links = paletteLinks.filter((link) => !link.hidden);
    const focusable = [paletteInput, ...links];
    const index = Math.max(0, focusable.indexOf(document.activeElement));
    if (event.key === "Tab") {
      event.preventDefault();
      focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus({ preventScroll: true });
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusable[(index + (event.key === "ArrowDown" ? 1 : -1) + focusable.length) % focusable.length].focus({ preventScroll: true });
    }
    if (event.key === "Enter" && document.activeElement === paletteInput) {
      event.preventDefault();
      (links.find((link) => link.classList.contains("palette-selected")) || links[0])?.click();
    }
  });
  paletteInput?.addEventListener("input", () => {
    const query = paletteInput.value.trim().toLocaleLowerCase("es");
    paletteLinks.forEach((item) => { item.hidden = !item.textContent.toLocaleLowerCase("es").includes(query); });
    const visible = paletteLinks.filter((item) => !item.hidden);
    $(".palette-empty").hidden = visible.length > 0;
    selectPaletteLink(visible[0]);
  });
  paletteInput?.addEventListener("focus", () => revealPaletteFocus(paletteInput));

  const commands = {
    help: "help · about · stack · projects · experience · services · contact · github · linkedin · cv · clear",
    experience: "Prácticas en Gesdata Consulting y Venalsol Smart Light; desarrollo freelance y productos propios. Consulta Journey o el CV.",
    services: "Webs para negocios · aplicaciones Full Stack · SaaS · APIs e integraciones.",

    about: "Jordi Casanova — Full Stack Developer · Valencia / Remote. DAM + DAW. Abierto a empleo y proyectos freelance.",

    stack:
      "Next.js · Vue · Nuxt · TypeScript · Node.js · Express · Spring Boot · Supabase · PostgreSQL · MongoDB · Docker",

    projects:
      "Resbix · Carteliax · MySong · PresuVoz · Autoescuela Ramis · María José Císcar · Web Ainhoa · GeneraBD · Look&Luxe · TechZone · FitTrack",

    contact: "Email: jcasoldev@gmail.com",

    github: "Opening GitHub...",

    linkedin: "Opening LinkedIn...",

    cv: "Opening CV...",
  };

  // Quiet discoveries for visitors who explore the shell.
  commands["git status"] = "On branch main · working tree: ready to build something together.";
  commands.sudo = "Nice try :) Aquí no hace falta sudo. Prueba help.";
  commands.matrix = "Lluvia de código: usa matrix para alternar el efecto de fondo.";
  commands.cases = "Resbix: agente IA, reservas y WhatsApp. Carteliax: cartas digitales y QR permanente. Dos SaaS desarrollados y lanzados en solitario en 2026.";
  commands.faq = "Preguntas frecuentes sobre mi perfil, proyectos y formas de contacto.";
  commands.resbix = "Abriendo Resbix — https://resbix.com";
  commands.carteliax = "Abriendo Carteliax — https://carteliax.com";
  commands.help += " · matrix · cases · faq · resbix · carteliax";
  const terminalForm = $("#termForm");
  const terminalInput = $("#termInput");
  const terminalHistory = $("#termHistory");
  const terminalFeedback = $("#terminalFeedback");
  const commandHistory = [];
  let historyIndex = 0;
  let historyDraft = "";
  let completion;
  function feedback(text, state = "ready") {
    if (terminalFeedback) {
      terminalFeedback.textContent = text;
      terminalFeedback.dataset.state = state;
    }
  }
  function addTerminalOutput(command, output, success) {
    const entry = document.createElement("div");
    entry.className = `term-entry ${success ? "term-success" : "term-error"}`;
    const commandLine = document.createElement("p");
    const prompt = document.createElement("b");
    prompt.textContent = "jordi@portfolio:~$ ";
    commandLine.append(prompt, document.createTextNode(command));
    const outputLine = document.createElement("p");
    outputLine.className = "term-output";
    outputLine.textContent = output;
    entry.append(commandLine, outputLine);
    terminalHistory.append(entry);
    enter(entry, 0, 7);
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
    feedback(`bash · exit ${success ? "0" : "127"}`, success ? "success" : "error");
  }
  terminalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = terminalInput.value.trim().toLowerCase();
    if (!command) return;
    if (commandHistory.at(-1) !== command) commandHistory.push(command);
    historyIndex = commandHistory.length;
    historyDraft = "";
    completion = undefined;
    terminalInput.value = "";
    if (command === "clear") {
      terminalHistory.replaceChildren();
      terminalInput.setAttribute("aria-describedby", "terminal-shortcuts");
      feedback("bash · cleared", "success");
      terminalInput.focus({ preventScroll: true });
      return;
    }
    const success = Object.hasOwn(commands, command);
    if (command === "matrix") {
      const toggle = $("#effectsToggle");
      if (toggle?.disabled) commands.matrix = "Lluvia de código desactivada: tu sistema tiene activado reducir movimiento.";
      else if (toggle && !toggle.hidden) {
        toggle.click();
        commands.matrix = toggle.getAttribute("aria-pressed") === "true" ? "Lluvia de código activada. matrix para pausar." : "Lluvia de código pausada. matrix para activar.";
      } else commands.matrix = "Lluvia de código no disponible en este navegador. El portfolio sigue listo para explorar.";
    }
    addTerminalOutput(command, success ? commands[command] : `command not found: ${command} — try "help"`, success);
    const destinations = { about: "about", experience: "journey", services: "services", contact: "contact", projects: "projects", stack: "stack", cases: "case-studies", faq: "faq" };
    const external = {
      github: "https://github.com/jordismt", linkedin: "https://www.linkedin.com/in/jcasoldev/", cv: "./docs/Jcasol_CV.pdf",
      resbix: "https://resbix.com", carteliax: "https://carteliax.com",
    };
    if (Object.hasOwn(external, command)) window.open(external[command], "_blank", "noopener,noreferrer");
    if (Object.hasOwn(destinations, command)) navigateTo(document.getElementById(destinations[command]), `#${destinations[command]}`);
    else terminalInput.focus({ preventScroll: true });
  });
  terminalInput?.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === commandHistory.length) historyDraft = terminalInput.value;
      historyIndex = Math.max(0, Math.min(commandHistory.length, historyIndex + (event.key === "ArrowUp" ? -1 : 1)));
      terminalInput.value = commandHistory[historyIndex] ?? historyDraft;
      terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
      completion = undefined;
    }
    if (event.key === "Tab" && !event.shiftKey && terminalInput.value.trim()) {
      const prefix = terminalInput.value.trim().toLowerCase();
      if (!completion) completion = { matches: [...Object.keys(commands), "clear"].filter((command) => command.startsWith(prefix)), index: 0 };
      if (!completion.matches.length) {
        completion = undefined;
        return; // Keep normal keyboard navigation when there is no completion.
      }
      event.preventDefault();
      terminalInput.value = completion.matches[completion.index++ % completion.matches.length];
      feedback(completion.matches.length > 1 ? `${completion.matches.join(" · ")} · Tab: siguiente` : "bash · completed");
    }
  });
  terminalInput?.addEventListener("input", () => { completion = undefined; });
  terminalForm?.closest(".interactiveTerm")?.addEventListener("click", (event) => {
    if (window.getSelection()?.toString() || event.target.closest("a, button, input, label")) return;
    terminalInput.focus({ preventScroll: true });
  });

  /* EmailJS: same account, service, template and form fields. */
  let emailInitialized = false;
  function initializeEmail() {
    if (!emailInitialized && window.emailjs) {
      emailjs.init({ publicKey: "IaLhzw35oAG114oNL" });
      emailInitialized = true;
    }
  }
  initializeEmail();
  $("#emailScript")?.addEventListener("load", initializeEmail, { once: true });
  const contactForm = $("#contactForm");
  const successMessage = $("#successMessage");
  const formStatus = $(".formbar span");
  const sendLabel = $(".send-label");
  function setFormState(state, message) {
    contactForm.dataset.state = state;
    contactForm.setAttribute("aria-busy", String(state === "sending"));
    contactForm.querySelector('button[type="submit"]').disabled = state === "sending";
    if (formStatus) formStatus.textContent = { ready: "● ready", sending: "● sending", success: "✓ sent", error: "! error" }[state];
    if (sendLabel) sendLabel.textContent = state === "sending" ? "$ sending..." : "$ send_message";
    if (successMessage) successMessage.textContent = message;
  }
  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (contactForm.dataset.state === "sending") return;
    if (!window.emailjs) {
      setFormState("error", "No se pudo cargar EmailJS. Escríbeme a jcasoldev@gmail.com.");
      return;
    }
    initializeEmail();
    setFormState("sending", "Enviando...");
    try {
      await emailjs.sendForm("service_l69lpba", "template_6kzyzx2", contactForm);
      setFormState("success", "Mensaje enviado ✓");
      contactForm.reset();
      enter(successMessage, 0, 5);
    } catch {
      setFormState("error", "Error al enviar. Escríbeme a jcasoldev@gmail.com.");
      enter(successMessage, 0, 5);
    }
  });
  contactForm?.addEventListener("input", () => {
    if (["success", "error"].includes(contactForm.dataset.state)) setFormState("ready", "");
  });

  /* Only intentional navigation changes the URL, focus or scroll. */
  function navigateTo(target, href) {
    if (!target) return;
    if (location.hash !== href) history.pushState(null, "", href);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      navigateTo(target, href);
    });
  });
  // Manual initial restoration must not break intentional Back/Forward navigation.
  window.addEventListener("popstate", () => {
    const target = document.getElementById(location.hash.slice(1) || "top");
    if (!target) return;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "instant", block: "start" });
  });

  /* Continuous product previews sleep outside the viewport or in hidden tabs. */
  const previews = $$(".heroProject, .rbx-card, .ticker");
  if ("IntersectionObserver" in window) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("motion-paused", !entry.isIntersecting));
    }, { rootMargin: "40px" });
    previews.forEach((element) => motionObserver.observe(element));
  }
  document.addEventListener("visibilitychange", () => root.classList.toggle("page-paused", document.hidden));

  /* Card light and shallow physical depth; no idle requestAnimationFrame loop. */
  const cards = $$(".rbx-card, .heroProject, .client, .smallProject, .product-extension, .skill-card");
  const resetCards = [];
  cards.forEach((card) => {
    card.classList.add("motion-card");
    const light = document.createElement("span");
    light.className = "card-light";
    light.setAttribute("aria-hidden", "true");
    card.append(light);
    let frame = 0;
    let rect;
    let clientX;
    let clientY;
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      rect = undefined;
      card.classList.remove("pointer-active");
      ["--tilt-x", "--tilt-y", "--depth-x", "--depth-y"].forEach((property) => card.style.removeProperty(property));
    }
    resetCards.push(reset);
    card.addEventListener("pointerenter", (event) => {
      if (!finePointer.matches || motionPreference.matches || event.pointerType === "touch") return;
      rect = card.getBoundingClientRect();
      card.classList.add("pointer-active");
    });
    card.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || motionPreference.matches || event.pointerType === "touch") return;
      rect ||= card.getBoundingClientRect();
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        const strength = card.matches(".rbx-card, .heroProject") ? 2 : 3;
        card.style.setProperty("--light-x", `${x * 100}%`);
        card.style.setProperty("--light-y", `${y * 100}%`);
        card.style.setProperty("--tilt-x", `${(.5 - y) * strength}deg`);
        card.style.setProperty("--tilt-y", `${(x - .5) * strength}deg`);
        card.style.setProperty("--depth-x", `${(x - .5) * 7}px`);
        card.style.setProperty("--depth-y", `${(y - .5) * 7}px`);
      });
    }, { passive: true });
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
  });
  const resetMagnets = [];
  $$(".actions a, .cmd, .rbx-cta").forEach((button) => {
    button.classList.add("magnetic");
    let frame = 0;
    let rect;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      rect = undefined;
      button.style.removeProperty("translate");
    };
    resetMagnets.push(reset);
    button.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || motionPreference.matches || event.pointerType === "touch") return;
      rect ||= button.getBoundingClientRect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) * .055));
        const y = Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * .055));
        button.style.translate = `${x}px ${y}px`;
      });
    }, { passive: true });
    button.addEventListener("pointerleave", reset);
    button.addEventListener("pointercancel", reset);
    button.addEventListener("blur", reset);
  });
  function resetPointerEffects() {
    resetCards.forEach((reset) => reset());
    resetMagnets.forEach((reset) => reset());
    cursor?.classList.remove("cursor-active");
    ["--pointer-x", "--pointer-y", "--scroll-drift"].forEach((property) => grid?.style.removeProperty(property));
  }
  motionPreference.addEventListener("change", resetPointerEffects);
  finePointer.addEventListener("change", resetPointerEffects);
  window.addEventListener("blur", resetPointerEffects);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
else initializePortfolio();
