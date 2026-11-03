# Flujo de desarrollo de GALYON

- Trabajar en el fork `driveras0104-hue/galyon`, sobre la rama `xavier` actualizada. Comprobar el estado de Git antes de actualizar y preservar modificaciones pendientes.
- El usuario autoriza guardar y subir directamente a `xavier` los cambios que solicite y autorice. No se necesita una Pull Request intermedia salvo petición expresa o una restricción real del repositorio. Usar push normal; nunca forzar la actualización de la rama.
- No modificar `main` ni el repositorio `AaronCarvajalV/galyon`. No fusionar con el sitio oficial.
- El proyecto Vercel de pruebas debe estar conectado exclusivamente al fork, con `xavier` como Production Branch y un dominio propio de ese proyecto. Sus despliegues automáticos al subir cambios autorizados forman parte del flujo de pruebas. No modificar el proyecto Vercel ni los dominios del sitio oficial.
- Conservar diseño y funcionalidades existentes, salvo los cambios expresamente pedidos. El sitio es estático: no necesita dependencias ni compilación.
- Validar con `node verify_increment1.js`, `node verify_asesor_images.js` y comprobaciones HTTP/navegador adecuadas al cambio. La base actual presenta dos fallos conocidos en la segunda suite porque el PNG original de WhatsApp tiene mayúsculas y no es WebP; distinguirlos de nuevas regresiones, sin omitir pruebas ni falsear sus resultados.
- Servir el sitio completo desde su raíz para comprobarlo. No entregar `index.html` aislado como vista previa. No prometer una URL pública hasta verificarla.
- Cada tarea en la nube ya está aislada: usar el checkout existente y no crear worktrees salvo petición expresa.
