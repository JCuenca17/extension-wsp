/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE INTERFAZ (UI)
 * VERSIÓN: V3.5 (Corporate Edition - Smart Mirroring & Clean UI)
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
    arrowDown: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    camera: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
    report: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    door: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"></path><path d="M18 22V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v17"></path></svg>`,
    users: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    chalkboard: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"></rect><line x1="3" y1="17" x2="21" y2="17"></line><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    refresh: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    userTie: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
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
              <div style="font-size:10px; color:${theme.textSec}; margin-top:5px; letter-spacing:1px; font-weight:600;">MODULAR UI - V3.5</div>
          </div>
          
          <div style="display:flex; border-bottom:1px solid ${theme.border}; background:${theme.bgMain}; flex-shrink:0;">
              <button class="yofc-tab-btn" data-target="inyector" style="flex:1; padding:10px; background:${theme.bgMain}; color:${theme.textSec}; border:none; border-bottom:2px solid transparent; cursor:pointer; font-weight:bold; font-size:10px; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:4px;">${icons.camera} INYECTOR</button>
              <button class="yofc-tab-btn" data-target="reporte" style="flex:1; padding:10px; background:${theme.bgCard}; color:${theme.yofcBlue}; border:none; border-bottom:2px solid ${theme.yofcBlue}; cursor:pointer; font-weight:bold; font-size:10px; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:4px;">${icons.report} REPORTE</button>
              <button class="yofc-tab-btn" data-target="comunicacion" style="flex:1; padding:10px; background:${theme.bgMain}; color:${theme.textSec}; border:none; border-bottom:2px solid transparent; cursor:pointer; font-weight:bold; font-size:10px; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:4px;">${icons.whatsapp} MENSAJES</button>
          </div>

          <div id="yofc-view-inyector" class="yofc-view" style="display:none; flex-direction:column; flex-grow:1; overflow:hidden;">
              <div id="yofc-stats" style="padding:20px; flex-grow:1; overflow-y:auto;">
                  <div style="color:${theme.textSec}; font-size:11px; margin-bottom:10px; font-weight:bold; letter-spacing:1px;">CACHÉ EN MEMORIA</div>
                  <div id="yofc-cache-list"></div>
              </div>
              <div id="yofc-actions" style="padding:20px; border-top:1px solid ${theme.border}; background:${theme.bgCard};">
                  <div id="yofc-context-info" style="font-size:11px; margin-bottom:15px; color:${theme.textSec}; line-height:1.4;"></div>
                  <button id="btn-inject-unit" style="display:none; width:100%; padding:12px; background:${theme.yofcBlue}; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold; letter-spacing:1px; font-size:12px; box-shadow:0 2px 4px rgba(0,156,222,0.2);">
                      INYECTAR SIGUIENTE
                  </button>
              </div>
          </div>

          <div id="yofc-view-reporte" class="yofc-view" style="display:flex; flex-direction:column; flex-grow:1; padding:15px; overflow-y:auto;">
              <div style="background:${theme.bgCard}; padding:12px; border-radius:8px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; border:1px solid ${theme.border}; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                  <div style="display:flex; flex-direction:column;">
                      <span style="color:${theme.textSec}; font-size:10px; font-weight:bold;">CONTACTADOS HOY</span>
                      <span id="tracker-count" style="color:${theme.yofcBlue}; font-weight:bold; font-size:18px;">0 CADs</span>
                  </div>
                  <div style="display:flex; flex-direction:column; text-align:right;">
                      <span style="color:${theme.textSec}; font-size:10px; font-weight:bold;">CAMBIOS REALES</span>
                      <span id="tracker-changes" style="color:${theme.yofcMagenta}; font-weight:bold; font-size:18px;">0</span>
                  </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:${theme.bgCard}; padding:10px 12px; border:1px solid ${theme.border}; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                  <span style="color:${theme.textPri}; font-size:12px; font-weight:600; display:flex; align-items:center; gap:6px;">${icons.door} 1. Locales Abiertos</span>
                  <input type="number" id="ext-abiertos" value="0" style="width:60px; padding:4px; background:${theme.bgMain}; color:${theme.textPri}; border:1px solid ${theme.border}; text-align:center; outline:none; border-radius:4px; font-weight:bold;">
              </div>

              <div style="background:${theme.bgCard}; border:1px solid ${theme.border}; border-radius:8px; margin-bottom:15px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                  <div id="hdr-cap" style="display:flex; justify-content:space-between; align-items:center; padding:12px; cursor:pointer; user-select:none; background:${theme.bgCard}; transition:background 0.2s;">
                      <div style="display:flex; align-items:center; gap:8px;">
                          <span id="arrow-cap" style="color:${theme.textSec}; transition:transform 0.2s; display:flex;">${icons.arrowDown}</span>
                          <span style="color:${theme.textPri}; font-size:12px; font-weight:600; display:flex; align-items:center; gap:6px;">${icons.chalkboard} 3. Capacitados</span>
                      </div>
                      <span id="badge-cap" style="background:#e0f2fe; color:#0284c7; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; border:1px solid #bae6fd;">0</span>
                  </div>
                  <div id="content-cap" style="display:none; flex-direction:column; padding:0 12px 12px 12px; border-top:1px solid ${theme.border}; background:${theme.bgMain};">
                      <div id="lista-cap" style="max-height:160px; overflow-y:auto; font-size:11px; color:${theme.textPri}; display:flex; flex-direction:column; gap:2px; padding-right:4px; margin-top:8px;">
                          <span style="color:${theme.textSec}; font-style:italic;">Cargando lista de CADs...</span>
                      </div>
                  </div>
              </div>

              <div style="background:${theme.bgCard}; border:1px solid ${theme.border}; border-radius:8px; margin-bottom:15px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                  <div id="hdr-usr" style="display:flex; justify-content:space-between; align-items:center; padding:12px; cursor:pointer; user-select:none; background:${theme.bgCard}; transition:background 0.2s;">
                      <div style="display:flex; align-items:center; gap:8px;">
                          <span id="arrow-usr" style="color:${theme.textSec}; transition:transform 0.2s; display:flex;">${icons.arrowDown}</span>
                          <span style="color:${theme.textPri}; font-size:12px; font-weight:600; display:flex; align-items:center; gap:6px;">${icons.users} 4. Usuarios Creados</span>
                      </div>
                      <span id="badge-usr" style="background:#e0f2fe; color:#0284c7; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; border:1px solid #bae6fd;">0</span>
                  </div>
                  <div id="content-usr" style="display:none; flex-direction:column; padding:0 12px 12px 12px; border-top:1px solid ${theme.border}; background:${theme.bgMain};">
                      <div id="lista-usr" style="max-height:160px; overflow-y:auto; font-size:11px; color:${theme.textPri}; display:flex; flex-direction:column; gap:2px; padding-right:4px; margin-top:8px;">
                          <span style="color:${theme.textSec}; font-style:italic;">Cargando lista de CADs...</span>
                      </div>
                  </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; margin-top:5px;">
                  <span style="font-size:11px; color:${theme.textSec}; font-weight:bold; letter-spacing:0.5px;">VISTA PREVIA DEL REPORTE</span>
                  <button id="btn-refresh" style="background:transparent; border:none; color:${theme.yofcBlue}; font-size:11px; cursor:pointer; display:flex; align-items:center; gap:4px; font-weight:bold;">${icons.refresh} ACTUALIZAR</button>
              </div>
              
              <textarea id="txt-reporte" style="width:100%; flex-grow:1; min-height:160px; background:${theme.bgCard}; color:${theme.textPri}; border:1px solid ${theme.border}; border-radius:8px; padding:12px; font-family:Consolas, monospace; font-size:11px; resize:none; outline:none; margin-bottom:15px; line-height:1.5; box-shadow:inset 0 1px 3px rgba(0,0,0,0.02);"></textarea>
              
              <button id="btn-copy-reporte" style="width:100%; padding:14px; background:${theme.yofcBlue}; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px; letter-spacing:1px; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s; box-shadow:0 2px 6px rgba(0,156,222,0.3);">
                  ${icons.copy} COPIAR TEXTO
              </button>
          </div>

          <div id="yofc-view-comunicacion" class="yofc-view" style="display:none; flex-direction:column; flex-grow:1; padding:15px; overflow-y:auto;">
              
              <div style="display:flex; background:${theme.bgMain}; border-radius:6px; padding:4px; margin-bottom:12px; border:1px solid ${theme.border};">
                  <button id="tab-wa-lideres" style="flex:1; padding:8px; background:${theme.bgCard}; color:${theme.yofcBlue}; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05);">LÍDERES DIGITALES</button>
                  <button id="tab-wa-autoridades" style="flex:1; padding:8px; background:transparent; color:${theme.textSec}; border:none; border-radius:4px; font-weight:bold; font-size:10px; cursor:pointer;">AUTORIDADES LOCALES</button>
              </div>

              <div id="wa-modo-badge" style="background:#e0f2fe; border:1px solid #bae6fd; border-radius:6px; padding:10px; margin-bottom:12px; display:flex; flex-direction:column; align-items:center; text-align:center;">
                  <span style="font-size:10px; color:#0369a1; font-weight:bold; letter-spacing:0.5px; text-transform:uppercase;">ESTADO DEL FILTRO</span>
                  <span id="wa-modo-texto" style="font-size:11px; color:#0c4a6e; font-weight:800; margin-top:2px;">TODOS LOS CADS VISIBLES - CHAT LIBRE</span>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid ${theme.border}; padding-bottom:8px;">
                  <span style="font-size:10px; color:${theme.textSec}; font-weight:bold;">RESULTADOS EN PANTALLA</span>
                  <span id="wa-badge-contactos" style="background:${theme.bgMain}; color:${theme.textPri}; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold; border:1px solid ${theme.border};">0</span>
              </div>

              <div id="wa-panel-lideres" style="display:flex; flex-direction:column; flex-grow:1; overflow-y:auto;">
                  <div id="lista-contactos" style="display:flex; flex-direction:column; gap:8px;">
                      <div style="color:${theme.textSec}; font-size:11px; text-align:center; margin-top:20px; font-style:italic;">[ INFO ] La lista refleja los CADs visibles en la plataforma.</div>
                  </div>
              </div>

              <div id="wa-panel-autoridades" style="display:none; flex-direction:column; flex-grow:1; overflow-y:auto;">
                  <div id="lista-autoridades" style="display:flex; flex-direction:column; gap:8px;">
                      <div style="color:${theme.textSec}; font-size:11px; text-align:center; margin-top:20px; font-style:italic;">[ INFO ] La lista refleja los CADs visibles en la plataforma.</div>
                  </div>
              </div>
          </div>
      `;

    document.body.appendChild(sidebar);

    // =========================================================
    // MOTOR CENTRAL DE EVENTOS DELEGADOS
    // =========================================================
    sidebar.addEventListener("click", async (e) => {
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
        return;
      }

      const tabBtn = e.target.closest(".yofc-tab-btn");
      if (tabBtn) {
        const target = tabBtn.getAttribute("data-target");
        document
          .querySelectorAll(".yofc-view")
          .forEach((v) => (v.style.display = "none"));
        document.querySelectorAll(".yofc-tab-btn").forEach((b) => {
          b.style.background = theme.bgMain;
          b.style.color = theme.textSec;
          b.style.borderBottom = "2px solid transparent";
        });

        document.getElementById(`yofc-view-${target}`).style.display = "flex";
        tabBtn.style.background = theme.bgCard;
        tabBtn.style.color = theme.yofcBlue;
        tabBtn.style.borderBottom = `2px solid ${theme.yofcBlue}`;

        if (target === "reporte") {
          const domAbiertos = document.getElementById("kpi-abiertos-hoy");
          if (domAbiertos && !isNaN(parseInt(domAbiertos.innerText))) {
            document.getElementById("ext-abiertos").value =
              domAbiertos.innerText;
          }
          if (typeof window.popularListasCADs === "function")
            window.popularListasCADs();
          if (typeof window.compilarReporteAutomatico === "function")
            window.compilarReporteAutomatico();
        }
        if (target === "comunicacion") {
          if (typeof window.renderWAPanels === "function")
            window.renderWAPanels();
        }
        return;
      }

      if (e.target.closest("#tab-wa-lideres")) {
        document.getElementById("wa-panel-lideres").style.display = "flex";
        document.getElementById("wa-panel-autoridades").style.display = "none";
        const tLid = document.getElementById("tab-wa-lideres");
        tLid.style.background = theme.bgCard;
        tLid.style.color = theme.yofcBlue;
        tLid.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        const tAut = document.getElementById("tab-wa-autoridades");
        tAut.style.background = "transparent";
        tAut.style.color = theme.textSec;
        tAut.style.boxShadow = "none";
        if (typeof window.renderWAPanels === "function")
          window.renderWAPanels();
        return;
      }

      if (e.target.closest("#tab-wa-autoridades")) {
        document.getElementById("wa-panel-autoridades").style.display = "flex";
        document.getElementById("wa-panel-lideres").style.display = "none";
        const tAut = document.getElementById("tab-wa-autoridades");
        tAut.style.background = theme.bgCard;
        tAut.style.color = theme.yofcBlue;
        tAut.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        const tLid = document.getElementById("tab-wa-lideres");
        tLid.style.background = "transparent";
        tLid.style.color = theme.textSec;
        tLid.style.boxShadow = "none";
        if (typeof window.renderWAPanels === "function")
          window.renderWAPanels();
        return;
      }

      if (e.target.closest("#hdr-cap")) {
        const content = document.getElementById("content-cap");
        const arrow = document.getElementById("arrow-cap");
        if (content.style.display === "none") {
          content.style.display = "flex";
          arrow.style.transform = "rotate(180deg)";
        } else {
          content.style.display = "none";
          arrow.style.transform = "rotate(0deg)";
        }
        return;
      }
      if (e.target.closest("#hdr-usr")) {
        const content = document.getElementById("content-usr");
        const arrow = document.getElementById("arrow-usr");
        if (content.style.display === "none") {
          content.style.display = "flex";
          arrow.style.transform = "rotate(180deg)";
        } else {
          content.style.display = "none";
          arrow.style.transform = "rotate(0deg)";
        }
        return;
      }

      const waLider = e.target.closest(".btn-wa-lider");
      if (waLider) {
        const tel = waLider.getAttribute("data-telefono");
        const nom = waLider.getAttribute("data-nombre");
        const idCad = waLider.getAttribute("data-cad");
        const modo = waLider.getAttribute("data-modo"); // 'evidencia' o 'libre'

        let msg = "";
        if (modo === "evidencia") {
          const nombreM =
            nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
          let nombreCad = idCad;
          const partes = idCad.split("_");
          if (partes.length >= 3) {
            nombreCad = partes[2]
              .trim()
              .toLowerCase()
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
          }
          const msgs = [
            `Hola ${nombreM}, te escribimos de YOFC para recordarte el envío de la evidencia fotográfica del CAD ${nombreCad}. Quedamos atentos para validar tu apertura, gracias.`,
            `Hola ${nombreM}, nos comunicamos de YOFC para solicitarte la foto de apertura de hoy en el CAD ${nombreCad}. Por favor, envíala en cuanto puedas.`,
          ];
          msg = msgs[Math.floor(Math.random() * msgs.length)];
        }

        window.open(
          `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`,
          "yofc_wa_tab",
        );
        return;
      }

      const waAut = e.target.closest(".btn-wa-autoridad");
      if (waAut) {
        const tel = waAut.getAttribute("data-telefono");
        window.open(`https://wa.me/${tel}`, "yofc_wa_tab"); // Siempre en blanco
        return;
      }

      if (e.target.closest("#btn-refresh")) {
        if (typeof window.compilarReporteAutomatico === "function")
          window.compilarReporteAutomatico();
        return;
      }

      const btnCopy = e.target.closest("#btn-copy-reporte");
      if (btnCopy) {
        const txt = document.getElementById("txt-reporte");
        try {
          await navigator.clipboard.writeText(txt.value);
          feedbackOk();
        } catch (err) {
          txt.select();
          document.execCommand("copy");
          feedbackOk();
        }
        function feedbackOk() {
          btnCopy.innerHTML = "[ OK ] COPIADO CON ÉXITO";
          btnCopy.style.background = "#10b981";
          setTimeout(() => {
            btnCopy.innerHTML = `${icons.copy} COPIAR TEXTO`;
            btnCopy.style.background = theme.yofcBlue;
          }, 2000);
        }
        return;
      }
    });

    sidebar.addEventListener("input", (e) => {
      if (e.target.id === "ext-abiertos") {
        if (typeof window.compilarReporteAutomatico === "function")
          window.compilarReporteAutomatico();
      }
    });
  }

  setInterval(() => {
    inicializarEntorno();
    if (
      document.getElementById("yofc-view-inyector") &&
      document.getElementById("yofc-view-inyector").style.display !== "none"
    ) {
      if (typeof window.actualizarInterfazInyector === "function")
        window.actualizarInterfazInyector();
    }
    if (
      document.getElementById("yofc-view-comunicacion") &&
      document.getElementById("yofc-view-comunicacion").style.display !== "none"
    ) {
      if (typeof window.renderWAPanels === "function") window.renderWAPanels();
    }
  }, 1500);

  setInterval(() => {
    if (
      document.getElementById("yofc-view-reporte") &&
      document.getElementById("yofc-view-reporte").style.display !== "none"
    ) {
      if (typeof window.popularListasCADs === "function")
        window.popularListasCADs();
    }
  }, 2000);
}
