/**
 * YOFC INJECTOR - Lector de Memoria RAM Autorizado
 * Este script corre de forma nativa para evadir el bloqueo CSP de Chrome.
 */
setInterval(() => {
  try {
    let openVisitsCount = 0;

    if (
      typeof todasVisitas !== "undefined" &&
      typeof getFechaHoy === "function"
    ) {
      const hoy = getFechaHoy();
      openVisitsCount = todasVisitas.filter(
        (v) => v.estado_visita === "ABIERTA" && v.fecha_visita === hoy,
      ).length;
    } else if (document.getElementById("kpi-asist-abierta")) {
      openVisitsCount =
        parseInt(document.getElementById("kpi-asist-abierta").innerText) || 0;
    }

    if (
      typeof todosCADsInfo !== "undefined" &&
      typeof mapaLideres !== "undefined"
    ) {
      window.postMessage(
        {
          action: "yofc_sync_data",
          cads: todosCADsInfo,
          lideres: mapaLideres,
          openVisits: openVisitsCount,
        },
        "*",
      );
    }
  } catch (e) {
    // Silencioso
  }
}, 2000);
