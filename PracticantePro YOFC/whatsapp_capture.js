/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO EXTRACCIÓN (WHATSAPP WEB)
 * VERSIÓN: V10.0 (Dark Flat Corporate & Multi-Grid Capture)
 * ============================================================================
 */

let panelAbierto = false;
const sys = { active: false, queue: new Map(), history: new Set() };

const btnToggle = document.createElement("button");
btnToggle.innerHTML = `YOFC EXTRACTOR`;
btnToggle.style.cssText =
  "position:fixed; top:15px; left:50%; transform:translateX(-50%); z-index:999999; padding:8px 20px; background:#1e293b; color:#38bdf8; border:2px solid #334155; border-radius:6px; cursor:pointer; font-weight:800; font-family:'Segoe UI', sans-serif; font-size:12px; transition:all 0.15s ease; box-shadow: 3px 3px 0px #0f172a; letter-spacing:1px;";
document.body.appendChild(btnToggle);

btnToggle.onmouseover = () => {
  btnToggle.style.transform = "translateX(-50%) translate(2px, 2px)";
  btnToggle.style.boxShadow = "1px 1px 0px #0f172a";
};
btnToggle.onmouseout = () => {
  btnToggle.style.transform = "translateX(-50%) translate(0px, 0px)";
  btnToggle.style.boxShadow = "3px 3px 0px #0f172a";
};

btnToggle.onclick = () => {
  if (panelAbierto) cerrarSistema();
  else iniciarSistema();
};

function cerrarSistema() {
  detenerSeleccion();
  document
    .querySelectorAll(".yofc-panel, .yofc-tag")
    .forEach((e) => e.remove());
  document.querySelectorAll("img").forEach((img) => {
    img.style.outline = "none";
    delete img.dataset.procesado;
  });
  sys.queue.clear();
  panelAbierto = false;
}

function detenerSeleccion() {
  sys.active = false;
  document.body.style.cursor = "default";
  document.removeEventListener("mouseover", hover);
  document.removeEventListener("click", click, true);
  document.querySelectorAll("*").forEach((el) => {
    if (el.style.outline.includes("dashed")) el.style.outline = "none";
  });
  const btnM = document.getElementById("ym");
  if (btnM) {
    btnM.innerHTML = "[1] SELECCIONAR CHAT";
    btnM.style.background = "#e2e8f0";
    btnM.style.color = "#0f172a";
  }
}

