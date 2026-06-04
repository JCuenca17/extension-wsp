/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE LÓGICA (CORE)
 * VERSIÓN: V4.0 (Inyector Multi-Archivo 4x / UI Minimalista)
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ============================================================================
 */

if (
  window.location.href.includes("fms.yofc.com.pe") ||
  document.title.includes("YOFC CAD")
) {
  window.YOFC_THEME = {
    bgMain: "#f8fafc",
    bgCard: "#ffffff",
    border: "#e2e8f0",
    textPri: "#1e293b",
    textSec: "#64748b",
    yofcBlue: "#009CDE",
    yofcMagenta: "#CE0F69",
    hover: "#f1f5f9",
  };

  // ==========================================
  // LÓGICA DEL INYECTOR FOTOGRÁFICO (HASTA 4 FOTOS)
  // ==========================================
  window.actualizarInterfazInyector = async () => {
    try {
      const data = await chrome.storage.local.get("yofc_bridge_data");
      const fotos = data.yofc_bridge_data || [];
      const container = document.getElementById("yofc-cache-list");
      const contextInfo = document.getElementById("yofc-context-info");
      const btn = document.getElementById("btn-inject-unit");

      if (!container) return;
      container.innerHTML = "";

      if (fotos.length === 0) {
        container.innerHTML = `<div style='color:${window.YOFC_THEME.textSec}; font-style:italic; font-size:12px;'>Memoria de caché vacía.</div>`;
        if (btn) btn.style.display = "none";
        if (contextInfo)
          contextInfo.innerText = "A la espera de datos desde el origen.";
        return;
      }

      // Contar cuántas fotos tiene cada CAD en caché
      const conteo = {};
      fotos.forEach((f) => {
        const name = f.autor.split("\n")[0].trim();
        conteo[name] = (conteo[name] || 0) + 1;
      });

      for (const [cad, cant] of Object.entries(conteo)) {
        const item = document.createElement("div");
        item.style.cssText = `display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid ${window.YOFC_THEME.border}; font-size:12px;`;
        item.innerHTML = `<span style="color:${window.YOFC_THEME.textPri}; font-weight:500;">${cad}</span><span style="color:${window.YOFC_THEME.yofcBlue}; font-weight:bold;">[ ${cant} ]</span>`;
        container.appendChild(item);
      }

      // Identificar si estamos dentro de un CAD específico en la plataforma
      const tituloEl = document.getElementById("ops-detalle-titulo");
      const cadActual = tituloEl ? tituloEl.innerText.trim() : null;

      if (cadActual && conteo[cadActual]) {
        const cantidadInyectar = Math.min(conteo[cadActual], 4);
        if (contextInfo)
          contextInfo.innerHTML = `Entorno identificado:<br><b style="color:${window.YOFC_THEME.textPri};">${cadActual}</b><br><br>Registros pendientes: ${conteo[cadActual]}`;
        if (btn) {
          btn.style.display = "flex";
          btn.innerText = `INYECTAR ${cantidadInyectar} FOTO(S)`;
          btn.onclick = () => window.ejecutarInyeccionMulti(cadActual);
        }
      } else {
        if (contextInfo)
          contextInfo.innerHTML = cadActual
            ? `<span style="color:${window.YOFC_THEME.yofcMagenta};">El CAD [${cadActual}] no posee registros en la caché.</span>`
            : "Navegue a un CAD activo para habilitar la inyección.";
        if (btn) btn.style.display = "none";
      }
    } catch (e) {}
  };

  window.ejecutarInyeccionMulti = async (cadActual) => {
    try {
      const data = await chrome.storage.local.get("yofc_bridge_data");
      let fotos = data.yofc_bridge_data || [];

      const inputFiles = document.getElementById("o-ap-fotos-input");
      if (!inputFiles) return;

      // Extraer un máximo de 4 fotos para el CAD actual
      let indicesAEliminar = [];
      let fotosAInyectar = [];

      for (let i = 0; i < fotos.length; i++) {
        if (fotos[i].autor.split("\n")[0].trim() === cadActual) {
          indicesAEliminar.push(i);
          fotosAInyectar.push(fotos[i]);
          if (fotosAInyectar.length === 4) break; // Tope de 4 archivos
        }
      }

      if (fotosAInyectar.length === 0) return;

      // Cambiamos el texto del botón temporalmente para que veas que está trabajando
      const btn = document.getElementById("btn-inject-unit");
      if (btn) {
        btn.innerText = "PROCESANDO...";
        btn.style.background = "#f59e0b"; // Naranja
        btn.style.pointerEvents = "none";
      }

      const dataTransfer = new DataTransfer();

      // Descargar los blobs de las 4 fotos simultáneamente
      const fetchPromises = fotosAInyectar.map(async (fotoObj, idx) => {
        const res = await fetch(fotoObj.imagen);
        const blob = await res.blob();
        // Se le asigna un nombre secuencial a cada foto
        const file = new File([blob], `evidencia_${cadActual}_${idx + 1}.jpg`, {
          type: "image/jpeg",
        });
        dataTransfer.items.add(file);
      });

      await Promise.all(fetchPromises);

      // Inyectar el paquete completo al input de la plataforma
      inputFiles.files = dataTransfer.files;
      inputFiles.dispatchEvent(new Event("change", { bubbles: true }));

      // Eliminar de la memoria solo las fotos que se inyectaron (de atrás hacia adelante para no romper los índices)
      for (let i = indicesAEliminar.length - 1; i >= 0; i--) {
        fotos.splice(indicesAEliminar[i], 1);
      }

      await chrome.storage.local.set({ yofc_bridge_data: fotos });

      if (btn) {
        btn.innerText = "[ OK ] INYECTADO";
        btn.style.background = "#10b981"; // Verde
        setTimeout(() => {
          window.actualizarInterfazInyector();
          btn.style.pointerEvents = "auto";
          btn.style.background = window.YOFC_THEME.yofcBlue;
        }, 1500);
      } else {
        window.actualizarInterfazInyector();
      }
    } catch (e) {
      console.error("Error inyectando fotos:", e);
    }
  };
}
