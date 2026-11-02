/* Run with an existing Playwright installation; no production dependency added.
   PLAYWRIGHT_MODULE=/path/to/playwright node tests/portfolio-check.cjs
   Serve the repository first: python3 -m http.server 4173 --bind 127.0.0.1 */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173';
const output = process.env.PORTFOLIO_ARTIFACTS || '/tmp/jcasol-v4';
const results = [];
const errors = [];
const failedResources = [];
fs.mkdirSync(output, { recursive: true });
async function check(name, fn) {
  try { const evidence = await fn(); results.push({ name, passed: true, evidence }); }
  catch (error) { results.push({ name, passed: false, error: error.message }); }
}
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
 const page = await context.newPage();
 page.on('pageerror', error => errors.push(error.message));
 page.on('requestfailed', request => failedResources.push({ url: request.url(), failure: request.failure()?.errorText }));
 await page.goto(base, { waitUntil: 'networkidle' });
 await page.waitForFunction(() => document.documentElement.dataset.workspaceEnhanced === 'true');
 await page.waitForTimeout(1800);
 await check('Initial position and boot failsafe', async () => {
  assert.equal(await page.evaluate(() => scrollY), 0);
  assert.equal(await page.locator('#boot').count(), 0);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflowY === 'hidden'), false);
  return 'scrollY=0; boot removed; body remains scrollable';
 });
 await check('Preserve original sections, project names, URLs and important prose', async () => {
  const original = execFileSync('git', ['show', 'HEAD:index.html'], { encoding: 'utf8' });
  const currentSource = fs.readFileSync('index.html', 'utf8');
  const evidence = await page.evaluate(({ original, currentSource }) => {
   const old = new DOMParser().parseFromString(original, 'text/html');
   const currentSourceDocument = new DOMParser().parseFromString(currentSource, 'text/html');
   const normalize = text => text.replace(/\s+/g, ' ').trim();
   const missingIDs = [...old.querySelectorAll('[id]')].map(e => e.id).filter(id => !document.getElementById(id) && !['boot', 'bootlines'].includes(id));
   const missingLinks = [...old.querySelectorAll('a[href]')].map(e => e.getAttribute('href')).filter(href => ![...document.querySelectorAll('a[href]')].some(e => e.getAttribute('href') === href));
   const missingProse = [...old.querySelectorAll('main p')].map(e => normalize(e.textContent)).filter(text => text && ![...currentSourceDocument.querySelectorAll('main p')].some(e => normalize(e.textContent) === text));
   const headings = [...document.querySelectorAll('#projects h3')].map(e => e.textContent);
   const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
   return { missingIDs, missingLinks, missingProse, headings, duplicateIDs: ids.filter((id, i) => ids.indexOf(id) !== i) };
  }, { original, currentSource });
  assert.deepEqual(evidence.missingIDs, []); assert.deepEqual(evidence.missingLinks, []); assert.deepEqual(evidence.missingProse, []); assert.deepEqual(evidence.duplicateIDs, []); assert.equal(evidence.headings.length, 11);
  return evidence;
 });
 await check('Local paths, anchors, CV and favicon resolve', async () => {
  const links = await page.evaluate(() => [...document.querySelectorAll('[href],[src]')].flatMap(e => ['href', 'src'].map(attr => e.getAttribute(attr)).filter(Boolean)));
  const missing = [];
  for (const link of links) {
   if (link.startsWith('#')) { if (!await page.locator(`[id="${link.slice(1)}"]`).count()) missing.push(link); }
   else if (link.startsWith('./')) { if (!fs.existsSync(path.resolve(process.cwd(), link.split('#')[0]))) missing.push(link); }
  }
  assert.deepEqual(missing, []);
  for (const route of ['/docs/Jcasol_CV.pdf', '/img/favicon-32.png', '/assets/portrait-jcasol.webp', '/assets/portrait-jcasol-cutout.webp']) assert.equal((await page.request.get(base + route)).status(), 200);
  return `${links.length} references inspected; CV, favicon and portrait HTTP 200`;
 });
 await check('Responsive layout at all requested widths', async () => {
  const sizes = [];
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
   await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
   await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
   await page.waitForTimeout(180);
   const metrics = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, initialScroll: scrollY, photoWidth: document.querySelector('.developer-profile').getBoundingClientRect().width }));
   sizes.push(metrics);
   await page.screenshot({ path: path.join(output, `validated-${width}.png`) });
   assert.ok(metrics.document <= width, JSON.stringify(metrics));
   assert.equal(metrics.initialScroll, 0);
  }
  return sizes;
 });
 await page.setViewportSize({ width: 1440, height: 1000 });
 await check('Project explorer filters original nodes and incoming anchors restore visibility', async () => {
  await page.locator('[data-filter="client"]').click();
  assert.equal(await page.locator('#explorerCount').textContent(), '2 proyectos');
  assert.equal(await page.locator('.rbx-card').isVisible(), false);
  assert.equal(await page.locator('.clientGrid').isVisible(), true);
  assert.equal(await page.locator('#projects h3').count(), 11);
  await page.locator('.work-directory a[href="#built-products"]').click();
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.rbx-card').isVisible(), true);
  assert.equal(await page.locator('[data-filter="all"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-filter="apps"]').click();
  assert.equal(await page.locator('#explorerCount').textContent(), '6 proyectos');
  assert.equal(await page.locator('.projectGrid').isVisible(), true);
  await page.locator('[data-filter="all"]').click();
  return '11 cards retained; filters 2/6/11; anchor restores original card';
 });
 await check('Ctrl+K search, keyboard selection, escape and focus return', async () => {
  await page.locator('#cmdBtn').focus();
  await page.keyboard.press('Control+k');
  await page.locator('#paletteInput').fill('terminal');
  assert.equal(await page.locator('.paletteBox > a:visible').count(), 1);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  assert.equal(new URL(page.url()).hash, '#terminal');
  assert.equal(await page.locator('#palette').getAttribute('aria-hidden'), 'true');
  await page.locator('#cmdBtn').click();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => document.querySelector('#palette').contains(document.activeElement)), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'cmdBtn');
  assert.equal(await page.locator('main').evaluate(e => e.inert), false);
  return 'search+Enter, focus trap, Escape, focus restored and main interactive';
 });
 await check('Terminal commands, Tab completion, history, errors, clear and quick actions', async () => {
  const input = page.locator('#termInput');
  await input.fill('cof'); await input.press('Tab'); assert.equal(await input.inputValue(), 'coffee');
  await input.press('Enter'); assert.match(await page.locator('#termHistory').textContent(), /brew/);
  await input.fill('pwd'); await input.press('Enter');
  await input.press('ArrowUp'); assert.equal(await input.inputValue(), 'pwd');
  await input.press('ArrowUp'); assert.equal(await input.inputValue(), 'coffee');
  await input.fill('<img src=x onerror=alert(1)>'); await input.press('Enter');
  assert.match(await page.locator('#terminalFeedback').textContent(), /127/);
  assert.equal(await page.locator('#termHistory img').count(), 0);
  await input.press('Control+l'); assert.equal(await page.locator('#termHistory').textContent(), '');
  await page.locator('[data-command="git log"]').click(); assert.match(await page.locator('#termHistory').textContent(), /2026/);
  await input.fill('clear'); await input.press('Enter'); assert.equal(await page.locator('#termHistory').textContent(), '');
  return 'completion, draft/history, safe output, exit 127, Ctrl+L, clear and quick commands';
 });
 await check('Portrait depth, FX toggle and live motion preference', async () => {
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.mouse.move(350, 300); await page.waitForTimeout(70);
  assert.notEqual(await page.locator('.portrait-viewport').evaluate(e => e.style.getPropertyValue('--portrait-x')), '');
  await page.locator('#effectsToggle').click(); assert.equal(await page.locator('#codeRain').isVisible(), false);
  const input = page.locator('#termInput'); await input.fill('matrix'); await input.press('Enter');
  assert.equal(await page.locator('#codeRain').isVisible(), true);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(100);
  assert.equal(await page.locator('#codeRain').isVisible(), false);
  assert.equal(await page.locator('.portrait-viewport').evaluate(e => e.style.getPropertyValue('--portrait-x')), '');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return 'event-driven portrait offset, FX pause, matrix resume and live reduced-motion reset';
 });
 await check('IDE keyboard tabs, syntax highlighting and active line', async () => {
  const front = page.locator('[data-tab="front"]'); await front.focus(); await front.press('ArrowDown');
  assert.equal(await page.locator('[data-tab="back"]').getAttribute('aria-selected'), 'true');
  assert.match(await page.locator('#fileName').textContent(), /backend.js/);
  assert.ok(await page.locator('#codePanel .syntax-string').count() > 0);
  await page.locator('#codePanel').focus(); await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#codePanel .is-active').count(), 1);
  return 'roving tabs, language change, highlighted tokens and keyboard active line';
 });
 await check('Architecture layers and Carteliax route work with keyboard', async () => {
  const api = page.locator('#case-resbix .architecture-select').nth(1); await api.focus(); await api.press('Enter');
  assert.equal(await api.getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('#architecture-detail-0').textContent(), /Evolution API/);
  const qr = page.locator('button[data-menu-step="1"]'); await qr.focus(); await qr.press('Enter');
  assert.match(await page.locator('#menuJourneyText').textContent(), /reimprimirlo/);
  assert.equal(await page.locator('.cartaliax-stage').getAttribute('data-menu-step'), '1');
  return 'Express/integrations layer and permanent-QR explanation selected by Enter';
 });
 await check('Resbix demo completes, stops and replays', async () => {
  await page.locator('.rbx-visual').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('#replayConversation').disabled, { timeout: 6000 });
  await page.locator('#replayConversation').click();
  assert.equal(await page.locator('#replayConversation').isDisabled(), true);
  await page.waitForFunction(() => !document.querySelector('#replayConversation').disabled, { timeout: 6000 });
  assert.equal(await page.locator('[data-reservation-step][data-active="true"]').count(), 3);
  assert.equal(await page.locator('.rbx-booking').isVisible(), true);
  return 'bounded sequence completed, three steps active, replay restored';
 });
 await check('Anchor navigation and browser Back restore intended sections', async () => {
  await page.locator('.brand').click(); await page.waitForTimeout(500);
  await page.locator('.hero .primary').click(); await page.waitForTimeout(650);
  assert.equal(new URL(page.url()).hash, '#projects');
  await page.goBack(); await page.waitForTimeout(200);
  assert.equal(new URL(page.url()).hash, '#top');
  assert.equal(await page.evaluate(() => scrollY), 0);
  await page.goto(base + '/#case-carteliax', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const top = await page.locator('#case-carteliax').evaluate(e => e.getBoundingClientRect().top);
  assert.ok(top >= 0 && top < 160, `anchor top ${top}`);
  return 'projects → Back → top=0; direct case-study hash preserved after boot';
 });
 await check('EmailJS integration: success, error and retry without sending mail', async () => {
  await page.evaluate(() => { window.__emailCalls = []; window.emailjs = { init() {}, async sendForm(service, template, form) { window.__emailCalls.push({ service, template, name: form.user_name.value }); } }; });
  async function fill() { await page.locator('[name="user_name"]').fill('Prueba local'); await page.locator('[name="user_email"]').fill('test@example.com'); await page.locator('[name="message"]').fill('Validación local sin envío real'); }
  await fill(); await page.locator('#contactForm button[type="submit"]').click();
  assert.equal(await page.locator('#contactForm').getAttribute('data-state'), 'success');
  const calls = await page.evaluate(() => window.__emailCalls); assert.equal(calls[0].service, 'service_l69lpba'); assert.equal(calls[0].template, 'template_6kzyzx2');
  await page.evaluate(() => { window.emailjs.sendForm = async () => { throw new Error('Local simulated rejection'); }; });
  await fill(); await page.locator('#contactForm button[type="submit"]').click();
  assert.equal(await page.locator('#contactForm').getAttribute('data-state'), 'error');
  assert.equal(await page.locator('[name="user_name"]').inputValue(), 'Prueba local');
  await page.evaluate(() => { window.emailjs = undefined; });
  await page.locator('#contactForm button[type="submit"]').click();
  assert.match(await page.locator('#successMessage').textContent(), /No se pudo cargar/);
  return 'original service/template; simulated success/error/unavailable SDK; error preserves input; no mail sent';
 });
 await check('Reduced motion disables boot, rain and spatial animations', async () => {
  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const p = await reduced.newPage(); await p.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await p.locator('#boot').count(), 0); assert.equal(await p.locator('#codeRain').isVisible(), false);
  assert.equal(await p.locator('#effectsToggle').isDisabled(), true);
  assert.equal(await p.locator('.developer-profile').evaluate(e => getComputedStyle(e).transform), 'none');
  assert.equal(await p.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
  await p.screenshot({ path: path.join(output, 'reduced-motion.png') }); await reduced.close();
  return 'boot absent, rain hidden, control disabled, no running animations';
 });
 await check('No JavaScript: content, portrait, CV, anchors and email remain visible', async () => {
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await nojs.newPage(); await p.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await p.locator('#boot').isVisible(), false); assert.equal(await p.locator('.hero-title').isVisible(), true);
  assert.equal(await p.locator('.developer-profile img').isVisible(), true); assert.equal(await p.locator('#projects h3').count(), 11);
  assert.equal(await p.locator('.project-explorer').isVisible(), false); assert.equal(await p.locator('#contactForm').isVisible(), false);
  assert.equal(await p.locator('.no-js-contact a').isVisible(), true);
  await p.screenshot({ path: path.join(output, 'no-js.png') }); await nojs.close();
  return 'all projects and fallback contact available, enhancement-only controls hidden';
 });
 await check('Touch input: navigation, filters and terminal suggestions', async () => {
  const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const p = await touch.newPage(); await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(1600);
  await p.locator('#cmdBtn').tap(); await p.locator('#paletteInput').fill('terminal'); await p.locator('.paletteBox > a:visible').tap(); await p.waitForTimeout(700);
  await p.locator('[data-command="help"]').tap(); assert.match(await p.locator('#termHistory').textContent(), /architecture/);
  await p.locator('[data-filter="saas"]').tap(); assert.equal(await p.locator('#explorerCount').textContent(), '3 proyectos');
  assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
  await touch.close(); return 'Chromium synthesized touch: palette, terminal commands, SaaS filter, no overflow';
 });
 await check('No uncaught JavaScript exceptions', async () => { assert.deepEqual(errors, []); return errors; });
 const report = { testedAt: new Date().toISOString(), engine: await browser.version(), results, errors, failedResources };
 fs.writeFileSync(path.join(output, 'validation-results.json'), JSON.stringify(report, null, 2));
 console.log(JSON.stringify(report, null, 2));
 await browser.close(); if (results.some(result => !result.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
