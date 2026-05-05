# YOFC CLOUD MANAGER - SISTEMA DE GESTIÓN DE EVIDENCIAS

**Desarrollado por:** Jose Luis Cuenca Gutierrez
**Departamento:** Ingeniería de Sistemas / Operaciones
**Fecha de Actualización:** Febrero 2026

## DESCRIPCIÓN DEL PROYECTO

YOFC Cloud Manager es una solución de automatización de procesos (RPA) diseñada para optimizar el flujo de trabajo de recolección, clasificación y almacenamiento de evidencias fotográficas. El sistema establece un puente directo entre la interfaz web de WhatsApp y Google Drive, eliminando la gestión manual de archivos.

La arquitectura se basa en un modelo Cliente-Servidor híbrido: una extensión de navegador (Chrome) encargada de la extracción de datos en el Frontend, y un script en la nube (Google Apps Script) que gestiona el almacenamiento y la integridad de los datos en el Backend.

## ARQUITECTURA TÉCNICA Y CARACTERÍSTICAS

El sistema integra algoritmos avanzados para garantizar la eficiencia operativa y la integridad de la información:

### 1. Arquitectura On-Demand (Cliente)
La extensión opera bajo un modelo de ejecución por demanda. Los scripts de inyección de contenido permanecen inactivos hasta que el usuario invoca la herramienta, garantizando un consumo nulo de memoria RAM y CPU cuando el sistema no está en uso.

### 2. Sistema de Doble Validación Anti-Duplicados
Para asegurar que no se consuma almacenamiento innecesario ni se generen archivos redundantes, el sistema implementa dos capas de filtrado:
* **Filtrado en Frontend (V65):** Implementación de memoria persistente durante la sesión. El sistema recuerda los identificadores de recursos (URI) procesados, impidiendo su reenvío incluso si la interfaz de usuario se reinicia.
* **Filtrado en Backend (V61):** Verificación de integridad mediante algoritmo MD5. El servidor calcula el hash binario de la imagen entrante y lo compara con los archivos existentes en el directorio de destino antes de confirmar la escritura.

### 3. Enrutamiento Dinámico de Archivos
El sistema organiza automáticamente la información sin intervención humana.
* **Nivel 1:** Carpeta raíz definida por el usuario.
* **Nivel 2:** Subdirectorios generados dinámicamente basados en el nombre del remitente (CAD).
* **Nivel 3:** Nomenclatura secuencial de archivos basada en la fecha actual (dd-MM-yy_secuencia.jpg).

### 4. Configuración Multi-Tenant
El sistema permite que múltiples usuarios utilicen la misma extensión base conectándose a sus propias instancias de Google Drive. La configuración de endpoints (URL del Script y ID de Carpeta) se almacena localmente en el navegador del usuario.

---

## GUÍA DE IMPLEMENTACIÓN

Para desplegar el sistema, se requieren dos pasos: la configuración del servidor (Backend) y la instalación del cliente (Frontend).

### PARTE 1: Configuración del Backend (Google Apps Script)

Este componente actúa como la API que recibe las imágenes y las guarda en Drive.

1.  Acceda a [Google Apps Script](https://script.google.com/) e inicie sesión con su cuenta personal.
2.  Cree un **Nuevo proyecto**.
3.  Copie el código fuente del archivo `Código.gs` proporcionado en este repositorio y péguelo en el editor `Código.gs`.
4.  Guarde el proyecto (Ctrl + S).
5.  **Despliegue de la Aplicación Web (Paso Crítico):**
    * Haga clic en el botón **Implementar** > **Nueva implementación**.
    * Seleccione el tipo: **Aplicación web**.
    * Configure los siguientes parámetros estrictamente:
        * **Descripción:** Versión 1.0.
        * **Ejecutar como:** `Yo` (su dirección de correo electrónico).
        * **Quién tiene acceso:** `Cualquier usuario` (Esto es necesario para permitir la conexión desde la extensión).
    * Haga clic en **Implementar**.
6.  Autorice los permisos solicitados por Google.
7.  Copie la **URL de la aplicación web** generada (finaliza en `/exec`). Esta será su API Endpoint.

### PARTE 2: Instalación del Frontend (Chrome Extension)

1.  Descargue o clone este repositorio en su equipo local.
2.  Abra Google Chrome y navegue a `chrome://extensions/`.
3.  Habilite el **Modo de desarrollador** en la esquina superior derecha.
4.  Haga clic en el botón **Cargar descomprimida**.
5.  Seleccione la carpeta raíz del repositorio descargado.

---

## MANUAL DE CONFIGURACIÓN Y USO

Una vez instalados ambos componentes, deben vincularse:

### 1. Vinculación inicial
1.  Abra WhatsApp Web y actualice la página.
2.  Haga clic en el icono de la extensión **YOFC Manager** en la barra de herramientas del navegador.
3.  En el panel de control, seleccione el botón **[CONFIG]**.
4.  Ingrese los datos requeridos:
    * **URL DEL SCRIPT:** Pegue la URL obtenida en la Parte 1.
    * **LINK CARPETA DESTINO:** Pegue el enlace (o ID) de la carpeta de Google Drive donde se almacenarán las evidencias, esta actualización debe ser diaria.
5.  Haga clic en **GUARDAR DATOS**.

### 2. Proceso de Carga
1.  Haga clic en el botón **[1] SELECCIONAR**.
2.  El cursor cambiará a modo de selección. Haga clic sobre los nombres de los remitentes o en el chat de WhatsApp.
3.  El sistema identificará las imágenes válidas y las marcará visualmente con la etiqueta `[OK]`.
4.  Una vez finalizada la selección, haga clic en **[2] SUBIR AHORA**.
5.  Espere el mensaje de confirmación que indicará la cantidad de archivos subidos y omitidos por duplicidad.

---

## SOLUCIÓN DE PROBLEMAS

**Error: SyntaxError: Unexpected token < in JSON**
* **Causa:** La extensión está recibiendo una página HTML de error en lugar de una respuesta JSON.
* **Solución:** Verifique la implementación del Apps Script. Asegúrese de que el permiso "Quién tiene acceso" esté configurado como "Cualquier usuario".

**Error: Las imágenes se duplican al recargar la página**
* **Causa:** Al recargar la página, se limpia la memoria local del navegador.
* **Solución:** El sistema Backend rechazará los archivos duplicados basándose en su contenido (hash MD5), por lo que la integridad de la carpeta de destino se mantiene segura aunque la interfaz intente reenviarlos.

---

## DERECHOS DE AUTOR Y LICENCIA

**© 2026 Jose Luis Cuenca Gutierrez**

Este software es propiedad intelectual del desarrollador mencionado. Queda prohibida la ingeniería inversa, redistribución comercial o modificación del código fuente sin la autorización expresa y por escrito del autor.
