# Inicio breve y apartados independientes

La segmentación anterior conservaba todos los bloques encadenados en una página larga. Esta actualización cambia el recorrido: con JavaScript activo solo se muestra el apartado elegido. El inicio contiene la portada, cuatro accesos y la promoción semanal; después llega el pie de página.

- Combos conserva la promoción y todos los combos por cultivo.
- Productos muestra las tres líneas y accesos a TRICHO en sustrato y Ácidos húmicos. Estas presentaciones se abren por separado.
- Asesor, Análisis de suelo, Nosotros y Acompañamiento tienen su propia vista.
- Los enlaces existentes `#asesor`, `#analisis`, `#humicos`, etc. se conservan y se pueden compartir. El botón atrás/adelante restaura el apartado. Cada entrada abre por arriba; una recarga conserva el apartado y vuelve a su inicio.
- Las fichas de productos siguen siendo modales. Al cerrarlas se conserva el apartado y la posición de origen, incluido el resultado del asesor.
- El logotipo y el enlace Inicio vuelven a la portada. La navegación indica el apartado activo. Los encabezados reciben el foco al cambiar de vista mediante enlaces.
- Sin JavaScript se conserva el contenido completo y los enlaces internos tradicionales.

No se cambian imágenes, textos de diagnóstico, recomendaciones, cantidades, parámetros de análisis ni lógica del carrito. La promoción mantiene dos litros de TRICHO, un kilogramo de húmicos de regalo y envío gratis. La consulta sigue siendo por WhatsApp, sin precios visibles.

## Verificación

Las suites existentes pasan completas: Incremento 1 (15/15), imágenes del asesor (18/18), referencias visuales (131 tarjetas / 91 resultados), agentes (16 asociaciones / 22 resultados) y los 16 recorridos del maíz.

Prueba de navegación real en Chromium a 1440, 1024, 390 y 320 px: una sola vista visible, enlaces y subpresentaciones, cinco tarjetas de suelo, menú móvil, ausencia de desbordamientos, carrito con cantidades persistentes, resultado del asesor y foto real del cacao, apertura/cierre de fichas desde productos y resultados, historial atrás/adelante, logo, recargas y entradas directas. También se prueba la alternativa sin JavaScript.

Para repetir:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
# En otra terminal, con Playwright instalado:
node verify_page_views.cjs
```

`PLAYWRIGHT_MODULE_PATH`, `CHROMIUM_PATH` y `GALYON_TEST_URL` permiten usar una instalación de navegador y un servidor existentes.
