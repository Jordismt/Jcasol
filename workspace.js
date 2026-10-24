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
