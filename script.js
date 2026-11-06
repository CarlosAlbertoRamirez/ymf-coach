(function () {
  "use strict";

  /* ---------- Fondo de estrellas ---------- */
  var canvas = document.getElementById("stars");
  var ctx = canvas.getContext("2d");
  var stars = [];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var n = Math.round((canvas.width * canvas.height) / 9000);
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.7 + 0.2,
        s: Math.random() * 0.015 + 0.004,
        c: Math.random() < 0.12 ? "255,43,209" : Math.random() < 0.2 ? "25,227,255" : "255,255,255"
      });
    }
    draw(0);
  }
  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * s.s + i);
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + s.c + "," + (s.a * tw).toFixed(3) + ")";
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  burger.addEventListener("click", function () {
    var on = menu.classList.toggle("on");
    burger.setAttribute("aria-expanded", on ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("on");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Modismo del día ---------- */
  var idioms = [
    { w: "¿Qué onda?", m: "Saludo informal: “¿qué tal?”, “¿qué pasa?”.", e: "“¿Qué onda, cómo estás?”" },
    { w: "Chido", m: "Algo muy bueno o agradable: “genial”.", e: "“¡Qué chido está tu playera!”" },
    { w: "Padre", m: "Algo excelente. “Está padre” = “está genial”.", e: "“Qué padre que vengas a la fiesta.”" },
    { w: "No manches", m: "Expresa sorpresa o incredulidad: “no puede ser”.", e: "“¡No manches, ganamos!”" },
    { w: "Neta", m: "La verdad. “¿Neta?” = “¿en serio?”.", e: "“¿Neta te mudas a México?”" },
    { w: "Ahorita", m: "Ahora mismo, o en un rato. Depende del contexto y del tono.", e: "“Ahorita te llamo.”" },
    { w: "Chamba", m: "Trabajo.", e: "“Mañana tengo mucha chamba.”" },
    { w: "Aventón", m: "Que alguien te lleve en su coche: “un aventón”.", e: "“¿Me das un aventón al centro?”" },
    { w: "Híjole", m: "Interjección para sorpresa, preocupación o pena.", e: "“Híjole, se me olvidó la cartera.”" },
    { w: "Échale ganas", m: "Ánimo: “esfuérzate”, “tú puedes”.", e: "“Échale ganas a tu examen.”" }
  ];
  var idx = Math.floor(Date.now() / 86400000) % idioms.length;
  function showIdiom() {
    var it = idioms[idx];
    document.getElementById("idWord").textContent = it.w;
    document.getElementById("idMean").textContent = it.m;
    document.getElementById("idEx").textContent = it.e;
  }
  document.getElementById("idNext").addEventListener("click", function () {
    idx = (idx + 1) % idioms.length;
    showIdiom();
  });
  showIdiom();

  /* ---------- Catálogo y carrito ---------- */
  var products = [
    {
      id: "explorador", type: "App · YMF Coach", name: "Explorador",
      desc: "Prueba la experiencia y crea el hábito.",
      items: ["Modismo del día", "Reto diario corto", "Acceso a la comunidad"],
      price: 0, per: "gratis"
    },
    {
      id: "coach", type: "App · YMF Coach", name: "Coach Mensual", featured: true, badge: "Más popular",
      desc: "Práctica ilimitada con tu Coach de IA.",
      items: ["Conversación con IA sin límite", "Corrección de acento", "Rachas, retos e insignias", "Comunidad de usuarios activos"],
      price: 9.99, per: "/ mes"
    },
    {
      id: "tutoria", type: "Servicio · Clases", name: "Tutoría 1 a 1",
      desc: "Clase con un hablante nativo de México.",
      items: ["Español mexicano (A1 a C1)", "Plan según tu objetivo", "Retroalimentación personal"],
      price: 20, per: "/ clase"
    },
    {
      id: "paquete", type: "Paquete", name: "Coach + 4 clases",
      desc: "App y práctica con una persona, juntas.",
      items: ["Coach Mensual incluido", "4 tutorías 1 a 1", "Seguimiento de tu avance"],
      price: 79, per: "/ mes"
    }
  ];

  var cart = [];
  try {
    var saved = JSON.parse(localStorage.getItem("ymf_cart") || "[]");
    if (Array.isArray(saved)) cart = saved.filter(function (id) { return products.some(function (p) { return p.id === id; }); });
  } catch (e) { cart = []; }

  function persist() { try { localStorage.setItem("ymf_cart", JSON.stringify(cart)); } catch (e) {} }
  function money(n) { return "USD " + n.toFixed(2); }

  var catalog = document.getElementById("catalog");
  products.forEach(function (p) {
    var el = document.createElement("article");
    el.className = "product" + (p.featured ? " featured" : "");
    var lis = p.items.map(function (i) { return "<li>" + i + "</li>"; }).join("");
    el.innerHTML =
      (p.badge ? '<span class="badge">' + p.badge + "</span>" : "") +
      '<span class="type">' + p.type + "</span>" +
      "<h3>" + p.name + "</h3><p>" + p.desc + "</p><ul>" + lis + "</ul>" +
      '<div class="price">' + (p.price === 0 ? "Gratis" : money(p.price).replace("USD ", "$")) + " <small>" + (p.price === 0 ? "" : p.per) + "</small></div>" +
      '<button class="btn primary" type="button" data-id="' + p.id + '">Agregar al carrito</button>';
    catalog.appendChild(el);
  });

  catalog.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-id]");
    if (!b) return;
    var id = b.getAttribute("data-id");
    if (cart.indexOf(id) === -1) cart.push(id);
    persist();
    render();
    b.classList.add("added");
    b.textContent = "✓ Agregado";
    setTimeout(function () { b.classList.remove("added"); b.textContent = "Agregar al carrito"; }, 1400);
  });

  var drawer = document.getElementById("drawer");
  var scrim = document.getElementById("scrim");
  var list = document.getElementById("cartList");
  var note = document.getElementById("demoNote");
  var NOTE = "Demostración: no se solicita ni procesa ningún dato de pago.";

  function openCart() { drawer.classList.add("on"); scrim.classList.add("on"); drawer.setAttribute("aria-hidden", "false"); }
  function closeCart() { drawer.classList.remove("on"); scrim.classList.remove("on"); drawer.setAttribute("aria-hidden", "true"); }
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

  function render() {
    document.getElementById("cartCount").textContent = cart.length;
    list.innerHTML = "";
    var total = 0;
    if (!cart.length) {
      list.innerHTML = '<li class="empty">Tu carrito está vacío.</li>';
    }
    cart.forEach(function (id) {
      var p = products.filter(function (x) { return x.id === id; })[0];
      total += p.price;
      var li = document.createElement("li");
      li.innerHTML = "<span><b>" + p.name + "</b><br><small>" + (p.price === 0 ? "Gratis" : money(p.price) + " " + p.per) + '</small></span><button type="button" data-rm="' + id + '" aria-label="Quitar ' + p.name + '">Quitar</button>';
      list.appendChild(li);
    });
    document.getElementById("cartTotal").textContent = money(total);
    note.textContent = NOTE;
    note.classList.remove("ok");
  }
  list.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-rm]");
    if (!b) return;
    cart = cart.filter(function (id) { return id !== b.getAttribute("data-rm"); });
    persist();
    render();
  });
  document.getElementById("checkout").addEventListener("click", function () {
    if (!cart.length) { note.textContent = "Agrega al menos un producto para continuar."; note.classList.remove("ok"); return; }
    cart = [];
    persist();
    render();
    note.textContent = "¡Gracias! Esto es una demostración: no se realizó ningún cobro.";
    note.classList.add("ok");
  });
  render();

  /* ---------- Formulario de contacto (abre el correo del visitante) ---------- */
  var form = document.getElementById("form");
  var msg = document.getElementById("formMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(form);
    var nombre = (f.get("nombre") || "").toString().trim();
    var correo = (f.get("correo") || "").toString().trim();
    var texto = (f.get("mensaje") || "").toString().trim();
    var okMail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo);
    if (!nombre || !okMail || !texto) {
      msg.className = "form-msg err";
      msg.textContent = "Completa tu nombre, un correo válido y tu mensaje.";
      return;
    }
    var subject = encodeURIComponent("Contacto desde YMF Coach: " + nombre);
    var body = encodeURIComponent(texto + "\n\n— " + nombre + " (" + correo + ")");
    msg.className = "form-msg";
    msg.textContent = "Abriendo tu aplicación de correo…";
    window.location.href = "mailto:urmexicanfriend@gmail.com?subject=" + subject + "&body=" + body;
  });
})();
