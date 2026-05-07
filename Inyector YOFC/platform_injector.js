/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE PLATAFORMA (SIDEBAR RETRÁCTIL)
 * VERSIÓN: V75 (Panel Colapsable y Control Unitario)
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ============================================================================
 * © 2026 Jose Luis Cuenca Gutierrez - Todos los derechos reservados.
 * ============================================================================
 */

if (window.location.href.includes("fms.yofc.com.pe")) {
  console.log("YOFC Injector: Modo Sidebar Retráctil activado.");

  const SIDEBAR_WIDTH = 320;
  let isSidebarOpen = true; // Estado inicial del panel

  function inicializarEntorno() {
    if (document.getElementById("yofc-sidebar")) return;

    // 1. Configuración del body
    document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
    document.body.style.transition = "margin-right 0.3s ease, width 0.3s ease";
    document.body.style.width = `calc(100% - ${SIDEBAR_WIDTH}px)`;
    document.body.style.overflowX = "hidden"; // Evitar scrollbars indeseados

    // 2. Creación del Contenedor Principal (Sidebar)
    const sidebar = document.createElement("div");
    sidebar.id = "yofc-sidebar";
    sidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: ${SIDEBAR_WIDTH}px;
            height: 100vh;
            background: #121212;
            border-left: 1px solid #333;
            z-index: 999999;
            color: #e0e0e0;
            font-family: Consolas, monospace;
            display: flex;
            flex-direction: column;
            box-shadow: -5px 0 15px rgba(0,0,0,0.5);
            transition: right 0.3s ease;
        `;

    // 3. Creación de la Pestaña Retráctil (Toggle Button)
    const toggleBtn = document.createElement("div");
    toggleBtn.id = "yofc-toggle-btn";
    toggleBtn.innerHTML = "▶"; // Icono de flecha
    toggleBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: -30px;
            width: 30px;
            height: 60px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-right: none;
            border-radius: 6px 0 0 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4fc3f7;
            font-size: 14px;
            box-shadow: -3px 0 8px rgba(0,0,0,0.4);
            transform: translateY(-50%);
            transition: background 0.2s;
        `;

    toggleBtn.onmouseover = () => (toggleBtn.style.background = "#222");
    toggleBtn.onmouseout = () => (toggleBtn.style.background = "#1a1a1a");

    // Lógica de apertura y cierre
    toggleBtn.onclick = () => {
      isSidebarOpen = !isSidebarOpen;
      if (isSidebarOpen) {
        sidebar.style.right = "0px";
        document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
        document.body.style.width = `calc(100% - ${SIDEBAR_WIDTH}px)`;
        toggleBtn.innerHTML = "▶";
      } else {
        sidebar.style.right = `-${SIDEBAR_WIDTH}px`;
        document.body.style.marginRight = "0px";
        document.body.style.width = "100%";
        toggleBtn.innerHTML = "◀";
      }
    };

    // Estructura interna del panel
    sidebar.innerHTML += `
            <div style="background:#1a1a1a; padding:20px; border-bottom:1px solid #333; text-align:center;">
                <h2 style="margin:0; font-size:14px; letter-spacing:2px; color:#4fc3f7;">YOFC INJECTOR</h2>
                <div style="font-size:10px; color:#666; margin-top:5px;">CONTROL DE FLUJO V75</div>
            </div>
            <div id="yofc-stats" style="padding:20px; flex-grow:1; overflow-y:auto;">
                <div style="color:#666; font-size:11px; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px;">Caché en memoria</div>
                <div id="yofc-cache-list"></div>
            </div>
            <div id="yofc-actions" style="padding:20px; border-top:1px solid #333; background:#1a1a1a;">
                <div id="yofc-context-info" style="font-size:11px; margin-bottom:15px; color:#aaa; line-height:1.4;"></div>
                <button id="btn-inject-unit" style="display:none; width:100%; padding:15px; background:#0277bd; color:#fff; border:none; border-radius:2px; cursor:pointer; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
                    Inyectar Siguiente
                </button>
            </div>
        `;

    sidebar.appendChild(toggleBtn);
    document.body.appendChild(sidebar);
    actualizarInterfaz();
  }

  async function actualizarInterfaz() {
    const data = await chrome.storage.local.get("yofc_bridge_data");
    const fotos = data.yofc_bridge_data || [];
    const container = document.getElementById("yofc-cache-list");
    const contextInfo = document.getElementById("yofc-context-info");
    const btn = document.getElementById("btn-inject-unit");

    if (!container) return;

    container.innerHTML = "";

    if (fotos.length === 0) {
      container.innerHTML =
        "<div style='color:#444; font-style:italic; font-size:12px;'>Memoria de caché vacía.</div>";
      btn.style.display = "none";
      contextInfo.innerText = "A la espera de datos desde el origen.";
      return;
    }

    const conteo = {};
    fotos.forEach((f) => {
      const name = f.autor.split("\n")[0].trim();
      conteo[name] = (conteo[name] || 0) + 1;
    });

    for (const [cad, cant] of Object.entries(conteo)) {
      const item = document.createElement("div");
      item.style.cssText =
        "display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #222; font-size:12px;";
      item.innerHTML = `<span>${cad}</span><span style="color:#4fc3f7; font-weight:bold;">[ ${cant} ]</span>`;
      container.appendChild(item);
    }

    const tituloEl = document.getElementById("ops-detalle-titulo");
    const cadActual = tituloEl ? tituloEl.innerText.trim() : null;

    if (cadActual && conteo[cadActual]) {
      contextInfo.innerHTML = `Entorno identificado:<br><b style="color:#fff;">${cadActual}</b><br><br>Registros pendientes: ${conteo[cadActual]}`;
      btn.style.display = "block";
      btn.onclick = () => ejecutarInyeccionUnitaria(cadActual);
    } else {
      contextInfo.innerHTML = cadActual
        ? `<span style="color:#ef5350;">El CAD [${cadActual}] no posee registros en la caché actual.</span>`
        : "Navegue a un CAD activo para habilitar la inyección.";
      btn.style.display = "none";
    }
  }

  async function ejecutarInyeccionUnitaria(cadActual) {
    const data = await chrome.storage.local.get("yofc_bridge_data");
    let fotos = data.yofc_bridge_data || [];

    const index = fotos.findIndex(
      (f) => f.autor.split("\n")[0].trim() === cadActual,
    );
    if (index === -1) return;

    const registroActual = fotos[index];
    const inputFiles = document.getElementById("o-ap-fotos-input");

    if (!inputFiles) {
      console.error("Error: Input DOM 'o-ap-fotos-input' no localizado.");
      return;
    }

    try {
      const res = await fetch(registroActual.imagen);
      const blob = await res.blob();
      const file = new File([blob], `evidencia_${cadActual}.jpg`, {
        type: "image/jpeg",
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputFiles.files = dataTransfer.files;

      const event = new Event("change", { bubbles: true });
      inputFiles.dispatchEvent(event);

      fotos.splice(index, 1);
      await chrome.storage.local.set({ yofc_bridge_data: fotos });

      actualizarInterfaz();
    } catch (e) {
      console.error("Falla en el proceso de inyección unitaria:", e);
    }
  }

  setInterval(() => {
    inicializarEntorno();
    actualizarInterfaz();
  }, 1500);
}
