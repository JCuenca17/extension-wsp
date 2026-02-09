/**
 * ============================================================================
 * PROYECTO: YOFC CLOUD MANAGER - SISTEMA DE GESTIÓN DE EVIDENCIAS
 * VERSIÓN: V61
 * * DESARROLLADO POR: JOSE LUIS CUENCA GUTIERREZ
 * ÁREA: Ingeniería de Sistemas / Operaciones
 * FECHA: Febrero 2026
 * * DESCRIPCIÓN TÉCNICA:
 * Backend serverless encargado de la recepción y organización de evidencias.
 * * CARACTERÍSTICAS PRINCIPALES (Diseñadas por el autor):
 * 1. Algoritmo "Anti-Duplicados Nativo": Verificación binaria y hash MD5 
 * para evitar redundancia de archivos sin depender de APIs externas.
 * 2. Enrutamiento Dinámico: Creación automática de estructura de directorios
 * basada en metadatos del autor y fecha.
 * 3. Integridad de Datos: Validación de Base64 y gestión de errores silenciosa
 * para asegurar la continuidad del servicio.
 * ============================================================================
 */

 /**
 * ==========================================================================
 * © 2026 JOSE LUIS CUENCA GUTIERREZ - TODOS LOS DERECHOS RESERVADOS
 * ==========================================================================
 * * AVISO DE PROPIEDAD:
 * Este código fuente, incluyendo los algoritmos de "Anti-Duplicados Nativo"
 * y "Enrutamiento Dinámico", ha sido diseñado y desarrollado exclusivamente
 * por el autor mencionado anteriormente para optimizar los procesos de YOFC.
 * * Queda prohibida la distribución, modificación o uso de este software 
 * fuera del ámbito de la empresa sin la autorización expresa del autor.
 * ==========================================================================
 */
// === YOFC CLOUD MANAGER ===

function doPost(e) {
  var log = [];
  try {
    // 1. Validar Datos
    if (!e || !e.postData) throw new Error("No llegaron datos");
    var payload = JSON.parse(e.postData.contents);
    var datos = payload.datos;
    var destinoId = payload.config.rootId;

    if (!destinoId) throw new Error("Falta el ID de la carpeta destino");
    var carpetaRaiz = DriveApp.getFolderById(destinoId);
    var fechaHoy = Utilities.formatDate(new Date(), "GMT-5", "dd-MM-yy");

    // 2. Procesar Fotos
    for (var i = 0; i < datos.length; i++) {
      try {
        var item = datos[i];
        var autor = item.autor || "Desconocido";
        var nombreSeguro = autor.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ_-]/g, "").trim();

        // A. Obtener Carpeta del AUTOR
        var carpetasAutor = carpetaRaiz.getFoldersByName(nombreSeguro);
        var carpetaDestino = carpetasAutor.hasNext() ? carpetasAutor.next() : carpetaRaiz.createFolder(nombreSeguro);

        // B. Preparar la imagen entrante
        var b64 = item.imagen;
        if (b64.indexOf("base64,") > -1) b64 = b64.split("base64,")[1];
        var decoded = Utilities.base64Decode(b64);
        var blob = Utilities.newBlob(decoded, "image/jpeg", "temp.jpg");

        // C. CALCULAR HUELLA (MD5) ENTRANTE
        // Calculamos esto una sola vez para comparar
        var md5Entrante = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, decoded);
        var huellaEntrante = md5Entrante.reduce(function (str, byte) {
          return str + (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0');
        }, '');

        var tamanoEntrante = blob.getBytes().length;

        // D. VERIFICACIÓN MANUAL (Iterar archivos existentes)
        // Esto es 100% seguro y no requiere activar APIs extrañas
        var archivosExistentes = carpetaDestino.getFiles();
        var esDuplicado = false;

        while (archivosExistentes.hasNext()) {
          var archivoCheck = archivosExistentes.next();

          // 1. Filtro rápido: Si el tamaño es diferente, no es la misma foto (ahorra tiempo)
          if (archivoCheck.getSize() !== tamanoEntrante) continue;

          // 2. Filtro seguro: Si el tamaño coincide, comparamos huella digital
          // (Apps Script no deja leer el MD5 directo sin API, asi que lo calculamos)
          var bytesExistentes = archivoCheck.getBlob().getBytes();
          var md5Existente = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, bytesExistentes);
          var huellaExistente = md5Existente.reduce(function (str, byte) {
            return str + (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0');
          }, '');

          if (huellaEntrante === huellaExistente) {
            esDuplicado = true;
            log.push("[OMITIDO] Ya existe: " + archivoCheck.getName());
            break; // Dejamos de buscar, ya la encontramos
          }
        }

        if (esDuplicado) continue; // Saltamos a la siguiente foto del lote

        // E. GUARDAR (Si llegamos aqui, es nueva)
        var contador = 0;
        var archivosParaNombre = carpetaDestino.getFiles();
        while (archivosParaNombre.hasNext()) {
          if (archivosParaNombre.next().getName().indexOf(fechaHoy) > -1) contador++;
        }
        var secuencia = contador + 1;
        var nombreFinal = fechaHoy + "_" + ("0" + secuencia).slice(-2) + ".jpg";

        var archivoNuevo = carpetaDestino.createFile(blob);
        archivoNuevo.setName(nombreFinal);

        log.push("[OK] " + nombreFinal);

      } catch (errFoto) {
        log.push("[ERROR] " + errFoto.toString());
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", log: log }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (errGeneral) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: errGeneral.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}