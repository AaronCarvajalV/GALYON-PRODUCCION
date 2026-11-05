# Sitio de pruebas de xavier

Crear un proyecto Vercel separado, por ejemplo `galyon-pruebas`, conectado a `driveras0104-hue/galyon`. No reutilizar el proyecto ni los dominios del sitio oficial.

Configuración de importación:

- Framework Preset: Other.
- Root Directory: raíz del repositorio (`.`).
- Production Branch: `xavier` (Settings → Environments → Production → Branch Tracking; en interfaces anteriores, Settings → Git → Production Branch).
- Build Command e Install Command: vacíos. Output Directory: `.`. Estos valores se incluyen en `vercel.json`.
- No se requieren variables de entorno ni secretos.

Si GitHub no muestra el fork, conceder a la integración de Vercel acceso a este repositorio desde la cuenta `driveras0104-hue`. No se necesita acceso al repositorio de AaronCarvajalV.

Si la importación usa inicialmente `main`, seleccionar `xavier` antes del primer despliegue si la interfaz lo permite. En caso contrario, cambiar Production Branch a `xavier` después de crear el proyecto y desplegar esa rama explícitamente desde el panel de Vercel.

La URL estable será el dominio de producción que Vercel asigne a **este proyecto de pruebas**, visible en Settings → Domains. El nombre solicitado puede no estar disponible: usar el dominio realmente asignado, no deducirlo del nombre. No usar las URL individuales de cada despliegue como enlace estable.

Cada push a `xavier` actualizará ese dominio cuando el despliegue automático termine correctamente. Los cambios no aparecen durante la construcción del despliegue: esperar el estado Ready y refrescar. La configuración obliga al navegador a revalidar recursos para evitar que conserve imágenes antiguas durante un año.

Comprobar en la URL HTTPS real: portada, styles.css, script.js, imágenes y secuencia de tres fotografías en «EN CAMPO Y A DISTANCIA». Confirmar en Vercel que el despliegue pertenece al último commit de `xavier`. Mantener la configuración de protección de acceso que el usuario elija; si está protegida, acceder con la cuenta autorizada.

La conexión GitHub–Vercel y la selección de la rama pertenecen al panel del proyecto; `vercel.json` no puede crear ni autenticar esa conexión. No se ha afirmado que exista un proyecto conectado hasta comprobarlo.
