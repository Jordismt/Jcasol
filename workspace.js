/* Decorative code field. Independent of navigation, forms and terminal startup. */
(() => {
  function initializeWorkspace() {
    const canvas = document.getElementById("codeRain");
    const toggle = document.getElementById("effectsToggle");
    if (!canvas || !toggle || canvas.dataset.initialized) return;
    canvas.dataset.initialized = "true";
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const root = document.documentElement;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const smallViewport = matchMedia("(max-width: 700px)");
    const storageKey = "jcasol.code-rain";
    let enabled = true;
    try { enabled = localStorage.getItem(storageKey) !== "off"; } catch { /* Storage is optional. */ }
    let width = 0;
    let height = 0;
    let streams = [];
    let frame = 0;
    let resizeFrame = 0;
    let previousTime = 0;
    const alphabet = "{}[]<>/\\;:=+_$&01constletasyncawaitreturnfunctiongit";
    const snippets = ["=>", "{ }", "</>", "0x1", "&&", "git", "fn()", "[ ]", "::", "λ", "++", "npm"];
    const random = (min, max) => min + Math.random() * (max - min);

    // Cache each trail as a small bitmap. A frame draws a few dozen sprites,
    // rather than painting hundreds of separate characters at full device DPR.
    function makeSprite(length, cyan) {
      const sprite = document.createElement("canvas");
      sprite.width = 24;
      sprite.height = length * 19 + 4;
      const ink = sprite.getContext("2d");
      ink.font = '12px "JetBrains Mono", monospace';
      ink.textAlign = "center";
      ink.textBaseline = "top";
      for (let line = 0; line < length; line++) {
        const alpha = Math.pow((line + 1) / length, 1.8) * .7;
        ink.fillStyle = line === length - 1 ? "rgba(164,224,255,.9)" : `rgba(${cyan ? "71,202,221" : "70,128,230"},${alpha})`;
        ink.fillText(alphabet[Math.floor(Math.random() * alphabet.length)], 12, line * 19);
      }
      return sprite;
    }
    function createStreams() {
      const spacing = smallViewport.matches ? 46 : 37;
      const count = Math.ceil(width / spacing);
      streams = Array.from({ length: count }, (_, index) => {
        const length = Math.round(random(9, smallViewport.matches ? 17 : 25));
        const sprite = makeSprite(length, index % 3 === 0);
        return {
          x: index * spacing + random(0, 12), y: random(-height, height),
          speed: random(23, 61), opacity: random(.35, .85), sprite,
          tag: index % 5 === 0 ? snippets[Math.floor(random(0, snippets.length))] : "",
        };
      });
    }
    function resize() {
      resizeFrame = 0;
      width = innerWidth;
      height = innerHeight;
      // CSS pixels are sufficient for an intentionally soft background texture.
      canvas.width = width;
      canvas.height = height;
      createStreams();
      if (!frame && enabled && !reducedMotion.matches && !document.hidden) start();
    }
    function draw(time) {
      frame = 0;
      if (!enabled || reducedMotion.matches || document.hidden) return;
      const elapsed = time - previousTime;
      const budget = smallViewport.matches ? 50 : 1000 / 30;
      if (previousTime && elapsed < budget) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const delta = previousTime ? Math.min(elapsed / 1000, .1) : 0;
      previousTime = time;
      context.clearRect(0, 0, width, height);
      context.font = '11px "JetBrains Mono", monospace';
      for (const stream of streams) {
        stream.y += stream.speed * delta;
        if (stream.y > height + 50) stream.y = -stream.sprite.height - random(20, 160);
        context.globalAlpha = stream.opacity;
        context.drawImage(stream.sprite, stream.x, stream.y);
        if (stream.tag) {
          context.fillStyle = "#8dddec";
          context.fillText(stream.tag, stream.x + 19, stream.y + stream.sprite.height - 3);
        }
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    function start() {
      if (frame || !width || !enabled || reducedMotion.matches || document.hidden) return;
      previousTime = 0;
      frame = requestAnimationFrame(draw);
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      context.clearRect(0, 0, width, height);
    }
    function sync() {
      const active = enabled && !reducedMotion.matches;
      toggle.hidden = false;
      toggle.disabled = reducedMotion.matches;
      toggle.setAttribute("aria-pressed", String(active));
      toggle.setAttribute("aria-label", reducedMotion.matches ? "Lluvia de código desactivada por tu preferencia de movimiento reducido" : active ? "Pausar lluvia de código" : "Activar lluvia de código");
      toggle.title = reducedMotion.matches ? "Tu sistema tiene activado reducir movimiento" : active ? "Pausar lluvia de código · comando matrix" : "Activar lluvia de código · comando matrix";
      toggle.querySelector(".fx-label").textContent = active ? "FX on" : "FX off";
      root.classList.toggle("ambient-paused", !active);
      canvas.hidden = !active;
      if (active && !document.hidden) start();
      else stop();
    }
    toggle.addEventListener("click", () => {
      enabled = !enabled;
      try { localStorage.setItem(storageKey, enabled ? "on" : "off"); } catch { /* No storage required. */ }
      sync();
    });
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else sync();
    });
    window.addEventListener("pagehide", stop);
    window.addEventListener("pageshow", sync);
    window.addEventListener("resize", () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(resize);
    }, { passive: true });
    document.fonts?.ready.then(() => { createStreams(); });
    resize();
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeWorkspace, { once: true });
  else initializeWorkspace();
})();

