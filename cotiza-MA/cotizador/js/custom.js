// ===== Utilidades =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const fmt = (n, currency) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(n || 0);

// ===== Estado =====
const STORAGE_KEY = "cotizacion-sr-v1";
const tbody = $("#tabla tbody");
const subtotalEl = $("#subtotal");
const ivaMontoEl = $("#ivaMonto");
const totalEl = $("#total");
const anticipoMontoEl = $("#anticipoMonto");
const restanteEl = $("#restante");

// ===== Filas =====
function nuevaFila(data = { qty: 1, desc: "", price: 0 }) {
  const id = crypto.randomUUID();
  const tr = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td><input type="number" min="0" step="1" class="form-control form-control-sm qty" value="${data.qty}"></td>
    <td><input type="text" class="form-control form-control-sm desc" placeholder="Descripción" value="${data.desc}"></td>
    <td><input type="number" min="0" step="0.01" class="form-control form-control-sm price" value="${data.price}"></td>
    <td class="total text-end pe-3">${fmt(0, $("#moneda").value)}</td>
    <td class="no-print text-center"><button class="btn btn-sm btn-outline-danger quitar"><i class="bi bi-x-lg"></i></button></td>
  `;
  tbody.appendChild(tr);
  $$(".qty, .price, .desc", tr).forEach((el) =>
    el.addEventListener("input", () => { recalcular(); guardar(); })
  );
  $(".quitar", tr).addEventListener("click", () => { tr.remove(); recalcular(); guardar(); });
  recalcular();
}

// ===== Cálculos =====
function obtenerFilas() {
  return $$("#tabla tbody tr").map((tr) => ({
    qty: parseFloat($(".qty", tr).value) || 0,
    desc: $(".desc", tr).value.trim(),
    price: parseFloat($(".price", tr).value) || 0,
    tr,
  }));
}

function recalcular() {
  const rows = obtenerFilas();
  let subtotal = 0;
  rows.forEach((r) => {
    const total = r.qty * r.price;
    subtotal += total;
    $(".total", r.tr).textContent = fmt(total, $("#moneda").value);
  });
  const ivaPct = parseFloat($("#iva").value) || 0;
  const ivaMonto = subtotal * (ivaPct / 100);
  const total = subtotal + ivaMonto;
  const anticipoPct = parseFloat($("#anticipo").value) || 0;
  const anticipoMonto = total * (anticipoPct / 100);
  const restante = total - anticipoMonto;

  subtotalEl.textContent = fmt(subtotal, $("#moneda").value);
  ivaMontoEl.textContent = fmt(ivaMonto, $("#moneda").value);
  totalEl.textContent = fmt(total, $("#moneda").value);
  anticipoMontoEl.textContent = fmt(anticipoMonto, $("#moneda").value);
  restanteEl.textContent = fmt(restante, $("#moneda").value);
}

// ===== Persistencia =====
function guardar() {
  const payload = {
    fecha: $("#fecha").value,
    folio: $("#folio").value,
    cliente: $("#cliente").value,
    whatsapp: $("#whatsapp").value,
    telefono: $("#telefono").value,
    correo: $("#correo").value,
    descripcion: $("#descripcionProyecto").value,
    moneda: $("#moneda").value,
    iva: $("#iva").value,
    anticipo: $("#anticipo").value,
    rows: obtenerFilas().map((r) => ({ qty: r.qty, desc: r.desc, price: r.price })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function cargar() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    $("#fecha").value = d.fecha || "";
    $("#folio").value = d.folio || "";
    $("#cliente").value = d.cliente || "";
    $("#whatsapp").value = d.whatsapp || "";
    $("#telefono").value = d.telefono || "";
    $("#correo").value = d.correo || "";
    $("#descripcionProyecto").value = d.descripcion || "";
    $("#moneda").value = d.moneda || "MXN";
    $("#iva").value = d.iva ?? 16;
    $("#anticipo").value = d.anticipo ?? 20;
    tbody.innerHTML = "";
    (d.rows?.length ? d.rows : [{}, {}]).forEach(nuevaFila);
  } catch (e) {
    console.warn("No se pudo cargar", e);
  }
}

// ===== Generar folio =====
function generarFolio() {
  const hoy = new Date();
  const y = hoy.getFullYear().toString().slice(-2);
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `SR-${y}${m}${d}-${rand}`;
}

// ===== Eventos UI =====
$("#agregarFila").addEventListener("click", () => nuevaFila());
["moneda", "iva", "anticipo"].forEach((id) =>
  $(`#${id}`).addEventListener("input", () => { recalcular(); guardar(); })
);
["fecha", "folio", "cliente", "whatsapp", "telefono", "correo", "descripcionProyecto"]
  .forEach((id) => $(`#${id}`).addEventListener("input", guardar));

