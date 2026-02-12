/**
 * ============================================================================
 * PROYECTO: YOFC CLOUD MANAGER - EXTENSIÓN DE NAVEGADOR (CLIENTE)
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ÁREA: Ingeniería de Sistemas / Operaciones
 * FECHA: Febrero 2026
 * * DESCRIPCIÓN TÉCNICA:
 * Módulo de inyección Frontend para WhatsApp Web. Realiza scraping del DOM,
 * gestión de colas en memoria y comunicación asíncrona con Google Cloud.
 * * CARACTERÍSTICAS PRINCIPALES (Diseñadas por el autor):
 * 1. Arquitectura "On-Demand": Sistema de activación por demanda para 
 * optimizar recursos del navegador (Zero-Overhead cuando está inactivo).
 * 2. Motor de Scraping DOM: Algoritmo de extracción de blobs de imágenes 
 * y metadatos de autoría en tiempo real directamente del renderizado web.
 * 3. Interfaz (Dark Mode): Panel de control inyectado dinámicamente 
 * con soporte para configuración multi-usuario y feedback visual de estado.
 * ============================================================================
 */

/**
 * ==========================================================================
 * © 2026 JOSE LUIS CUENCA GUTIERREZ - TODOS LOS DERECHOS RESERVADOS
 * ==========================================================================
 * * AVISO DE PROPIEDAD INTELECTUAL:
 * Este código fuente (JavaScript), incluyendo el diseño de la interfaz (UI),
 * la lógica de extracción de datos y el protocolo de comunicación, son 
 * propiedad intelectual exclusiva de JOSE LUIS CUENCA GUTIERREZ.
 * * LICENCIA:
 * Su uso está autorizado únicamente para la optimización de procesos
 * internos. Queda estrictamente prohibida la ingeniería inversa, copia,
 * distribución o modificación sin la autorización escrita del autor.
 * ==========================================================================
 */

// === YOFC CLOUD MANAGER ===

let panelAbierto = false;
const sys = {
    active: false,
    queue: new Map(),    // Lo que vas a subir AHORA (se borra al cerrar)
    history: new Set(),  // Lo que YA subiste (NO se borra al cerrar)
    rootId: localStorage.getItem('yofc_root_id') || '',
    scriptUrl: localStorage.getItem('yofc_script_url') || ''
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleYOFC") {
        if (panelAbierto) cerrarSistema();
        else iniciarSistema();
    }
});

function cerrarSistema() {
    // Al cerrar, limpiamos la selección visual y la COLA actual
    detenerSeleccion();
    document.querySelectorAll('.yofc-panel').forEach(e => e.remove());
    document.querySelectorAll('.yofc-tag').forEach(e => e.remove());
    document.querySelectorAll('img').forEach(img => { img.style.outline = 'none'; delete img.dataset.procesado; });

    // IMPORTANTE: Borramos la cola actual para que al abrir empiece en 0
    sys.queue.clear();
    // PERO NO borramos sys.history (eso se queda guardado en memoria)

    panelAbierto = false;
}

function detenerSeleccion() {
    sys.active = false;
    document.body.style.cursor = "default";
    document.removeEventListener('mouseover', hover);
    document.removeEventListener('click', click, true);
    document.querySelectorAll('*').forEach(el => {
        if (el.style.outline.includes('dashed')) el.style.outline = 'none';
    });
    const btnM = document.getElementById('ym');
    if (btnM) {
        btnM.innerText = "[1] SELECCIONAR";
        btnM.style.background = '#1e1e1e';
        btnM.style.color = '#fff';
        btnM.style.borderColor = '#444';
    }
}

