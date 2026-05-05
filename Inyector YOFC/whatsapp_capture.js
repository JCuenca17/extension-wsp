/**
 * ============================================================================
 * PROYECTO: YOFC INJECTOR - MÓDULO DE EXTRACCIÓN (ORIGEN)
 * VERSIÓN: V70 (Interfaz Profesional)
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ============================================================================
 * © 2026 Jose Luis Cuenca Gutierrez - Todos los derechos reservados.
 * ============================================================================
 */

let panelAbierto = false;
const sys = {
  active: false,
  queue: new Map(),
  history: new Set(),
};

const btnToggle = document.createElement("button");
btnToggle.innerText = "YOFC INJECTOR [ INICIAR ]";
btnToggle.style.cssText =
  "position:fixed; top:10px; left:50%; transform:translateX(-50%); z-index:999999; padding:8px 20px; background:#121212; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer; font-weight:bold; font-family:Consolas, monospace; font-size:12px; transition:0.2s;";
document.body.appendChild(btnToggle);

btnToggle.onmouseover = () => (btnToggle.style.background = "#1e1e1e");
btnToggle.onmouseout = () => (btnToggle.style.background = "#121212");

btnToggle.onclick = () => {
  if (panelAbierto) cerrarSistema();
  else iniciarSistema();
};

function cerrarSistema() {
  detenerSeleccion();
  document.querySelectorAll(".yofc-panel").forEach((e) => e.remove());
  document.querySelectorAll(".yofc-tag").forEach((e) => e.remove());
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
    btnM.innerText = "[1] SELECCIONAR ORIGEN";
    btnM.style.background = "#1e1e1e";
    btnM.style.color = "#fff";
  }
}

