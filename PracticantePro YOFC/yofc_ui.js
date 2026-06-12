/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE INTERFAZ (UI)
 * VERSIÓN: V10.0 (Light Flat Corporate UI)
 * ============================================================================
 */

if (window.location.href.includes("yofc") || document.title.includes("YOFC")) {
  const SIDEBAR_WIDTH = 350;
  let isSidebarOpen = true;

  const icons = {
    arrowLeft: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    camera: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    play: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    pause: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  };

  function inyectarEstilos() {
    if (document.getElementById("yofc-styles")) return;
    const style = document.createElement("style");
    style.id = "yofc-styles";
    style.textContent = `
          :root {
              --bg-main: #f8fafc; --bg-card: #ffffff;
              --border-dark: #334155; --border-w: 2px;
              --text-dark: #1e293b; --text-muted: #64748b;
              --yofc-blue: #009CDE; --yofc-green: #10b981; --yofc-yellow: #f59e0b;
              --shadow-hard: 3px 3px 0px #cbd5e1;
              --shadow-hard-hover: 1px 1px 0px #cbd5e1;
          }
          
          #yofc-sidebar {
              position: fixed; top: 0; right: 0; width: ${SIDEBAR_WIDTH}px; height: 100vh;
              background: var(--bg-main); border-left: var(--border-w) solid var(--border-dark); z-index: 999999;
              color: var(--text-dark); font-family: 'Segoe UI', system-ui, sans-serif; display: flex;
              flex-direction: column; box-shadow: -4px 0 0px rgba(51,65,85,0.05); transition: right 0.3s ease;
          }

          .yofc-header {
              background: var(--yofc-blue); padding: 20px 15px; border-bottom: var(--border-w) solid var(--border-dark); 
              text-align: center; color: #fff;
          }

          .yofc-tab-container { display: flex; background: var(--bg-card); border-bottom: var(--border-w) solid var(--border-dark); }

          .yofc-tab-btn {
              flex: 1; padding: 12px; background: var(--bg-card); color: var(--text-dark); 
              border: none; border-right: var(--border-w) solid var(--border-dark); cursor: pointer; font-weight: 800; 
              font-size: 11px; display: flex; flex-direction: column; align-items: center; gap: 6px;
          }
          .yofc-tab-btn:last-child { border-right: none; }
          .yofc-tab-btn.active { background: #e0f2fe; border-bottom: 4px solid var(--border-dark); padding-bottom: 8px; color: var(--yofc-blue); }

          .yofc-view { flex-direction: column; flex-grow: 1; overflow-y: auto; padding: 20px; }

          .yofc-card {
              background: var(--bg-card); border: var(--border-w) solid var(--border-dark); border-radius: 6px; 
              padding: 15px; margin-bottom: 20px; box-shadow: var(--shadow-hard);
          }

          .yofc-input {
              width: 100%; padding: 10px; background: #f1f5f9; color: var(--text-dark); 
              border: var(--border-w) solid var(--border-dark); border-radius: 4px; outline: none; font-size: 12px; 
              font-weight: 700; transition: all 0.15s; box-shadow: inset 2px 2px 0px rgba(0,0,0,0.05); text-transform: uppercase;
          }
          .yofc-input:focus { background: #fff; border-color: var(--yofc-blue); box-shadow: var(--shadow-hard-hover); transform: translate(-2px, -2px); }

          .yofc-btn {
              width: 100%; padding: 12px; background: var(--yofc-blue); color: #fff; border: var(--border-w) solid var(--border-dark); 
              border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; display: flex; justify-content: center; 
              align-items: center; gap: 8px; box-shadow: var(--shadow-hard); transition: all 0.1s ease;
          }
          .yofc-btn:hover { transform: translate(2px, 2px); box-shadow: var(--shadow-hard-hover); }
          .yofc-btn:active { transform: translate(3px, 3px); box-shadow: 0px 0px 0px transparent; }
          
          .yofc-btn-green { background: var(--yofc-green); }
          .yofc-btn-yellow { background: var(--yofc-yellow); color: var(--border-dark); }

          .yofc-cache-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: var(--border-w) dashed #cbd5e1; font-size: 12px; font-weight: 700; }
          .yofc-cache-item:last-child { border-bottom: none; }
          
          .yofc-badge { background: var(--yofc-blue); color: #fff; padding: 4px 10px; border-radius: 4px; font-weight: 800; font-size: 11px; border: var(--border-w) solid var(--border-dark); box-shadow: 2px 2px 0px var(--border-dark); }

          .yofc-timer-display { font-size: 40px; font-weight: 800; color: var(--text-dark); font-family: 'Courier New', monospace; letter-spacing: 2px; margin: 15px 0; padding: 10px; border: var(--border-w) dashed var(--border-dark); background:#f8fafc; border-radius:6px; }
      `;
    document.head.appendChild(style);
  }

  function inicializarEntorno() {
    if (document.getElementById("yofc-sidebar")) return;
    inyectarEstilos();
    document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;

    const sidebar = document.createElement("div");
    sidebar.id = "yofc-sidebar";

    const toggleBtn = document.createElement("div");
    toggleBtn.id = "yofc-toggle-btn";
    toggleBtn.innerHTML = icons.arrowRight;
    toggleBtn.style.cssText = `position:absolute; top:50%; left:-36px; width:36px; height:60px; background:var(--yofc-blue); border:var(--border-w) solid var(--border-dark); border-right:none; border-radius:6px 0 0 6px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:-2px 2px 0px var(--border-dark); transform:translateY(-50%); transition:all 0.15s ease;`;
    toggleBtn.onmouseover = () => {
      toggleBtn.style.left = "-40px";
      toggleBtn.style.width = "40px";
    };
    toggleBtn.onmouseout = () => {
      toggleBtn.style.left = "-36px";
      toggleBtn.style.width = "36px";
    };
    sidebar.appendChild(toggleBtn);

    sidebar.innerHTML += `
          <div class="yofc-header">
              <h2 style="margin:0; font-size:20px; font-weight:900;">YOFC INJECTOR</h2>
              <div style="font-size:10px; font-weight:700; letter-spacing:1px; margin-top:4px;">OPERATIONS HUB V10.0</div>
          </div>
          
          <div class="yofc-tab-container">
              <button class="yofc-tab-btn active" data-target="inyector">${icons.camera} INYECTOR</button>
              <button class="yofc-tab-btn" data-target="tracker">${icons.clock} TRACKER</button>
          </div>

          <div id="yofc-view-inyector" class="yofc-view" style="display:flex;">
              <span style="font-size:11px; color:var(--text-dark); font-weight:800; margin-bottom:12px;">CACHÉ DE IMÁGENES</span>
              <div id="yofc-cache-list" class="yofc-card" style="padding:0; flex-grow:1; overflow-y:auto;"></div>
              
              <div class="yofc-card" style="margin-bottom:0; background:#f1f5f9; box-shadow:none;">
                  <div id="yofc-context-info" style="font-size:12px; margin-bottom:15px; color:var(--text-dark); font-weight:700; text-align:center;"></div>
                  <button id="btn-inject-unit" class="yofc-btn" style="display:none;">INYECTAR FOTOS</button>
              </div>
          </div>

          <div id="yofc-view-tracker" class="yofc-view" style="display:none;">
              <span style="font-size:11px; color:var(--text-dark); font-weight:800; margin-bottom:8px;">ACTIVIDAD EN CURSO</span>
              <select id="tk-actividad" class="yofc-input" style="margin-bottom:20px; text-transform:none;">
                  <option value="Llamar a encargados/autoridades CADs">Llamar a encargados CADs</option>
                  <option value="Llamar a encargados CAUs">Llamar a encargados CAUs</option>
                  <option value="Actualizar usuarios en el sistema">Actualizar usuarios</option>
                  <option value="Reuniones, capacitaciones y asesorías">Reuniones y asesorías</option>
                  <option value="Actualizar perfiles de Facebook">Actualizar Facebook</option>
                  <option value="Elaboración de reportes">Elaboración de reportes</option>
                  <option value="Elaboración de presentaciones">Elaboración de presentaciones</option>
              </select>

              <div class="yofc-card" style="display:flex; flex-direction:column; align-items:center;">
                  <span style="font-size:11px; color:var(--text-dark); font-weight:800;" id="tk-lbl-estado">LISTO PARA INICIAR</span>
                  <div id="tk-reloj" class="yofc-timer-display">00:00:00</div>
                  <div style="display:flex; gap:12px; width:100%;">
                      <button id="btn-tk-play" class="yofc-btn yofc-btn-green" style="flex:1;">${icons.play} INICIAR</button>
                      <button id="btn-tk-pause" class="yofc-btn yofc-btn-yellow" style="flex:1; opacity:0.5; pointer-events:none; box-shadow:none;">${icons.pause} PAUSA</button>
                  </div>
              </div>

              <div style="display:flex; gap:15px; margin-bottom:20px;">
                  <div class="yofc-card" style="flex:1; display:flex; flex-direction:column; align-items:center; margin-bottom:0; padding:15px;">
                      <span style="font-size:11px; color:var(--text-muted); font-weight:800; margin-bottom:8px;">CANTIDAD</span>
                      <input type="number" id="tk-cantidad" value="0" style="width:100%; text-align:center; border:none; background:transparent; font-size:24px; font-weight:800; color:var(--yofc-blue); outline:none;">
                  </div>
                  <div class="yofc-card" style="flex:1; display:flex; flex-direction:column; align-items:center; margin-bottom:0; padding:15px;">
                      <span style="font-size:11px; color:var(--text-muted); font-weight:800; margin-bottom:8px;">MINUTOS</span>
                      <input type="number" id="tk-minutos-total" value="0" style="width:100%; text-align:center; border:none; background:transparent; font-size:24px; font-weight:800; color:var(--yofc-magenta); outline:none;">
                  </div>
              </div>

              <div>
                  <span style="font-size:11px; color:var(--text-dark); font-weight:800; margin-bottom:8px; display:block;">COMENTARIO / DETALLE</span>
                  <textarea id="tk-comentario" class="yofc-input" placeholder="DETALLE EN MAYÚSCULAS..." style="min-height:90px;"></textarea>
              </div>
          </div>
      `;

    document.body.appendChild(sidebar);

    sidebar.addEventListener("click", async (e) => {
      if (e.target.closest("#yofc-toggle-btn")) {
        isSidebarOpen = !isSidebarOpen;
        sidebar.style.right = isSidebarOpen ? "0px" : `-${SIDEBAR_WIDTH}px`;
        document.body.style.marginRight = isSidebarOpen
          ? `${SIDEBAR_WIDTH}px`
          : "0px";
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
        document
          .querySelectorAll(".yofc-tab-btn")
          .forEach((b) => b.classList.remove("active"));
        document.getElementById(`yofc-view-${target}`).style.display = "flex";
        tabBtn.classList.add("active");
        return;
      }

      if (e.target.closest("#btn-tk-play")) {
        const tracker = await window.getDailyTracker();
        const actName = document.getElementById("tk-actividad").value;
        if (tracker.timer.isRunning && tracker.timer.activeActivity) {
          const pastAct = tracker.timer.activeActivity;
          const now = Math.floor(Date.now() / 1000);
          tracker.timer.activities[pastAct].elapsedSecs +=
            now - tracker.timer.startTime;
        }
        tracker.timer.isRunning = true;
        tracker.timer.activeActivity = actName;
        tracker.timer.startTime = Math.floor(Date.now() / 1000);
        await window.saveDailyTracker(tracker);
        syncTrackerUI();
      }

      if (e.target.closest("#btn-tk-pause")) {
        const tracker = await window.getDailyTracker();
        if (tracker.timer.isRunning && tracker.timer.activeActivity) {
          const now = Math.floor(Date.now() / 1000);
          tracker.timer.activities[tracker.timer.activeActivity].elapsedSecs +=
            now - tracker.timer.startTime;
          tracker.timer.isRunning = false;
          tracker.timer.activeActivity = null;
          tracker.timer.startTime = null;
          await window.saveDailyTracker(tracker);
          syncTrackerUI();
        }
      }
    });

    sidebar.addEventListener("input", async (e) => {
      if (e.target.id === "tk-cantidad" || e.target.id === "tk-comentario") {
        const tracker = await window.getDailyTracker();
        const actName = document.getElementById("tk-actividad").value;
        if (e.target.id === "tk-cantidad")
          tracker.timer.activities[actName].count =
            parseInt(e.target.value) || 0;
        if (e.target.id === "tk-comentario") {
          e.target.value = e.target.value.toUpperCase(); // Forzar mayúsculas según regla
          tracker.timer.activities[actName].comentario = e.target.value;
        }
        await window.saveDailyTracker(tracker);
      }
    });

    sidebar.addEventListener("change", (e) => {
      if (e.target.id === "tk-actividad") syncTrackerUI();
    });
  }

  async function syncTrackerUI() {
    if (typeof window.getDailyTracker !== "function") return;
    try {
      const tracker = await window.getDailyTracker();
      const selector = document.getElementById("tk-actividad");
      const lblEstado = document.getElementById("tk-lbl-estado");
      const txtReloj = document.getElementById("tk-reloj");
      const inpCant = document.getElementById("tk-cantidad");
      const inpMin = document.getElementById("tk-minutos-total");
      const txtComentario = document.getElementById("tk-comentario");
      const btnPlay = document.getElementById("btn-tk-play");
      const btnPause = document.getElementById("btn-tk-pause");

      if (!selector || !tracker) return;

      const actName = selector.value;
      const actData = tracker.timer.activities[actName];

      if (document.activeElement !== inpCant) inpCant.value = actData.count;
      if (document.activeElement !== txtComentario)
        txtComentario.value = actData.comentario || "";

      let currentSecs = actData.elapsedSecs;
      if (tracker.timer.isRunning && tracker.timer.activeActivity === actName) {
        const now = Math.floor(Date.now() / 1000);
        currentSecs += now - tracker.timer.startTime;
        lblEstado.innerText = "CRONÓMETRO ACTIVO";
        lblEstado.style.color = "var(--yofc-green)";
        btnPlay.style.opacity = "0.5";
        btnPlay.style.pointerEvents = "none";
        btnPlay.style.boxShadow = "none";
        btnPlay.style.transform = "translate(2px,2px)";
        btnPause.style.opacity = "1";
        btnPause.style.pointerEvents = "auto";
        btnPause.style.boxShadow = "var(--shadow-hard)";
        btnPause.style.transform = "translate(0,0)";
      } else {
        lblEstado.innerText = "EN PAUSA / DETENIDO";
        lblEstado.style.color = "var(--text-dark)";
        btnPlay.style.opacity = "1";
        btnPlay.style.pointerEvents = "auto";
        btnPlay.style.boxShadow = "var(--shadow-hard)";
        btnPlay.style.transform = "translate(0,0)";
        btnPause.style.opacity = "0.5";
        btnPause.style.pointerEvents = "none";
        btnPause.style.boxShadow = "none";
        btnPause.style.transform = "translate(2px,2px)";
      }

      const h = String(Math.floor(currentSecs / 3600)).padStart(2, "0");
      const m = String(Math.floor((currentSecs % 3600) / 60)).padStart(2, "0");
      const s = String(currentSecs % 60).padStart(2, "0");
      txtReloj.innerText = `${h}:${m}:${s}`;
      if (document.activeElement !== inpMin)
        inpMin.value = Math.floor(currentSecs / 60);
    } catch (e) {}
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
      document.getElementById("yofc-view-tracker") &&
      document.getElementById("yofc-view-tracker").style.display !== "none"
    ) {
      syncTrackerUI();
    }
  }, 1000);
}
