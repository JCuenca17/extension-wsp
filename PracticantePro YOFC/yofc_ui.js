/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE INTERFAZ (UI)
 * VERSIÓN: V4.0 (Inyector Multi-Archivo 4x / UI Minimalista)
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ============================================================================
 */

if (
  window.location.href.includes("fms.yofc.com.pe") ||
  document.title.includes("YOFC CAD")
) {
  const SIDEBAR_WIDTH = 350;
  let isSidebarOpen = true;

  const icons = {
    arrowLeft: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    camera: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  };

  const theme = window.YOFC_THEME || {
    bgMain: "#f8fafc",
    bgCard: "#ffffff",
    border: "#e2e8f0",
    textPri: "#1e293b",
    textSec: "#64748b",
    yofcBlue: "#009CDE",
    yofcMagenta: "#CE0F69",
    hover: "#f1f5f9",
  };

  function inicializarEntorno() {
    if (document.getElementById("yofc-sidebar")) return;

    document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
    document.body.style.transition = "margin-right 0.3s ease, width 0.3s ease";
    document.body.style.width = `calc(100% - ${SIDEBAR_WIDTH}px)`;
    document.body.style.overflowX = "hidden";

    const sidebar = document.createElement("div");
    sidebar.id = "yofc-sidebar";
    sidebar.style.cssText = `
              position: fixed; top: 0; right: 0; width: ${SIDEBAR_WIDTH}px; height: 100vh;
              background: ${theme.bgMain}; border-left: 1px solid ${theme.border}; z-index: 999999;
              color: ${theme.textPri}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex;
              flex-direction: column; box-shadow: -5px 0 25px rgba(0,0,0,0.08);
              transition: right 0.3s ease;
          `;

    const toggleBtn = document.createElement("div");
    toggleBtn.id = "yofc-toggle-btn";
    toggleBtn.innerHTML = icons.arrowRight;
    toggleBtn.style.cssText = `
              position: absolute; top: 50%; left: -30px; width: 30px; height: 60px;
              background: ${theme.bgCard}; border: 1px solid ${theme.border}; border-right: none;
              border-radius: 6px 0 0 6px; cursor: pointer; display: flex;
              align-items: center; justify-content: center; color: ${theme.yofcBlue};
              box-shadow: -3px 0 8px rgba(0,0,0,0.1);
              transform: translateY(-50%); transition: background 0.2s;
          `;

    toggleBtn.onmouseover = () => (toggleBtn.style.background = theme.bgMain);
    toggleBtn.onmouseout = () => (toggleBtn.style.background = theme.bgCard);
    sidebar.appendChild(toggleBtn);

    sidebar.innerHTML += `
          <div style="background:${theme.bgCard}; padding:15px; border-bottom:1px solid ${theme.border}; text-align:center;">
              <h2 style="margin:0; font-size:16px; letter-spacing:1px; color:${theme.yofcBlue}; font-weight:800;">YOFC INJECTOR</h2>
              <div style="font-size:10px; color:${theme.textSec}; margin-top:5px; letter-spacing:1px; font-weight:600;">LITE EDITION - V4.0</div>
          </div>
          
          <div style="display:flex; border-bottom:1px solid ${theme.border}; background:${theme.bgMain}; flex-shrink:0;">
              <div style="flex:1; padding:10px; background:${theme.bgCard}; color:${theme.yofcBlue}; border-bottom:2px solid ${theme.yofcBlue}; font-weight:bold; font-size:10px; display:flex; flex-direction:column; align-items:center; gap:4px; user-select:none;">
                  ${icons.camera} MÓDULO DE INYECCIÓN (4X)
              </div>
          </div>

          <div id="yofc-view-inyector" style="display:flex; flex-direction:column; flex-grow:1; overflow:hidden;">
              <div id="yofc-stats" style="padding:20px; flex-grow:1; overflow-y:auto;">
                  <div style="color:${theme.textSec}; font-size:11px; margin-bottom:10px; font-weight:bold; letter-spacing:1px;">CACHÉ EN MEMORIA</div>
                  <div id="yofc-cache-list"></div>
              </div>
              <div id="yofc-actions" style="padding:20px; border-top:1px solid ${theme.border}; background:${theme.bgCard};">
                  <div id="yofc-context-info" style="font-size:11px; margin-bottom:15px; color:${theme.textSec}; line-height:1.4;"></div>
                  <button id="btn-inject-unit" style="display:none; width:100%; padding:12px; background:${theme.yofcBlue}; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold; letter-spacing:1px; font-size:12px; box-shadow:0 2px 4px rgba(0,156,222,0.2); transition: 0.2s;">
                      INYECTAR FOTOS
                  </button>
              </div>
          </div>
      `;

    document.body.appendChild(sidebar);

    // Evento simple para el toggle sidebar
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("#yofc-toggle-btn")) {
        isSidebarOpen = !isSidebarOpen;
        sidebar.style.right = isSidebarOpen ? "0px" : `-${SIDEBAR_WIDTH}px`;
        document.body.style.marginRight = isSidebarOpen
          ? `${SIDEBAR_WIDTH}px`
          : "0px";
        document.body.style.width = isSidebarOpen
          ? `calc(100% - ${SIDEBAR_WIDTH}px)`
          : "100%";
        document.getElementById("yofc-toggle-btn").innerHTML = isSidebarOpen
          ? icons.arrowRight
          : icons.arrowLeft;
      }
    });
  }

  setInterval(() => {
    inicializarEntorno();
    if (document.getElementById("yofc-view-inyector")) {
      if (typeof window.actualizarInterfazInyector === "function")
        window.actualizarInterfazInyector();
    }
  }, 1500);
}