/* V4 enhancements are independent: the portfolio remains readable without them. */
(() => {
  function enhanceWorkspace() {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const select = (selector) => document.querySelector(selector);
    const all = (selector) => [...document.querySelectorAll(selector)];
    const feedbackAnimations = new Set();
    function transition(element, frames, duration = 240) {
      if (reduced.matches || !element?.animate) return;
      const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.16,1,.3,1)' });
      feedbackAnimations.add(animation);
      animation.finished.then(() => feedbackAnimations.delete(animation), () => feedbackAnimations.delete(animation));
    }
    function cancelFeedback() { feedbackAnimations.forEach((animation) => animation.cancel()); }
    reduced.addEventListener('change', () => { if (reduced.matches) cancelFeedback(); });
    window.addEventListener('pagehide', cancelFeedback);

    // Keep cutout and shell together on phones, after the main call to action.
    const profile = select('.terminalWrap');
    const profileHome = document.createComment('developer-profile desktop position');
    profile?.before(profileHome);
    const phoneLayout = matchMedia('(max-width: 560px)');
    function placeProfile() {
      if (!profile) return;
      if (phoneLayout.matches) select('.hero-builds')?.after(profile);
      else profileHome.after(profile);
    }
    placeProfile();
    phoneLayout.addEventListener('change', placeProfile);

    // A compact personal readme: original biography and manifest stay visible.
    const profileTabs = all('[data-profile-view]');
    const profilePanel = select('#profileView');
    const profileViews = {
      person: {
        path: 'jordi / visión-de-producto', title: 'Conectar todas las piezas.',
        layers: ['Interfaz', 'API', 'Datos'],
        icons: ['panels-top-left', 'braces', 'database'],
        text: 'Lo que ves en pantalla y lo que ocurre detrás, dentro de un mismo producto.',
        link: 'Mi trayectoria', href: '#journey',
      },
      products: {
        path: 'jordi / productos-propios', title: 'Construidos de principio a fin.',
        layers: ['Diseño', 'Backend', 'Producción'],
        icons: ['pen-tool', 'server', 'rocket'],
        text: 'Resbix y Carteliax: dos SaaS desarrollados y lanzados en solitario en 2026.',
        link: 'Explorar los casos de estudio', href: '#case-studies',
      },
      next: {
        path: 'jordi / siguiente-paso', title: 'Aportar una visión de conjunto.',
        layers: ['Equipo', 'Producto', 'Freelance'],
        icons: ['users-round', 'layers-3', 'handshake'],
        text: 'Abierto a equipos de desarrollo y proyectos freelance con necesidades concretas.',
        link: 'Hablemos', href: '#contact',
      },
    };
    function setProfileView(key, userInitiated = false) {
      const view = profileViews[key];
      if (!profilePanel || !view) return;
      profileTabs.forEach((button) => {
        const active = button.dataset.profileView === key;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      profilePanel.setAttribute('aria-labelledby', `profile-tab-${key}`);
      profilePanel.dataset.view = key;
      select('#profileViewPath').textContent = view.path;
      select('#profileViewTitle').textContent = view.title;
      select('#profileViewText').textContent = view.text;
      all('.profile-node-label').forEach((label, index) => { label.textContent = view.layers[index]; });
      select('.profile-build-path').setAttribute('aria-label', key === 'next' ? 'Formas de colaborar' : 'Capas que desarrollo');
      if (userInitiated) {
        all('.profile-node-icon').forEach((holder, index) => {
          const icon = document.createElement('i');
          icon.dataset.lucide = view.icons[index];
          icon.setAttribute('aria-hidden', 'true');
          holder.replaceChildren(icon);
        });
        refreshIcons();
      }
      all('.profile-build-path > svg').forEach((arrow) => { arrow.style.visibility = key === 'next' ? 'hidden' : ''; });
      const link = select('#profileViewLink');
      link.setAttribute('href', view.href);
      link.firstChild.textContent = `${view.link} `;
      select('#profileViewStatus').textContent = `profile.yaml · ${key === 'person' ? 'perfil' : key === 'products' ? 'productos' : 'colaborar'}`;
      if (userInitiated) transition(profilePanel, [{ opacity: .4, translate: '0 4px' }, { opacity: 1, translate: '0 0' }], 220);
    }
    profileTabs.forEach((button, index) => {
      button.addEventListener('click', () => setProfileView(button.dataset.profileView, true));
      button.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % profileTabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + profileTabs.length) % profileTabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = profileTabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        setProfileView(profileTabs[next].dataset.profileView, true);
        profileTabs[next].focus({ preventScroll: true });
      });
    });
    if (profilePanel && profileTabs.length) {
      setProfileView('person');
      select('.profile-views').hidden = false;
      profilePanel.hidden = false;
    }

    // Use the original project cards, never cloned previews or duplicated copy.
    const explorer = select('.project-explorer');
    const filters = all('[data-filter]');
    const groups = [
      { category: 'saas', nodes: all('#built-products, #projects > .rbx-card, #projects > .cartaliax-card, #projects > .product-pair'), count: 3 },
      { category: 'client', nodes: all('#client-work, #projects > .clientGrid'), count: 2 },
      { category: 'apps', nodes: all('#project-collection, #projects > .projectGrid'), count: 6 },
    ];
    function filterProjects(category, userInitiated = false) {
      let count = 0;
      groups.forEach((group) => {
        const visible = category === 'all' || category === group.category;
        group.nodes.forEach((node) => { node.hidden = !visible; });
        if (visible) count += group.count;
      });
      filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      const status = select('#explorerCount');
      if (status) status.textContent = `${count} proyectos`;
      if (userInitiated && !reduced.matches) {
        groups.filter((group) => category === 'all' || group.category === category).forEach((group) => {
          group.nodes.filter((node) => !node.classList.contains('work-group')).forEach((node) => {
            transition(node, [{ opacity: .4, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], 260);
          });
        });
      }
    }
    filters.forEach((button) => button.addEventListener('click', () => filterProjects(button.dataset.filter, true)));
    if (explorer) explorer.hidden = false;
    // Any incoming project anchor must be visible before the original navigation runs.
    function exposeTarget(hash) {
      if (!hash?.startsWith('#')) return;
      const target = document.getElementById(hash.slice(1));
      if (target?.closest('#projects [hidden]')) filterProjects('all');
    }
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (link) exposeTarget(link.getAttribute('href'));
    }, true);
    window.addEventListener('popstate', () => exposeTarget(location.hash), true);
    window.addEventListener('hashchange', () => exposeTarget(location.hash));

    // Explain the existing system diagrams with real, already documented decisions.
    const architectureCopy = [
      [
        'El panel organiza clientes, reservas, servicios y configuración según el contexto de cada empresa.',
        'Node.js y Express conectan la lógica del producto con Groq, WhatsApp mediante Evolution API y las suscripciones de Stripe.',
        'Supabase gestiona autenticación y aislamiento de datos. Las políticas RLS mantienen separado el contexto de cada negocio.',
      ],
      [
        'Nuxt, Vue 3 y Tailwind CSS dan forma al panel que permite gestionar cartas sin conocimientos técnicos.',
        'Node.js, Express y Supabase conectan negocios, cartas, categorías, productos, imágenes y disponibilidad.',
        'El cliente accede a la carta actualizada desde el mismo QR. Cambiar contenido o presentación no exige reimprimirlo.',
      ],
    ];
    all('.case-system').forEach((system, systemIndex) => {
      const detail = document.createElement('p');
      detail.id = `architecture-detail-${systemIndex}`;
      detail.className = 'architecture-detail';
      detail.setAttribute('role', 'status');
      detail.setAttribute('aria-live', 'polite');
      const flow = system.querySelector('.system-flow');
      if (!flow || !architectureCopy[systemIndex]) return;
      flow.after(detail);
      const buttons = [...flow.children].map((item, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'architecture-select';
        button.setAttribute('aria-pressed', String(index === 0));
        button.setAttribute('aria-controls', detail.id);
        button.append(...item.childNodes);
        item.append(button);
        button.addEventListener('click', () => {
          buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
          detail.textContent = architectureCopy[systemIndex][index];
          transition(detail, [{ opacity: .3 }, { opacity: 1 }], 220);
        });
        return button;
      });
      detail.textContent = architectureCopy[systemIndex][0];
    });

    // A single bounded conversation, paused offscreen and explicitly replayable.
    const visual = select('.rbx-visual');
    const replay = select('#replayConversation');
    if (visual && replay) {
      const booking = document.createElement('div');
      booking.className = 'rbx-booking';
      const icon = document.createElement('i');
      icon.dataset.lucide = 'calendar-check';
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = 'Consulta → disponibilidad → reserva';
      const note = document.createElement('small');
      note.textContent = 'Representación del proceso · ejemplo ilustrativo';
      copy.append(title, note);
      booking.append(icon, copy);
      visual.querySelector('.rbx-chat-content').append(booking);
      visual.classList.add('demo-enhanced');
      replay.hidden = false;
      let animations = [];
      let visible = false;
      let started = false;
      let playing = false;
      function settle() {
        playing = false;
        animations.forEach((animation) => animation.cancel());
        animations = [];
        visual.classList.remove('is-playing');
        replay.disabled = false;
        all('[data-reservation-step]').forEach((step) => { step.dataset.active = 'true'; });
      }
      function synchronize() {
        animations.forEach((animation) => {
          if (document.hidden || !visible) animation.pause();
          else animation.play();
        });
      }
      function play() {
        settle();
        if (reduced.matches || !booking.animate) return;
        playing = true;
        visual.classList.add('is-playing');
        replay.disabled = true;
        all('[data-reservation-step]').forEach((step) => { step.dataset.active = 'false'; });
        const messages = [...visual.querySelectorAll('.rbx-bubble'), booking];
        animations = messages.map((message, index) => {
          const animation = message.animate([
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 480, delay: index * 850, fill: 'backwards', easing: 'cubic-bezier(.16,1,.3,1)' });
          animation.finished.then(() => {
            const step = select(`[data-reservation-step="${Math.min(index, 2)}"]`);
            if (step) step.dataset.active = 'true';
          }, () => {});
          return animation;
        });
        Promise.all(animations.map((animation) => animation.finished)).then(settle, () => {});
        synchronize();
      }
      replay.addEventListener('click', play);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !started) { started = true; play(); }
          else if (playing) synchronize();
        }, { threshold: .15 });
        observer.observe(visual);
      } else { visible = true; started = true; settle(); }
      document.addEventListener('visibilitychange', synchronize);
      reduced.addEventListener('change', () => { if (reduced.matches) settle(); });
      window.addEventListener('pagehide', settle);
    }

    // The permanent QR is the point: content changes while access stays stable.
    const menuSteps = all('button[data-menu-step]');
    const menuStage = select('.cartaliax-stage');
    const menuText = select('#menuJourneyText');
    const menuCopy = [
      'El negocio gestiona categorías, productos y disponibilidad desde su panel.',
      'Un QR permanente conecta la carta con el cliente. Las actualizaciones no requieren reimprimirlo.',
      'El cliente abre la carta digital con el contenido actualizado, sus idiomas y su personalización visual.',
    ];
    menuSteps.forEach((button) => button.addEventListener('click', () => {
      menuSteps.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      menuStage.dataset.menuStep = button.dataset.menuStep;
      menuText.textContent = menuCopy[Number(button.dataset.menuStep)];
      transition(menuText, [{ opacity: .2, translate: '0 4px' }, { opacity: 1, translate: '0 0' }]);
    }));
    const journey = select('.menu-journey');
    if (journey) journey.hidden = false;
    if (menuStage) menuStage.dataset.menuStep = '0';

    const suggestions = select('.terminal-suggestions');
    if (suggestions) suggestions.hidden = false;
    all('[data-command]').forEach((button) => button.addEventListener('click', () => {
      const input = select('#termInput');
      const form = select('#termForm');
      if (!input || !form) return;
      input.value = button.dataset.command;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      form.requestSubmit();
      input.focus({ preventScroll: true });
    }));

    // Portrait depth shares the input semantics of the existing pointer effects.
    const portrait = select('.portrait-viewport');
    const portraitInput = select('.hero');
    let frame = 0;
    let x = 0;
    let y = 0;
    function resetPortrait() {
      cancelAnimationFrame(frame);
      frame = 0;
      portrait?.style.removeProperty('--portrait-x');
      portrait?.style.removeProperty('--portrait-y');
    }
    portraitInput?.addEventListener('pointermove', (event) => {
      if (!pointer.matches || reduced.matches || event.pointerType === 'touch') return;
      const bounds = portraitInput.getBoundingClientRect();
      x = ((event.clientX - bounds.left) / bounds.width - .5) * 7;
      y = ((event.clientY - bounds.top) / bounds.height - .5) * 5;
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        portrait.style.setProperty('--portrait-x', `${x}px`);
        portrait.style.setProperty('--portrait-y', `${y}px`);
      });
    }, { passive: true });
    portraitInput?.addEventListener('pointerleave', resetPortrait);
    portraitInput?.addEventListener('pointercancel', resetPortrait);
    window.addEventListener('blur', resetPortrait);
    reduced.addEventListener('change', resetPortrait);
    pointer.addEventListener('change', resetPortrait);
    // Icon script can arrive before or after these progressive controls.
    function refreshIcons() { window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true', focusable: 'false' } }); }
    refreshIcons();
    select('#iconScript')?.addEventListener('load', refreshIcons, { once: true });
    root.dataset.workspaceEnhanced = 'true';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceWorkspace, { once: true });
  else enhanceWorkspace();
})();
