/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE LÓGICA (CORE)
 * VERSIÓN: V10.0 (Flat Corporate & Safe Injection)
 * ============================================================================
 */

if (window.location.href.includes("yofc") || document.title.includes("YOFC")) {
  window.getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  window.getDailyTracker = async () => {
    const dateKey = `yofc_tracker_v10_${window.getTodayStr()}`;
    const data = await chrome.storage.local.get(dateKey);
    if (data[dateKey]) return data[dateKey];
    const newTracker = {
      timer: {
        activeActivity: null,
        isRunning: false,
        startTime: null,
        activities: {
          "Llamar a encargados/autoridades CADs": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
          "Llamar a encargados CAUs": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
          "Actualizar usuarios en el sistema": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
          "Reuniones, capacitaciones y asesorías": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
          "Actualizar perfiles de Facebook": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
          "Elaboración de reportes": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
          "Elaboración de presentaciones": {
            elapsedSecs: 0,
            count: 0,
            comentario: "",
          },
        },
      },
    };
    await chrome.storage.local.set({ [dateKey]: newTracker });
    return newTracker;
  };

  window.saveDailyTracker = async (trackerData) => {
    const dateKey = `yofc_tracker_v10_${window.getTodayStr()}`;
    await chrome.storage.local.set({ [dateKey]: trackerData });
  };

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
        container.innerHTML =
          "<div style='color:#64748b; font-style:italic; font-size:12px; text-align:center; padding:20px 0; font-weight:700;'>MEMORIA DE CACHÉ VACÍA</div>";
        if (btn) btn.style.display = "none";
        if (contextInfo) contextInfo.innerHTML = "ESPERANDO DATOS DE WHATSAPP";
        return;
      }

      const conteo = {};
      fotos.forEach((f) => {
        const name = f.autor.split("\n")[0].trim();
        conteo[name] = (conteo[name] || 0) + 1;
      });

      for (const [cad, cant] of Object.entries(conteo)) {
        const item = document.createElement("div");
        item.className = "yofc-cache-item";
        item.innerHTML = `<span style="color:#1e293b;">${cad}</span><span class="yofc-badge">${cant}</span>`;
        container.appendChild(item);
      }

      const tituloEl = document.getElementById("ops-detalle-titulo");
      const cadActual = tituloEl ? tituloEl.innerText.trim() : null;

      if (cadActual && conteo[cadActual]) {
        const cantidadInyectar = Math.min(conteo[cadActual], 4);
        if (contextInfo)
          contextInfo.innerHTML = `CAD EN PANTALLA:<br><strong style="color:#009CDE; font-size:14px; display:block; margin:6px 0;">${cadActual}</strong>COLA DE ESPERA: ${conteo[cadActual]} FOTOS`;
        if (btn) {
          btn.style.display = "flex";
          btn.innerHTML = `INYECTAR ${cantidadInyectar} FOTO(S)`;
          btn.onclick = () => window.ejecutarInyeccionMulti(cadActual);
        }
      } else {
        if (contextInfo)
          contextInfo.innerHTML = cadActual
            ? `<span style="color:#CE0F69; font-weight:800;">EL CAD [${cadActual}] NO ESTÁ EN CACHÉ.</span>`
            : "NAVEGA A UN CAD ACTIVO";
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

      let indicesAEliminar = [];
      let fotosAInyectar = [];

      for (let i = 0; i < fotos.length; i++) {
        if (fotos[i].autor.split("\n")[0].trim() === cadActual) {
          indicesAEliminar.push(i);
          fotosAInyectar.push(fotos[i]);
          if (fotosAInyectar.length === 4) break;
        }
      }

      if (fotosAInyectar.length === 0) return;

      const btn = document.getElementById("btn-inject-unit");
      if (btn) {
        btn.innerHTML = `PROCESANDO...`;
        btn.style.background = "#f59e0b";
        btn.style.pointerEvents = "none";
      }

      const dataTransfer = new DataTransfer();
      const fetchPromises = fotosAInyectar.map(async (fotoObj, idx) => {
        const res = await fetch(fotoObj.imagen);
        const blob = await res.blob();
        const file = new File([blob], `evidencia_${cadActual}_${idx + 1}.jpg`, {
          type: "image/jpeg",
        });
        dataTransfer.items.add(file);
      });

      await Promise.all(fetchPromises);
      inputFiles.files = dataTransfer.files;
      inputFiles.dispatchEvent(new Event("change", { bubbles: true }));

      for (let i = indicesAEliminar.length - 1; i >= 0; i--) {
        fotos.splice(indicesAEliminar[i], 1);
      }

      await chrome.storage.local.set({ yofc_bridge_data: fotos });

      if (btn) {
        btn.innerHTML = `[ OK ] ENVIADO`;
        btn.style.background = "#10b981";
        setTimeout(() => {
          window.actualizarInterfazInyector();
          btn.style.pointerEvents = "auto";
          btn.style.background = "";
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };
}
