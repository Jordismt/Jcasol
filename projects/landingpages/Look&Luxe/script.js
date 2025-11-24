(() => {
    'use strict';
  
    /* ===== Tema Oscuro / Claro ===== */
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const THEME_KEY = 'lookluxe-theme';
  
    function setTheme(isDark) {
      body.classList.toggle('dark', isDark);
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
  
    // Inicialización
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setTheme(saved === 'dark');
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  
    themeToggle?.addEventListener('click', () =>
      setTheme(!body.classList.contains('dark'))
    );
  
    /* ===== Contacto (Demo) ===== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name')?.value || 'cliente';
        const info = document.getElementById('contactInfo')?.value || 'tu contacto';
        alert(`Gracias, ${name}! Recibimos tu solicitud. Te contactaremos en ${info}.`);
        contactForm.reset();
      });
    }
  
    /* ===== Chatbot (Demo) ===== */
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose  = document.getElementById('chatClose');
    const chatForm   = document.getElementById('chatForm');
    const chatBody   = document.getElementById('chatBody');
    const chatInput  = document.getElementById('chatInput');
  
    function openChat() {
      chatWindow?.setAttribute('aria-hidden', 'false');
      chatToggle?.setAttribute('aria-expanded', 'true');
      chatInput?.focus();
    }
    function closeChat() {
      chatWindow?.setAttribute('aria-hidden', 'true');
      chatToggle?.setAttribute('aria-expanded', 'false');
      chatToggle?.focus();
    }
  
    chatToggle?.addEventListener('click', () => {
      const opened = chatWindow?.getAttribute('aria-hidden') === 'false';
      opened ? closeChat() : openChat();
    });
    chatClose?.addEventListener('click', closeChat);
  
    function botResponse(msg) {
      const text = msg.toLowerCase();
      if (text.includes('horario') || text.includes('ruta'))
        return 'Horario: Lun–Vie 10:00–20:00, Sáb 09:00–22:00.';
      if (text.includes('precio'))
        return 'Los precios varían según el servicio. Cortes desde 18 €.';
      if (text.includes('producto'))
        return 'Vendemos extensiones, pelucas y cremas profesionales.';
      return 'Gracias por tu mensaje. Consulta la sección de Servicios o Productos.';
    }
  
    chatForm?.addEventListener('submit', e => {
      e.preventDefault();
      const value = chatInput?.value.trim();
      if (!value) return;
  
      const userMsg = document.createElement('div');
      userMsg.className = 'msg user';
      userMsg.textContent = value;
      chatBody?.appendChild(userMsg);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
  
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'msg bot';
        botMsg.textContent = botResponse(value);
        chatBody?.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 700);
    });
  
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && chatWindow?.getAttribute('aria-hidden') === 'false') {
        closeChat();
      }
    });
  
    // Lazy-load imágenes
    document.querySelectorAll('img').forEach(img => (img.loading = 'lazy'));
  })();
  