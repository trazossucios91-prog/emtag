// =============================
// Nota de Remisión - JS Completo
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.getElementById("nota-body");
  const btnAgregarFila = document.getElementById("btn-agregar-fila");
  const totalFinalInput = document.getElementById("total-final");

  // -----------------------------
  // Función para recalcular totales
  // -----------------------------
  function recalcularTotales() {
    let totalFinal = 0;

    tablaBody.querySelectorAll("tr").forEach((fila) => {
      const cantidad = parseFloat(fila.querySelector(".cantidad")?.value) || 0;
      const precioUnitario = parseFloat(fila.querySelector(".precio-unitario")?.value) || 0;
      const total = cantidad * precioUnitario;

      const totalInput = fila.querySelector(".total");
      if (totalInput) {
        totalInput.value = total.toFixed(2);
      }

      totalFinal += total;
    });

    totalFinalInput.value = totalFinal.toFixed(2);
  }

  // -----------------------------
  // Función para crear nueva fila
  // -----------------------------
  function crearFila() {
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td><input type="number" class="form-control cantidad text-center" min="1" value="1"></td>
      <td colspan="2"><input type="text" class="form-control descripcion" placeholder="Descripción"></td>
      <td class="td-precio-juego ocultar"><input type="number" class="form-control precio-juego" min="0"></td>
      <td><input type="number" class="form-control precio-unitario" min="0" step="0.01"></td>
      <td><input type="text" class="form-control total" readonly></td>
      <td><button class="btn btn-sm btn-danger eliminar"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tablaBody.appendChild(nuevaFila);

    // Eventos en la nueva fila
    nuevaFila.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", recalcularTotales);
    });

    nuevaFila.querySelector(".eliminar").addEventListener("click", () => {
      nuevaFila.remove();
      recalcularTotales();
    });
  }

  // -----------------------------
  // Inicializar eventos en filas existentes
  // -----------------------------
  tablaBody.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", recalcularTotales);
  });

  // Evento agregar fila
  btnAgregarFila.addEventListener("click", crearFila);

  // Inicializar totales al cargar
  recalcularTotales();

  // -----------------------------
  // Función imprimir nota
  // -----------------------------
  window.imprimirNota = function() {
    const nota = document.querySelector('.nota');
    const nuevaVentana = window.open('', '_blank');
    nuevaVentana.document.write(`
      <html>
        <head>
          <title>Imprimir Nota</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { padding: 2rem; font-family: 'Montserrat', sans-serif; }
            .nota { box-shadow: none; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: center; }
          </style>
        </head>
        <body>
          ${nota.innerHTML}
        </body>
      </html>
    `);
    nuevaVentana.document.close();
    nuevaVentana.focus();
    nuevaVentana.print();
    nuevaVentana.close();
  };

  // -----------------------------
  // Función convertir a JPG
  // -----------------------------
  window.convertirJPG = function() {
    const nota = document.querySelector('.nota');
    html2canvas(nota, { scale: 2 }).then(canvas => {
      const enlace = document.createElement('a');
      enlace.href = canvas.toDataURL('image/jpeg', 1.0);
      enlace.download = 'nota-de-venta.jpg';
      enlace.click();
    });
  };
});
function convertirJPG() {
  const nota = document.querySelector('.nota'); // el contenedor de la nota

  // Usamos html2canvas
  html2canvas(nota, {
    scale: 2,                // mejor resolución
    useCORS: true,           // para imágenes externas si las hubiera
    allowTaint: false,       
    backgroundColor: '#fff'  // fondo blanco
  }).then(canvas => {
    // Convertimos el canvas a imagen
    canvas.toBlob(function(blob) {
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(blob);
      enlace.download = 'nota-de-venta.jpg';
      enlace.click();
      URL.revokeObjectURL(enlace.href);
    }, 'image/jpeg', 1.0);
  }).catch(error => {
    console.error("Error al generar JPG:", error);
    alert("No se pudo generar la imagen. Revisa la consola.");
  });
}