$("#btnGuardar").addEventListener("click", () => {
  guardar();
  mostrarToast("Cotización guardada en este navegador", "success");
});

$("#btnImprimir").addEventListener("click", () => window.print());
$("#btnImprimirCarta").addEventListener("click", () => {
  const style = document.createElement("style");
  style.textContent = `@page { size: Letter; margin: 14mm; }`;
  document.head.appendChild(style);
  window.print();
  style.remove();
});

$("#btnNueva").addEventListener("click", () => {
  if (!confirm("¿Crear una cotización nueva? Se limpiarán los campos.")) return;
  localStorage.removeItem(STORAGE_KEY);
  document.querySelector("form")?.reset();
  $("#fecha").value = new Date().toISOString().slice(0, 10);
  $("#folio").value = generarFolio();
  ["cliente", "whatsapp", "telefono", "correo", "descripcionProyecto"].forEach(id => $(`#${id}`).value = "");
  $("#moneda").value = "MXN";
  $("#iva").value = 16;
  $("#anticipo").value = 20;
  tbody.innerHTML = "";
  nuevaFila();
  nuevaFila();
  recalcular();
});

// ===== Funciones especiales =====
$("#btnGuardarPDF").addEventListener("click", () => {
  const element = document.querySelector("main");
  html2pdf().from(element).save("cotizacion.pdf");
});

$("#btnGuardarJPG").addEventListener("click", () => {
  const element = document.querySelector("main");
  html2canvas(element).then(canvas => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.download = "cotizacion.jpg";
    link.click();
  });
});

$("#btnEnviarJPG").addEventListener("click", () => {
  const element = document.querySelector("main");
  html2canvas(element).then(canvas => {
    const image = canvas.toDataURL("image/jpeg");
    const whatsappNumber = $("#whatsapp").value.replace(/\D/g, "");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Te envío la cotización")}`;
    fetch(image)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "cotizacion.jpg", { type: "image/jpeg" });
        const data = new FormData();
        data.append("file", file);
        window.open(url, "_blank");
      });
  });
});

// ===== Barra oculta al hacer scroll =====
let lastScrollTop = 0;
const actionsBar = document.querySelector(".print-actions");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop && currentScroll > 80) {
    actionsBar.classList.add("hide");
  } else {
    actionsBar.classList.remove("hide");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ===== Init =====
if (!localStorage.getItem(STORAGE_KEY)) {
  $("#fecha").value = new Date().toISOString().slice(0, 10);
  $("#folio").value = generarFolio();
  nuevaFila();
  nuevaFila();
}
cargar();
recalcular();

// ===== Toast helper =====
function mostrarToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `position-fixed bottom-0 end-0 m-3 alert alert-${type} shadow`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Botón Nueva Cotización
document.getElementById('btnNueva').addEventListener('click', () => {
  if (!confirm('¿Crear una cotización nueva? Se limpiarán los campos.')) return;

  // Limpia datos guardados
  localStorage.removeItem(STORAGE_KEY);

  // Abre nueva ventana con la misma página
  window.open(window.location.href, '_blank');

  // Resetea formulario actual
  document.querySelector('form')?.reset();
  document.getElementById('fecha').value = new Date().toISOString().slice(0, 10);
  document.getElementById('folio').value = generarFolio();
  ['cliente', 'whatsapp', 'telefono', 'correo', 'descripcionProyecto'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('moneda').value = 'MXN';
  document.getElementById('iva').value = 16;
  document.getElementById('anticipo').value = 20;

  tbody.innerHTML = '';
  nuevaFila();
  nuevaFila();
  recalcular();
});

// Botón Bloquear Cotización
document.getElementById('btnBloquear').addEventListener('click', () => {
  if (!confirm('¿Bloquear la cotización? No se podrá modificar.')) return;

  // Desactiva todos los campos editables
  document.querySelectorAll('input, textarea, select, button').forEach(el => {
    if (!el.classList.contains('no-print') && el.id !== 'btnBloquear') {
      el.setAttribute('disabled', 'true');
    }
  });

  // Cambia estilo para indicar que está bloqueada
  document.getElementById('btnBloquear').innerHTML = '<i class="bi bi-lock"></i> Bloqueada';
  document.getElementById('btnBloquear').classList.remove('btn-outline-dark');
  document.getElementById('btnBloquear').classList.add('btn-dark');
});
