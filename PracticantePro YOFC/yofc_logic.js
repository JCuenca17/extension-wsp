/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE LÓGICA (CORE)
 * VERSIÓN: V4.0 (Corporate Edition - CSP Fix Definitivo)
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

  let lastViewedCAD = null;

  window.getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  window.getDailyTracker = async () => {
    const dateKey = `yofc_tracker_${window.getTodayStr()}`;
    const data = await chrome.storage.local.get(dateKey);
    if (data[dateKey]) return data[dateKey];
    const newTracker = { cads: {} };
    await chrome.storage.local.set({ [dateKey]: newTracker });
    return newTracker;
  };

  window.saveDailyTracker = async (trackerData) => {
    const dateKey = `yofc_tracker_${window.getTodayStr()}`;
    await chrome.storage.local.set({ [dateKey]: trackerData });
    if (typeof window.compilarReporteAutomatico === "function") {
      window.compilarReporteAutomatico();
    }
  };

  // 1. TRACKER SILENCIOSO
  document.addEventListener("click", async (e) => {
    const row = e.target.closest("#tabla-ops tr");
    if (row && row.querySelectorAll("td").length > 2) {
      const idCad = row.cells[0].innerText.trim();
      const estadoOp = row.cells[1].innerText.trim();
      const subEst = row.cells[2].innerText.trim();
      const estadoReal = subEst && subEst !== "—" ? subEst : estadoOp;
      lastViewedCAD = idCad;

      const tracker = await window.getDailyTracker();
      if (!tracker.cads[idCad]) {
        tracker.cads[idCad] = {
          estado_inicial: estadoReal,
          estado_final: estadoReal,
          contactado: false,
        };
        await window.saveDailyTracker(tracker);
      }
    }

    const btn = e.target.closest("button");
    if (!btn) return;

    if (
      btn.classList.contains("btn-cerrar-v") ||
      btn.innerText.includes("Cerrar")
    ) {
      setTimeout(() => {
        if (typeof window.compilarReporteAutomatico === "function") {
          window.compilarReporteAutomatico();
        }
      }, 1500);
    }

    if (!lastViewedCAD) return;

    if (
      btn.innerText.includes("Guardar") &&
      !btn.innerText.includes("Estado") &&
      btn.closest(".comentario-nuevo")
    ) {
      const tracker = await window.getDailyTracker();
      if (tracker.cads[lastViewedCAD]) {
        tracker.cads[lastViewedCAD].contactado = true;
        await window.saveDailyTracker(tracker);
      }
    }

    if (
      btn.innerText.includes("Eliminar") ||
      (btn.getAttribute("onclick") &&
        btn.getAttribute("onclick").includes("eliminarComentario"))
    ) {
      const tracker = await window.getDailyTracker();
      if (tracker.cads[lastViewedCAD]) {
        tracker.cads[lastViewedCAD].contactado = false;
        await window.saveDailyTracker(tracker);
      }
    }

    if (
      btn.innerText.includes("Guardar Estado") ||
      (btn.getAttribute("onclick") &&
        btn.getAttribute("onclick").includes("guardarEstadoOp"))
    ) {
      const newEstado = document.getElementById("o-estado-op").value;
      let newSub = document.getElementById("o-sub-estado").value;
      const estadoReal = !newSub || newSub === "—" ? newEstado : newSub;

      const tracker = await window.getDailyTracker();
      if (tracker.cads[lastViewedCAD]) {
        tracker.cads[lastViewedCAD].estado_final = estadoReal;
        await window.saveDailyTracker(tracker);
      }
    }
  });

  // 2. EXTRACCIÓN SILENCIOSA DESDE LA MEMORIA RAM DE LA PLATAFORMA (Libre de errores CSP)
  if (!document.getElementById("yofc-ram-reader-script")) {
    const s = document.createElement("script");
    s.id = "yofc-ram-reader-script";
    s.src = chrome.runtime.getURL("yofc_ram_reader.js");
    document.head.appendChild(s);
  }

  window.addEventListener("message", async (e) => {
    if (e.data && e.data.action === "yofc_sync_data") {
      const cads = e.data.cads || [];
      const lideres = e.data.lideres || {};

      let dataLid = [];
      let dataAut = [];

      cads.forEach((c) => {
        const id = c["ID CAD"];
        const lid = lideres[id] || {};
        const autNombre = c["NOMBRE AUTORIDAD"] || "";
        const autCel = c["CELULAR_AUTORIDAD"] || "";

        if (lid.nombres && lid.celular_usuario) {
          dataLid.push({
            idCad: id,
            lider: (lid.nombres + " " + (lid.apellidos || "")).trim(),
            celular: lid.celular_usuario,
          });
        }

        if (autNombre.length > 2 && autCel.length >= 9) {
          dataAut.push({
            idCad: id,
            autoridad: autNombre,
            celular: autCel,
          });
        }
      });

      await chrome.storage.local.set({
        yofc_lideres_sync: dataLid,
        yofc_autoridades_sync: dataAut,
        yofc_open_visits: e.data.openVisits || 0,
      });
    }
  });

  // 3. RENDERIZADO INTELIGENTE (ESPEJO DE LA TABLA Y FILTROS)
  window.renderWAPanels = async () => {
    const data = await chrome.storage.local.get([
      "yofc_lideres_sync",
      "yofc_autoridades_sync",
    ]);
    let lideres = data.yofc_lideres_sync || [];
    let autoridades = data.yofc_autoridades_sync || [];

    let cadsVisibles = new Set();
    const secOps = document.getElementById("seccion-operacion");
    const secInfo = document.getElementById("seccion-informacion");

    if (secOps && secOps.classList.contains("activa")) {
      document.querySelectorAll("#tabla-ops tr:not(.empty)").forEach((tr) => {
        if (tr.cells && tr.cells[0])
          cadsVisibles.add(tr.cells[0].innerText.trim());
      });
    } else if (secInfo && secInfo.classList.contains("activa")) {
      document.querySelectorAll("#tabla-info tr.clickable").forEach((tr) => {
        if (tr.cells && tr.cells[0])
          cadsVisibles.add(tr.cells[0].innerText.trim());
      });
    } else {
      lideres.forEach((l) => cadsVisibles.add(l.idCad));
    }

    lideres = lideres.filter((l) => cadsVisibles.has(l.idCad));
    autoridades = autoridades.filter((a) => cadsVisibles.has(a.idCad));

    const foEst = document.getElementById("fo-estado")?.value || "";
    const foAbr = document.getElementById("fo-abriohoy")?.value || "";

    const badgeModo = document.getElementById("wa-modo-badge");
    const txtModo = document.getElementById("wa-modo-texto");

    let reqEvidencia = false;

    if (foEst === "LOCAL ABIERTO" && foAbr === "NO") {
      reqEvidencia = true;
      if (badgeModo) {
        badgeModo.style.background = "#fef2f2";
        badgeModo.style.borderColor = "#fecaca";
      }
      if (txtModo) {
        txtModo.style.color = "#991b1b";
        txtModo.innerText = "REQUIERE EVIDENCIA FOTOGRÁFICA";
      }
    } else {
      if (badgeModo) {
        badgeModo.style.background = "#e0f2fe";
        badgeModo.style.borderColor = "#bae6fd";
      }
      if (txtModo) {
        txtModo.style.color = "#0c4a6e";
        txtModo.innerText = "TODOS LOS CADS VISIBLES - CHAT LIBRE";
      }
    }

    const icons = {
      users: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      userTie: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
      whatsapp: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    };

    const panelActivo =
      document.getElementById("wa-panel-lideres")?.style.display !== "none";
    if (panelActivo) {
      let htmlLid = "";
      lideres.forEach((c) => {
        let num = c.celular.replace(/\D/g, "");
        if (num.length === 9) num = "51" + num;

        const primerNombre = c.lider.split(" ")[0];
        const modoPayload = reqEvidencia ? "evidencia" : "libre";

        htmlLid += `
              <div style="display:flex; flex-direction:column; background:${window.YOFC_THEME.bgCard}; border:1px solid ${window.YOFC_THEME.border}; border-radius:6px; padding:10px;">
                  <div style="font-weight:bold; font-size:11px; color:${window.YOFC_THEME.yofcBlue}; margin-bottom:2px;">${c.idCad}</div>
                  <div style="font-size:10px; color:${window.YOFC_THEME.textPri}; margin-bottom:8px; display:flex; align-items:center; gap:4px;">${icons.users} ${c.lider}</div>
                  <button class="btn-wa-lider" data-cad="${c.idCad}" data-nombre="${primerNombre}" data-telefono="${num}" data-modo="${modoPayload}" style="background:#25D366; color:#fff; border:none; border-radius:4px; padding:6px; font-weight:bold; font-size:10px; cursor:pointer; width:100%; transition:0.2s; display:flex; align-items:center; justify-content:center; gap:4px;" onmouseover="this.style.background='#128C7E'" onmouseout="this.style.background='#25D366'">
                      ${icons.whatsapp} WhatsApp Web
                  </button>
              </div>`;
      });

      const contLid = document.getElementById("lista-contactos");
      const badgeLid = document.getElementById("wa-badge-contactos");
      if (contLid)
        contLid.innerHTML =
          htmlLid ||
          `<div style="color:${window.YOFC_THEME.textSec}; font-size:11px; text-align:center; font-style:italic; padding-top:10px;">[ INFO ] Modifica los filtros de la plataforma para ver CADs aquí.</div>`;
      if (badgeLid) badgeLid.innerText = lideres.length;
    } else {
      let htmlAut = "";
      autoridades.forEach((c) => {
        let num = c.celular.replace(/\D/g, "");
        if (num.length === 9) num = "51" + num;

        htmlAut += `
              <div style="display:flex; flex-direction:column; background:${window.YOFC_THEME.bgCard}; border:1px solid ${window.YOFC_THEME.border}; border-radius:6px; padding:10px;">
                  <div style="font-weight:bold; font-size:11px; color:${window.YOFC_THEME.yofcBlue}; margin-bottom:2px;">${c.idCad}</div>
                  <div style="font-size:10px; color:${window.YOFC_THEME.textPri}; margin-bottom:8px; display:flex; align-items:center; gap:4px;">${icons.userTie} ${c.autoridad}</div>
                  <button class="btn-wa-autoridad" data-telefono="${num}" style="background:#25D366; color:#fff; border:none; border-radius:4px; padding:6px; font-weight:bold; font-size:10px; cursor:pointer; width:100%; transition:0.2s; display:flex; align-items:center; justify-content:center; gap:4px;" onmouseover="this.style.background='#128C7E'" onmouseout="this.style.background='#25D366'">
                      ${icons.whatsapp} WhatsApp Web
                  </button>
              </div>`;
      });

      const contAut = document.getElementById("lista-autoridades");
      const badgeAut = document.getElementById("wa-badge-contactos");
      if (contAut)
        contAut.innerHTML =
          htmlAut ||
          `<div style="color:${window.YOFC_THEME.textSec}; font-size:11px; text-align:center; font-style:italic; padding-top:10px;">[ INFO ] Modifica los filtros de la plataforma para ver CADs aquí.</div>`;
      if (badgeAut) badgeAut.innerText = autoridades.length;
    }
  };

  window.popularListasCADs = () => {
    const selectObj =
      document.getElementById("fa-cad") || document.getElementById("p-cad");
    if (!selectObj || selectObj.options.length <= 1) return;

    const listaCap = document.getElementById("lista-cap");
    const listaUsr = document.getElementById("lista-usr");

    if (listaCap && listaCap.querySelectorAll("input").length === 0) {
      let html = "";
      Array.from(selectObj.options).forEach((opt) => {
        if (opt.value && opt.value !== "") {
          html += `
                  <label style="display:flex; align-items:center; gap:8px; padding:6px; cursor:pointer; border-radius:4px; transition:background 0.2s;" onmouseover="this.style.background='${window.YOFC_THEME.hover}'" onmouseout="this.style.background='transparent'">
                      <input type="checkbox" value="${opt.value}" class="chk-cap" style="cursor:pointer; accent-color:${window.YOFC_THEME.yofcBlue}; width:14px; height:14px;"> 
                      <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:${window.YOFC_THEME.textPri};" title="${opt.value}">${opt.value}</span>
                  </label>`;
        }
      });
      listaCap.innerHTML = html;
      listaUsr.innerHTML = html.replace(/chk-cap/g, "chk-usr");

      document.querySelectorAll(".chk-cap").forEach((c) =>
        c.addEventListener("change", () => {
          document.getElementById("badge-cap").innerText =
            document.querySelectorAll(".chk-cap:checked").length;
          window.compilarReporteAutomatico();
        }),
      );
      document.querySelectorAll(".chk-usr").forEach((c) =>
        c.addEventListener("change", () => {
          document.getElementById("badge-usr").innerText =
            document.querySelectorAll(".chk-usr:checked").length;
          window.compilarReporteAutomatico();
        }),
      );
    }
  };

  // 5. COMPILADOR AUTOMÁTICO (Reporte Diario)
  window.compilarReporteAutomatico = async () => {
    const tracker = await window.getDailyTracker();

    let agrupado = {};
    let listaCambiosFinales = [];
    let totalContactados = 0;
    let totalCambiosReales = 0;

    for (const [cadId, data] of Object.entries(tracker.cads)) {
      const inicial = data.estado_inicial;
      const final = data.estado_final;
      const cambioReal = inicial !== final;

      if (cambioReal) totalCambiosReales++;

      if (data.contactado) {
        totalContactados++;
        let motivo =
          inicial.includes("OPERATIVO") || inicial.includes("ABIERTO")
            ? "OPERATIVOS SIN SUBIR EVIDENCIA"
            : inicial;

        if (!agrupado[motivo])
          agrupado[motivo] = {
            total: 0,
            mantienen: 0,
            subieron: 0,
            cambian: 0,
            detalles_pasan: [],
          };
        agrupado[motivo].total++;

        if (cambioReal) {
          if (
            motivo === "OPERATIVOS SIN SUBIR EVIDENCIA" &&
            final.includes("OPERATIVO")
          ) {
            agrupado[motivo].subieron++;
          } else {
            agrupado[motivo].cambian++;
            agrupado[motivo].detalles_pasan.push(`-${cadId} pasó a ${final}`);
          }
        } else {
          agrupado[motivo].mantienen++;
        }
      }

      if (cambioReal) {
        listaCambiosFinales.push(`-${cadId} cambió de ${inicial} a ${final}`);
      }
    }

    const countEl = document.getElementById("tracker-count");
    const changeEl = document.getElementById("tracker-changes");
    if (countEl) countEl.innerText = `${totalContactados} CADs`;
    if (changeEl) changeEl.innerText = totalCambiosReales;

    const regionSelect = document.getElementById("region-select");
    const regionSpan = document.getElementById("sidebar-region");
    const region = regionSelect
      ? regionSelect.value
      : regionSpan
        ? regionSpan.innerText
        : "REGION";
    const hoy = new Date();
    const fechaFormat = `${String(hoy.getDate()).padStart(2, "0")}/${String(hoy.getMonth() + 1).padStart(2, "0")}/${hoy.getFullYear()}`;

    const ab = document.getElementById("ext-abiertos")
      ? document.getElementById("ext-abiertos").value
      : "0";
    const capNodes = Array.from(
      document.querySelectorAll(".chk-cap:checked"),
    ).map((n) => n.value);
    const usrNodes = Array.from(
      document.querySelectorAll(".chk-usr:checked"),
    ).map((n) => n.value);

    const capCount = String(capNodes.length).padStart(2, "0");
    const usrCount = String(usrNodes.length).padStart(2, "0");

    const capStr = capNodes.length > 0 ? `\n${capNodes.join("\n")}` : "";
    const usrStr = usrNodes.length > 0 ? `\n${usrNodes.join("\n")}` : "";

    const dataStore = await chrome.storage.local.get("yofc_open_visits");
    let visitasAbiertas = dataStore.yofc_open_visits || 0;

    let textoPunto5 = `5. Se cerraron todos los visitantes registrados en el día.`;
    if (visitasAbiertas > 0) {
      textoPunto5 = `5. Faltan cerrar ${visitasAbiertas} visitantes registrados en el día.`;
    }

    let txt = `Resumen de actividades diario ${region} ${fechaFormat}\n\n`;
    txt += `1. Abrieron ${ab} locales, se subieron las fotos al drive.\n\n`;

    let hayPunto2 = false;
    let punto2Str = "";
    let prefix = "2.";

    for (const [motivo, g] of Object.entries(agrupado)) {
      hayPunto2 = true;
      let wordCads = g.total === 1 ? "CAD" : "CADs";

      if (motivo === "OPERATIVOS SIN SUBIR EVIDENCIA") {
        let subStr = g.subieron > 0 ? `, ${g.subieron} subieron evidencia` : "";
        if (g.cambian === 0) {
          punto2Str += `${prefix} Se contactó a ${g.total} ${wordCads} operativos por no subir evidencia: ${g.mantienen} se mantienen operativos${subStr}. Los detalles están en el campo 'HISTORIAL DE COMENTARIOS'.\n\n`;
        } else {
          let pasaStr =
            g.cambian === 1
              ? `1 pasa a '${g.detalles_pasan[0].split(" pasó a ")[1]}'`
              : `${g.cambian} pasan a nuevos estados`;
          punto2Str += `${prefix} Se contactó a ${g.total} ${wordCads} operativos por no subir evidencia: ${g.mantienen} se mantienen operativos${subStr}, ${pasaStr}.\n`;
          punto2Str += g.detalles_pasan.join(";\n") + ";\n\n";
        }
      } else {
        let motivoFormat =
          motivo.charAt(0).toUpperCase() + motivo.slice(1).toLowerCase();
        if (g.cambian === 0) {
          punto2Str += `${prefix} Se contactó a ${g.total} ${wordCads} por motivo de '${motivoFormat}': se mantienen, los detalles en el campo 'HISTORIAL DE COMENTARIOS'.\n\n`;
        } else {
          let pasaStr =
            g.cambian === 1
              ? `1 pasa a '${g.detalles_pasan[0].split(" pasó a ")[1]}'`
              : `${g.cambian} pasan a nuevos estados`;
          punto2Str += `${prefix} Se contactó a ${g.total} ${wordCads} por motivo de '${motivoFormat}': ${g.mantienen} se mantienen, ${pasaStr}.\n`;
          punto2Str += g.detalles_pasan.join(";\n") + ";\n\n";
        }
      }
      prefix = ".";
    }

    if (listaCambiosFinales.length > 0) {
      if (!hayPunto2)
        punto2Str += `2. Cambios de Estado Generales:\n${listaCambiosFinales.join("\n")}\n\n`;
      else
        punto2Str += `Cambios de Estado Generales:\n${listaCambiosFinales.join("\n")}\n\n`;
      hayPunto2 = true;
    }

    if (!hayPunto2) punto2Str = `2. 00 Cambios de Estado\n\n`;

    txt += punto2Str;
    txt += `3. ${capCount} Encargados Capacitados${capStr}\n\n`;
    txt += `4. ${usrCount} Usuarios creados${usrStr}\n\n`;
    txt += textoPunto5;

    const txtArea = document.getElementById("txt-reporte");
    if (txtArea) txtArea.value = txt;
  };

  // 6. LÓGICA DEL INYECTOR
  window.actualizarInterfazInyector = async () => {
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

    const tituloEl = document.getElementById("ops-detalle-titulo");
    const cadActual = tituloEl ? tituloEl.innerText.trim() : null;

    if (cadActual && conteo[cadActual]) {
      if (contextInfo)
        contextInfo.innerHTML = `Entorno identificado:<br><b style="color:${window.YOFC_THEME.textPri};">${cadActual}</b><br><br>Registros pendientes: ${conteo[cadActual]}`;
      if (btn) {
        btn.style.display = "flex";
        btn.onclick = () => window.ejecutarInyeccionUnitaria(cadActual);
      }
    } else {
      if (contextInfo)
        contextInfo.innerHTML = cadActual
          ? `<span style="color:${window.YOFC_THEME.yofcMagenta};">El CAD [${cadActual}] no posee registros en la caché.</span>`
          : "Navegue a un CAD activo para habilitar la inyección.";
      if (btn) btn.style.display = "none";
    }
  };

  window.ejecutarInyeccionUnitaria = async (cadActual) => {
    const data = await chrome.storage.local.get("yofc_bridge_data");
    let fotos = data.yofc_bridge_data || [];
    const index = fotos.findIndex(
      (f) => f.autor.split("\n")[0].trim() === cadActual,
    );
    if (index === -1) return;

    const inputFiles = document.getElementById("o-ap-fotos-input");
    if (!inputFiles) return;

    try {
      const res = await fetch(fotos[index].imagen);
      const blob = await res.blob();
      const file = new File([blob], `evidencia_${cadActual}.jpg`, {
        type: "image/jpeg",
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputFiles.files = dataTransfer.files;
      inputFiles.dispatchEvent(new Event("change", { bubbles: true }));

      fotos.splice(index, 1);
      await chrome.storage.local.set({ yofc_bridge_data: fotos });
      window.actualizarInterfazInyector();
    } catch (e) {
      console.error(e);
    }
  };
}
