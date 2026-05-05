/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE PLATAFORMA (INYECCIÓN PRECISA)
 * VERSIÓN: V70 (Precisión por ID de DOM + Modales Custom)
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ============================================================================
 * © 2026 Jose Luis Cuenca Gutierrez - Todos los derechos reservados.
 * ============================================================================
 */

if (window.location.href.includes("fms.yofc.com.pe")) {
  console.log("YOFC Injector: Monitor de entorno de trabajo iniciado.");

  // Función para crear modales profesionales reemplazando alert()
  function mostrarModalCustom(titulo, mensaje, esError = false) {
    const idModal = "yofc-custom-modal";
    const existente = document.getElementById(idModal);
    if (existente) existente.remove();

    const overlay = document.createElement("div");
    overlay.id = idModal;
    overlay.style.cssText =
      "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:9999999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(2px); font-family:Consolas, monospace;";

    const caja = document.createElement("div");
    caja.style.cssText = `background:#1a1a1a; border:1px solid ${esError ? "#ef5350" : "#4fc3f7"}; border-radius:4px; padding:25px; width:450px; max-width:90%; color:#e0e0e0; box-shadow:0 15px 35px rgba(0,0,0,0.6);`;

    const tituloEl = document.createElement("h3");
    tituloEl.innerText = titulo;
    tituloEl.style.cssText = `color:${esError ? "#ef5350" : "#4fc3f7"}; margin:0 0 15px 0; border-bottom:1px solid #333; padding-bottom:10px; font-size:16px; letter-spacing:1px;`;

    const msjEl = document.createElement("p");
    msjEl.innerText = mensaje;
    msjEl.style.cssText =
      "font-size:13px; line-height:1.6; white-space:pre-wrap; margin-bottom:20px; color:#ccc;";

    const btn = document.createElement("button");
    btn.innerText = "ENTENDIDO";
    btn.style.cssText = `width:100%; padding:12px; background:${esError ? "#c62828" : "#0277bd"}; color:#fff; border:none; border-radius:2px; cursor:pointer; font-weight:bold; letter-spacing:1px; transition:0.2s;`;
    btn.onmouseover = () => (btn.style.opacity = "0.8");
    btn.onmouseout = () => (btn.style.opacity = "1");
    btn.onclick = () => overlay.remove();

    caja.appendChild(tituloEl);
    caja.appendChild(msjEl);
    caja.appendChild(btn);
    overlay.appendChild(caja);
    document.body.appendChild(overlay);
  }

  function mantenerBotonVivo() {
    if (document.getElementById("btn-yofc-injector")) return;

    const btnInyectar = document.createElement("button");
    btnInyectar.id = "btn-yofc-injector";
    btnInyectar.innerText = "[ INYECTAR DATOS DE CACHÉ ]";
    btnInyectar.style.cssText =
      "position:fixed; bottom:30px; right:30px; z-index:999999; padding:15px 25px; background:#121212; color:#4fc3f7; border:1px solid #4fc3f7; border-radius:4px; cursor:pointer; font-weight:bold; font-family:Consolas, monospace; font-size:13px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: 0.3s; letter-spacing:1px;";

    btnInyectar.onmouseover = () => {
      btnInyectar.style.background = "#4fc3f7";
      btnInyectar.style.color = "#000";
    };
    btnInyectar.onmouseout = () => {
      btnInyectar.style.background = "#121212";
      btnInyectar.style.color = "#4fc3f7";
    };

    document.body.appendChild(btnInyectar);

    btnInyectar.onclick = async () => {
      const data = await chrome.storage.local.get("yofc_bridge_data");
      const fotos = data.yofc_bridge_data;

      if (!fotos || fotos.length === 0) {
        mostrarModalCustom(
          "CACHÉ VACÍA",
          "No existen datos preparados en memoria.\nRequiere ejecutar la extracción desde el origen (WhatsApp).",
          true,
        );
        return;
      }

      // BÚSQUEDA PRECISA (O(1)) POR ID EXACTO DEL DOM
      const tituloElemento = document.getElementById("ops-detalle-titulo");

      if (!tituloElemento) {
        mostrarModalCustom(
          "ERROR DE CONTEXTO",
          "El sistema no detecta el contenedor 'ops-detalle-titulo'.\nVerifique que se encuentra en la vista de detalle de un CAD activo.",
          true,
        );
        return;
      }

      const cadActual = tituloElemento.innerText.trim();

      const fotosParaPegar = fotos.filter(
        (f) => f.autor.split("\n")[0].trim() === cadActual,
      );
      const fotosRestantes = fotos.filter(
        (f) => f.autor.split("\n")[0].trim() !== cadActual,
      );

      if (fotosParaPegar.length === 0) {
        const cadsEnMemoria = [
          ...new Set(fotos.map((f) => f.autor.split("\n")[0].trim())),
        ].join("\n- ");
        mostrarModalCustom(
          "FALTA DE CORRESPONDENCIA",
          `El CAD activo en pantalla es:\n[ ${cadActual} ]\n\nNo obstante, la memoria solo contiene registros de:\n- ${cadsEnMemoria}`,
          true,
        );
        return;
      }

      const inputFiles = document.getElementById("o-ap-fotos-input");

      if (!inputFiles) {
        mostrarModalCustom(
          "ERROR DE INTERFAZ",
          "No se localizó el componente de carga (Input DOM). Asegúrese de haber desplegado la pestaña 'Registro de Apertura'.",
          true,
        );
        return;
      }

      // Inicio de inyección
      btnInyectar.innerText = `[ PROCESANDO ${fotosParaPegar.length} REGISTROS... ]`;
      btnInyectar.style.background = "#f57c00";
      btnInyectar.style.color = "#000";
      btnInyectar.style.borderColor = "#f57c00";

      try {
        const dataTransfer = new DataTransfer();

        for (let i = 0; i < fotosParaPegar.length; i++) {
          const res = await fetch(fotosParaPegar[i].imagen);
          const blob = await res.blob();
          const file = new File([blob], `evidencia_${cadActual}_${i + 1}.jpg`, {
            type: "image/jpeg",
          });
          dataTransfer.items.add(file);
        }

        inputFiles.files = dataTransfer.files;

        const event = new Event("change", { bubbles: true });
        inputFiles.dispatchEvent(event);

        // Limpieza y actualización de memoria
        if (fotosRestantes.length > 0) {
          await chrome.storage.local.set({ yofc_bridge_data: fotosRestantes });
          btnInyectar.innerText = `[ ÉXITO: QUEDAN ${fotosRestantes.length} EN CACHÉ ]`;
        } else {
          await chrome.storage.local.remove("yofc_bridge_data");
          btnInyectar.innerText = `[ INYECCIÓN COMPLETADA ]`;
        }

        btnInyectar.style.background = "#2e7d32";
        btnInyectar.style.borderColor = "#2e7d32";

        setTimeout(() => {
          btnInyectar.innerText = "[ INYECTAR DATOS DE CACHÉ ]";
          btnInyectar.style.background = "#121212";
          btnInyectar.style.color = "#4fc3f7";
          btnInyectar.style.borderColor = "#4fc3f7";
        }, 3500);
      } catch (error) {
        console.error("YOFC Injector Error: ", error);
        mostrarModalCustom(
          "ERROR DE EJECUCIÓN",
          "Ocurrió una falla crítica durante la construcción de los objetos Blob. Revise la consola del navegador.",
          true,
        );
        btnInyectar.innerText = "[ INYECTAR DATOS DE CACHÉ ]";
      }
    };
  }

  setInterval(mantenerBotonVivo, 1500);
  mantenerBotonVivo();
}