function iniciarSistema() {
  panelAbierto = true;

  const css = {
    panel:
      "position:fixed; top:50px; right:20px; width:280px; background:#121212; color:#e0e0e0; font-family:Consolas, monospace; font-size:12px; border:1px solid #333; border-radius:4px; box-shadow:0 10px 30px rgba(0,0,0,0.9); z-index:999999; display:flex; flex-direction:column; overflow:hidden;",
    head: "background:#1a1a1a; padding:12px; color:#fff; font-weight:bold; text-align:center; letter-spacing:2px; border-bottom:1px solid #333;",
    body: "padding:15px; display:flex; flex-direction:column; gap:10px;",
    row: "display:flex; justify-content:space-between; border-bottom:1px solid #222; padding-bottom:5px;",
    val: "color:#4fc3f7; font-weight:bold;",
    btn: "padding:12px; border:1px solid #333; background:#1e1e1e; color:#fff; cursor:pointer; width:100%; font-weight:bold; transition:0.2s; border-radius:2px; text-transform:uppercase;",
    btnActive: "background:#4fc3f7; color:#000; border-color:#4fc3f7;",
    btnSend: "background:#0277bd; border-color:#01579b;",
    tag: "position:absolute; top:4px; right:4px; background:#0277bd; color:#fff; padding:2px 5px; font-size:10px; font-weight:bold; z-index:100; border:1px solid #000;",
  };

  const ui = document.createElement("div");
  ui.className = "yofc-panel";
  ui.style.cssText = css.panel;
  ui.onclick = (e) => e.stopPropagation();

  const renderMain = () => {
    ui.innerHTML = `
            <div style="${css.head}">YOFC INJECTOR</div>
            <div style="${css.body}">
                <div style="${css.row}"><span>DATOS EN MEMORIA</span><span id="yc" style="${css.val}">${sys.queue.size}</span></div>
                <button id="ym" style="${css.btn}">[1] SELECCIONAR ORIGEN</button>
                <button id="ys" style="${css.btn}" disabled>[2] EXTRAER A CACHÉ</button>
                <div id="yst" style="color:#666; font-size:10px; text-align:center; margin-top:5px;">A la espera de selección.</div>
            </div>`;
    bindEvents();
  };

  document.body.appendChild(ui);
  renderMain();

  function bindEvents() {
    const els = {
      c: ui.querySelector("#yc"),
      m: ui.querySelector("#ym"),
      s: ui.querySelector("#ys"),
      st: ui.querySelector("#yst"),
    };

    els.m.onclick = () => {
      sys.active = !sys.active;
      if (sys.active) {
        els.m.innerText = ">> MODO DE CAPTURA ACTIVO <<";
        els.m.style.cssText = css.btn + css.btnActive;
        document.body.style.cursor = "crosshair";
        document.addEventListener("mouseover", hover);
        document.addEventListener("click", click, true);
      } else {
        detenerSeleccion();
      }
    };

    window.hover = function (e) {
      if (
        !ui.contains(e.target) &&
        e.target.innerText &&
        e.target.innerText.length < 80
      ) {
        document.querySelectorAll("*").forEach((el) => {
          if (el !== e.target && el.style.outline.includes("dashed"))
            el.style.outline = "none";
        });
        e.target.style.outline = "1px dashed #4fc3f7";
      }
    };

    window.click = function (e) {
      if (ui.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();

      const txt = e.target.innerText;
      if (!txt || !txt.trim()) return;
      const auth = txt.split("\n")[0].trim();
      const found = scan(e.target, auth);

      const target = e.target;
      target.style.outline = "2px solid #4fc3f7";
      setTimeout(() => {
        if (sys.active) target.style.outline = "1px dashed #4fc3f7";
      }, 200);

      els.c.innerText = sys.queue.size;
      if (sys.queue.size > 0) {
        els.s.disabled = false;
        els.s.style.cssText = css.btn + css.btnSend;
      }

      if (found > 0) els.st.innerText = `Registros añadidos: ${auth}`;
      else els.st.innerText = `Datos redundantes ignorados.`;
    };

    els.s.onclick = () => {
      detenerSeleccion();
      els.s.innerText = "PROCESANDO...";
      els.s.disabled = true;

      const datosExtraidos = Array.from(sys.queue.values());

      chrome.storage.local.set({ yofc_bridge_data: datosExtraidos }, () => {
        sys.queue.forEach((val, key) => sys.history.add(key));

        els.s.innerText = "EXTRACCIÓN EXITOSA";
        els.s.style.background = "#2e7d32";
        els.st.innerText = `Proceda a la plataforma destino para inyección.`;

        setTimeout(() => {
          sys.queue.clear();
          document.querySelectorAll(".yofc-tag").forEach((t) => t.remove());
          document.querySelectorAll("img").forEach((i) => {
            i.style.outline = "none";
            delete i.dataset.procesado;
          });
          renderMain();
        }, 3000);
      });
    };
  }

  function scan(node, auth) {
    let row = node.closest('div[role="row"]');
    if (!row) return 0;
    let s = true,
      add = 0,
      safe = 0;
    while (s && row && safe < 50) {
      safe++;
      row.querySelectorAll('img[src^="blob:"]').forEach((img) => {
        if (
          img.naturalWidth > 200 &&
          !sys.history.has(img.src) &&
          !sys.queue.has(img.src)
        ) {
          mark(img, auth);
          add++;
        } else if (sys.queue.has(img.src) && !img.dataset.procesado) {
          img.style.outline = "4px solid #01579b";
          img.dataset.procesado = "1";
        }
      });
      const next = row.nextElementSibling;
      if (!next) break;
      const meta = next.querySelector("[data-pre-plain-text]");
      if (meta) {
        if (!meta.getAttribute("data-pre-plain-text").includes(auth)) s = false;
      } else if (
        !next.querySelector("img") &&
        next.innerText.trim().length > 15
      )
        s = false;
      row = next;
    }
    return add;
  }

  function mark(img, auth) {
    img.style.outline = "4px solid #01579b";
    img.dataset.procesado = "1";
    const tag = document.createElement("div");
    tag.className = "yofc-tag";
    tag.innerText = `[CAPTURED]`;
    tag.style.cssText = css.tag;
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