function iniciarSistema() {
    panelAbierto = true;

    // CSS
    const css = {
        panel: 'position:fixed; top:20px; right:20px; width:300px; background:#121212; color:#e0e0e0; font-family:Consolas,sans-serif; font-size:12px; border:1px solid #333; border-radius:4px; box-shadow:0 10px 30px rgba(0,0,0,0.9); z-index:999999; display:flex; flex-direction:column;',
        head: 'background:#263238; padding:10px; color:#fff; font-weight:bold; border-bottom:1px solid #102027; display:flex; justify-content:space-between; align-items:center;',
        body: 'padding:15px; display:flex; flex-direction:column; gap:10px;',
        row: 'display:flex; justify-content:space-between; border-bottom:1px solid #333; padding-bottom:5px;',
        val: 'color:#fff; font-weight:bold;',
        btn: 'padding:12px; border:1px solid #444; background:#1e1e1e; color:#fff; cursor:pointer; width:100%; text-transform:uppercase; transition:0.2s; font-size:11px;',
        btnActive: 'background:#ffd600; color:#000; border-color:#ffd600;',
        btnSend: 'background:#1b5e20; border-color:#2e7d32;',
        input: 'width:96%; background:#000; border:1px solid #444; color:#fff; padding:8px; margin-top:5px; margin-bottom:10px; font-family:inherit;',
        label: 'font-size:10px; color:#aaa; margin-bottom:2px;',
        tag: 'position:absolute; top:4px; right:4px; background:#263238; color:#fff; padding:2px 5px; font-size:10px; font-weight:bold; z-index:100; border:1px solid #fff;'
    };

    const ui = document.createElement('div');
    ui.className = 'yofc-panel';
    ui.style.cssText = css.panel;
    ui.onclick = e => e.stopPropagation();

    const renderMain = () => {
        const cadsUnicos = new Set();
        sys.queue.forEach(v => cadsUnicos.add(v.autor));

        const configOk = sys.rootId && sys.scriptUrl;
        const statusText = configOk ? "Sistema listo." : "[!] FALTA CONFIGURACION";

        ui.innerHTML = `
            <div style="${css.head}">
                <span>YOFC MANAGER</span>
                <span id="btnConfig" style="cursor:pointer; font-size:10px; border:1px solid #fff; padding:3px 6px;">CONFIG</span>
            </div>
            <div style="${css.body}">
                <div style="${css.row}"><span>FOTOS EN COLA</span><span id="yc" style="${css.val}">${sys.queue.size}</span></div>
                <div style="${css.row}"><span>CADs</span><span id="ya" style="${css.val}">${cadsUnicos.size}</span></div>
                
                <button id="ym" style="${css.btn}">[1] SELECCIONAR</button>
                <button id="ys" style="${css.btn}" disabled>[2] SUBIR AHORA</button>
                <div id="yst" style="color:${configOk ? '#888' : '#ff5252'}; font-size:10px; text-align:center; margin-top:5px;">${statusText}</div>
            </div>`;
        bindEvents();
    };

    const renderConfig = () => {
        ui.innerHTML = `
            <div style="${css.head}"><span>CONFIGURACION</span><span id="btnCloseConfig" style="cursor:pointer; border:1px solid #fff; padding:0 5px;">X</span></div>
            <div style="${css.body}">
                <div style="${css.label}">1. URL DEL SCRIPT (APPS SCRIPT):</div>
                <input id="inputScript" type="text" style="${css.input}" placeholder="https://script.google.com/..." value="${sys.scriptUrl}">
                <div style="${css.label}">2. LINK CARPETA DESTINO (DRIVE):</div>
                <input id="inputFolder" type="text" style="${css.input}" placeholder="https://drive.google.com/..." value="${sys.rootId}">
                <button id="btnSave" style="${css.btn} background:#263238; margin-top:5px;">GUARDAR DATOS</button>
            </div>`;

        ui.querySelector('#btnCloseConfig').onclick = renderMain;

        ui.querySelector('#btnSave').onclick = () => {
            const urlVal = ui.querySelector('#inputScript').value.trim();
            let folderVal = ui.querySelector('#inputFolder').value.trim();
            const match = folderVal.match(/[-\w]{25,}/);
            if (match) folderVal = match[0];

            if (urlVal && folderVal) {
                sys.scriptUrl = urlVal;
                sys.rootId = folderVal;
                localStorage.setItem('yofc_script_url', urlVal);
                localStorage.setItem('yofc_root_id', folderVal);
                alert("[OK] Datos guardados.");
                renderMain();
            } else {
                alert("[ERROR] Datos invalidos.");
            }
        };
    };

    document.body.appendChild(ui);
    renderMain();

    function bindEvents() {
        const els = { c: ui.querySelector('#yc'), a: ui.querySelector('#ya'), m: ui.querySelector('#ym'), s: ui.querySelector('#ys'), st: ui.querySelector('#yst'), conf: ui.querySelector('#btnConfig') };
        els.conf.onclick = renderConfig;

        els.m.onclick = () => {
            sys.active = !sys.active;
            if (sys.active) {
                els.m.innerText = ">> MODO MULTIPLE ACTIVO <<";
                els.m.style.cssText = css.btn + css.btnActive;
                document.body.style.cursor = "crosshair";
                document.addEventListener('mouseover', hover);
                document.addEventListener('click', click, true);
            } else {
                detenerSeleccion();
            }
        };

        function hoverFn(e) {
            if (!ui.contains(e.target) && e.target.innerText && e.target.innerText.length < 80) {
                document.querySelectorAll('*').forEach(el => {
                    if (el !== e.target && el.style.outline.includes('dashed')) el.style.outline = 'none';
                });
                e.target.style.outline = "1px dashed #ffd600";
            }
        }

        function clickFn(e) {
            if (ui.contains(e.target)) return;
            e.preventDefault();
            e.stopPropagation();

            const txt = e.target.innerText;
            if (!txt || !txt.trim()) return;
            const auth = txt.split('\n')[0].trim();

            const found = scan(e.target, auth);

            const target = e.target;
            target.style.outline = "2px solid #ffd600";
            setTimeout(() => { if (sys.active) target.style.outline = "1px dashed #ffd600"; }, 200);

            const cadsUnicos = new Set();
            sys.queue.forEach(v => cadsUnicos.add(v.autor));
            els.c.innerText = sys.queue.size; els.a.innerText = cadsUnicos.size;

            if (sys.queue.size > 0) { els.s.disabled = false; els.s.style.cssText = css.btn + css.btnSend; }

            if (found > 0) {
                els.st.innerText = `Agregado: ${auth} (+${found} nuevas)`;
            } else {
                els.st.innerText = `Todas las fotos de ${auth} ya estaban subidas o en cola.`;
            }
        }

        window.hover = hoverFn;
        window.click = clickFn;

        els.s.onclick = () => {
            if (!sys.scriptUrl || !sys.rootId) return alert("Falta configuracion.");

            detenerSeleccion();
            els.s.innerText = "SUBIENDO..."; els.s.disabled = true; els.s.style.background = "#333";
            els.st.innerText = "Conectando...";

            const payload = { config: { rootId: sys.rootId }, datos: Array.from(sys.queue.values()) };

            chrome.runtime.sendMessage({ action: "uploadToDrive", url: sys.scriptUrl, data: payload }, (res) => {
                if (res && res.success) {
                    let omitidos = 0, subidos = 0;
                    res.result.log.forEach(l => {
                        if (l.includes("[OMITIDO]")) omitidos++;
                        if (l.includes("[OK]")) subidos++;
                    });

                    sys.queue.forEach((val, key) => {
                        sys.history.add(key); // Guardamos la URL/Src para no volver a subirla NUNCA en esta sesión
                    });

                    els.s.innerText = "COMPLETADO";
                    els.st.innerText = `Subidos: ${subidos} | Duplicados: ${omitidos}`;
                    setTimeout(() => {
                        sys.queue.clear(); // Limpiamos la cola actual
                        document.querySelectorAll('.yofc-tag').forEach(t => t.remove());
                        document.querySelectorAll('img').forEach(i => { i.style.outline = 'none'; delete i.dataset.procesado; });
                        renderMain(); // Volvemos a cero en pantalla, PERO sys.history RECUERDA TODO
                    }, 2500);
                } else {
                    els.s.innerText = "ERROR";
                    alert("Fallo: " + (res ? res.error : "Desconocido"));
                    els.s.disabled = false;
                }
            });
        };
    }

    function scan(node, auth) {
        let row = node.closest('div[role="row"]'); if (!row) return 0;
        let s = true, add = 0, safe = 0;
        while (s && row && safe < 50) {
            safe++;
            row.querySelectorAll('img[src^="blob:"]').forEach(img => {
                if (img.naturalWidth > 200 && !sys.history.has(img.src) && !sys.queue.has(img.src)) {
                    mark(img, auth);
                    add++;
                } else if (sys.queue.has(img.src)) {
                    if (!img.dataset.procesado) {
                        img.style.outline = "4px solid #263238";
                        img.dataset.procesado = "1";
                    }
                }
            });
            const next = row.nextElementSibling;
            if (!next) break;
            const meta = next.querySelector('[data-pre-plain-text]');
            if (meta) { if (!meta.getAttribute('data-pre-plain-text').includes(auth)) s = false; }
            else if (!next.querySelector('img') && next.innerText.trim().length > 15) s = false;
            row = next;
        }
        return add;
    }

    function mark(img, auth) {
        img.style.outline = "4px solid #263238"; img.dataset.procesado = "1";
        const tag = document.createElement('div'); tag.className = 'yofc-tag'; tag.innerText = `[OK] ${auth}`; tag.style.cssText = css.tag;
        if (getComputedStyle(img.parentElement).position === 'static') img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(tag);
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        sys.queue.set(img.src, { autor: auth, imagen: c.toDataURL('image/jpeg', 0.85) });
    }
}