function iniciarSistema() {
  panelAbierto = true;

  const css = {
    panel:
      "position:fixed; top:70px; right:20px; width:300px; background:#1e293b; color:#f8fafc; font-family:'Segoe UI', sans-serif; font-size:12px; border:2px solid #334155; border-radius:8px; box-shadow:4px 4px 0px #0f172a; z-index:999999; display:flex; flex-direction:column; overflow:hidden;",
    head: "background:#0f172a; padding:15px; color:#38bdf8; font-weight:800; text-align:center; letter-spacing:1px; border-bottom:2px solid #334155;",
    body: "padding:20px; display:flex; flex-direction:column; gap:15px;",
    row: "display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #334155; padding-bottom:10px; font-weight:700; color:#94a3b8;",
    val: "background:#0f172a; color:#38bdf8; padding:4px 12px; border-radius:4px; font-weight:800; font-size:14px; border:2px solid #334155; box-shadow:2px 2px 0px #0f172a;",
    btn: "padding:12px; border:2px solid #334155; background:#e2e8f0; color:#0f172a; cursor:pointer; width:100%; font-weight:800; transition:all 0.1s ease; border-radius:6px; box-shadow:3px 3px 0px #0f172a; text-transform:uppercase;",
  };

  const ui = document.createElement("div");
  ui.className = "yofc-panel";
  ui.style.cssText = css.panel;
  ui.onclick = (e) => e.stopPropagation();

  ui.innerHTML = `
      <div style="${css.head}">EXTRACTOR MÚLTIPLE</div>
      <div style="${css.body}">
          <div style="${css.row}"><span>IMÁGENES EN COLA:</span><span id="yc" style="${css.val}">${sys.queue.size}</span></div>
          <button id="ym" style="${css.btn}">[1] SELECCIONAR CHAT</button>
          <button id="ys" style="${css.btn}; opacity:0.5; pointer-events:none;" disabled>[2] ENVIAR A CACHÉ</button>
      </div>`;
  document.body.appendChild(ui);

  const els = {
    c: ui.querySelector("#yc"),
    m: ui.querySelector("#ym"),
    s: ui.querySelector("#ys"),
  };

  els.m.onclick = () => {
    sys.active = !sys.active;
    if (sys.active) {
      els.m.innerHTML = "MODO CAPTURA ACTIVO";
      els.m.style.background = "#38bdf8";
      els.m.style.transform = "translate(2px, 2px)";
      els.m.style.boxShadow = "1px 1px 0px #0f172a";
      document.body.style.cursor = "crosshair";
      document.addEventListener("mouseover", hover);
      document.addEventListener("click", click, true);
    } else detenerSeleccion();
  };

  window.hover = function (e) {
    if (
      !ui.contains(e.target) &&
      e.target.innerText &&
      e.target.innerText.length < 100
    ) {
      document.querySelectorAll("*").forEach((el) => {
        if (el !== e.target && el.style.outline.includes("dashed"))
          el.style.outline = "none";
      });
      e.target.style.outline = "3px dashed #38bdf8";
      e.target.style.outlineOffset = "2px";
    }
  };

  window.click = function (e) {
    if (ui.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();

    const txt = e.target.innerText;
    if (!txt || !txt.trim()) return;
    const auth = txt.split("\n")[0].trim();
    scanGrid(e.target, auth);

    const target = e.target;
    target.style.outline = "4px solid #34d399";
    setTimeout(() => {
      if (sys.active) target.style.outline = "3px dashed #38bdf8";
    }, 300);

    els.c.innerText = sys.queue.size;
    if (sys.queue.size > 0) {
      els.s.disabled = false;
      els.s.style.opacity = "1";
      els.s.style.pointerEvents = "auto";
      els.s.style.background = "#34d399";
    }
  };

  els.s.onclick = () => {
    detenerSeleccion();
    els.s.innerText = "PROCESANDO...";
    els.s.style.transform = "translate(2px, 2px)";
    els.s.style.boxShadow = "1px 1px 0px #0f172a";
    els.s.disabled = true;

    chrome.storage.local.set(
      { yofc_bridge_data: Array.from(sys.queue.values()) },
      () => {
        sys.queue.forEach((val, key) => sys.history.add(key));
        els.s.innerHTML = "¡EXTRACCIÓN EXITOSA!";
        setTimeout(() => {
          sys.queue.clear();
          document.querySelectorAll(".yofc-tag").forEach((t) => t.remove());
          document.querySelectorAll("img").forEach((i) => {
            i.style.outline = "none";
            delete i.dataset.procesado;
          });
          cerrarSistema();
          iniciarSistema();
        }, 2000);
      },
    );
  };

  function scanGrid(node, auth) {
    let container =
      node.closest(".message-in, .message-out") ||
      node.closest('div[role="row"]');
    if (!container) return;
    container.querySelectorAll('img[src^="blob:"]').forEach((img) => {
      if (
        img.naturalWidth > 150 &&
        !sys.history.has(img.src) &&
        !sys.queue.has(img.src)
      )
        mark(img, auth);
      else if (sys.queue.has(img.src) && !img.dataset.procesado) {
        img.style.outline = "4px solid #f43f5e";
        img.dataset.procesado = "1";
      }
    });
  }

  function mark(img, auth) {
    img.style.outline = "4px solid #38bdf8";
    img.style.outlineOffset = "-2px";
    img.dataset.procesado = "1";
    const tag = document.createElement("div");
    tag.className = "yofc-tag";
    tag.innerText = `CAPTURADO`;
    tag.style.cssText =
      "position:absolute; top:6px; right:6px; background:#0f172a; color:#34d399; padding:4px 8px; font-size:10px; font-weight:800; z-index:100; border-radius:4px; border:2px solid #334155; box-shadow:2px 2px 0px #0f172a; pointer-events:none;";
    if (getComputedStyle(img.parentElement).position === "static")
      img.parentElement.style.position = "relative";
    img.parentElement.appendChild(tag);
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext("2d").drawImage(img, 0, 0);
    sys.queue.set(img.src, {
      autor: auth,
      imagen: c.toDataURL("image/jpeg", 0.85),
    });
  }
}
