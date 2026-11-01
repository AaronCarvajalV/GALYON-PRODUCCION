# GALYON — Biotecnología Aplicada a la Agricultura

> **Soluciones microbiológicas para el campo ecuatoriano, análisis de suelo y acompañamiento agronómico personalizado.**

![Version](https://img.shields.io/badge/version-v5.7.6-143d2c.svg?style=flat-square)
![Stack](https://img.shields.io/badge/tech_stack-HTML5_|_CSS3_|_Vanilla_JS-b9e86a.svg?style=flat-square&labelColor=143d2c)
![License](https://img.shields.io/badge/license-Proprietary-gold.svg?style=flat-square)
![Region](https://img.shields.io/badge/country-Ecuador-0072CE.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-Audited_%26_Production_Ready-success.svg?style=flat-square)

---

## 🌾 1. Descripción del Proyecto

**GALYON** es una empresa de biotecnología agrícola enfocada en ofrecer alternativas biológicas de alto rendimiento para pequeños, medianos y grandes productores en Ecuador. Su portafolio abarca inoculantes biológicos para el control de patógenos del suelo, bioestimulación radicular, manejo biológico de insectos plaga, análisis de fertilidad de suelos de laboratorio y asesoría agronómica gratuita.

Esta plataforma web actúa como un **canal digital interactivo de ventas y diagnóstico preliminar**, permitiendo a los agricultores:
1. **Explorar y adquirir formulaciones biológicas** individuales y combos agrícolas formulados por cultivo.
2. **Utilizar el Asesor de Cultivos interactivo (wizard de 4 pasos)** para identificar síntomas patológicos observables en campo y recibir una orientación inicial sin promesas engañosas.
3. **Calcular pedidos y costos de envío dinámicamente** con integración directa al canal de ventas oficial por WhatsApp (`+593 96 893 3445`).
4. **Cotizar planes de análisis físico-químico de suelo** para optimizar la inversión en fertilización.

---

## 🧪 2. Catálogo de Productos y Servicios

### Líneas Biológicas Principales (Presentación 1 Litro a $20)
* **GALYON TRICHO (*Trichoderma spp.*):** Cuidado del sistema radicular y rizosfera frente a hongos patógenos del suelo. Disponible en presentación individual de 1 litro ($20) y galón de 4 litros ($60).
* **GALYON BACT (*Bacillus subtilis* & *Bacillus amyloliquefaciens*):** Vigor vegetativo, estimulación radicular y colonización benéfica de la rizosfera ($20/L).
* **GALYON INSECTA (*Bacillus thuringiensis*, *Beauveria bassiana*, *Metarhizium anisopliae*):** Manejo biológico dirigido de plagas susceptibles ($20/L).

### Combos Agrícolas por Cultivo (4 Litros por $70 — Envío Gratis en Ecuador)
| Combo | Formulación Incluida | Cultivo Objetivo | Beneficio Clave |
| :--- | :--- | :--- | :--- |
| **Cacao Titán** | 2 L TRICHO + 2 L BACT | Cacao nacional y ramilla | Vigor radicular y protección de floración/mazorca |
| **Mango Furioso** | 2 L BACT + 2 L INSECTA | Mango de exportación y huerto | Cuidado de brotes, follaje y presión de plagas |
| **Caña Brava** | 2 L BACT + 2 L INSECTA | Caña de azúcar | Estimulación de macollamiento y control biológico |
| **Verde Bestia** | 2 L TRICHO + 2 L BACT | Banano y plátano | Desarrollo del cormo, raíces y resistencia biológica |

### Nueva Presentación en Sustrato Sólido
* **GALYON TRICHO en Sustrato (1 kg por $25):** Formulación sólida concentrada para aplicaciones directas al suelo o preparación guiada en campo.

### Planes de Análisis de Suelo
* **Plan Básico ($69):** Diagnóstico preliminar de pH, conductividad y nutrientes principales.
* **Plan Completo ($129):** Perfil de fertilidad extendido con micronutrientes y textura.
* **Plan Suelo + Tejido Foliar ($199):** Evaluación integral para correlacionar la absorción foliar con el suelo.

---

## 🏛️ 3. Arquitectura de Software y Filosofía Técnica

El sitio sigue una arquitectura **Client-Side Single-Page Application (SPA)** de alto rendimiento sin frameworks pesados, aplicando estrictamente la **filosofía *Ponytail* (Lazy Senior Dev / YAGNI)**:

* **Cero dependencias evitables:** Sin React, Vue, jQuery ni empaquetadores inflados. Todo el comportamiento interactivo se ejecuta en el motor nativo del navegador.
* **HTML5 Semántico:** Modales con selectores CSS `:target` y visor nativo `<dialog id="combo-lightbox">`.
* **CSS3 Moderno (118 KB):** Variables CSS globales, CSS Grid fluido, flexbox, y compatibilidad total con `prefers-reduced-motion`.
* **JavaScript Modular (ES6+):** IIFEs encapsuladas que gestionan el estado del carrito, persistencia en `localStorage`, autoplays accesibles y el motor taxonómico del Asesor Agrícola.
* **Integración WhatsApp:** Protocolo `wa.me` con serialización URI de alta fidelidad, desglosando productos, cantidades, subtotales, reglas de envío y cantón/ciudad de destino.

---

## 📂 4. Estructura del Repositorio

```text
galyon/
├── index.html                     # Estructura semántica, modales y drawer del carrito
├── script.js                      # Lógica del carrito, Asesor de Cultivos y eventos
├── styles.css                     # Sistema visual, paleta cromática y diseño responsivo
├── combo-lightbox.js              # Controlador nativo para el <dialog> de combos
├── assets/                        # Banco fotográfico (>145 imágenes WebP, PNG, JPG)
│   ├── asesor/                    # Fotografías e ilustraciones de síntomas y cultivos
│   ├── combo-cacao-titan.webp
│   ├── combo-mango-furioso-original.png
│   ├── combo-verde-bestia.webp
│   ├── combo-cana-brava.webp
│   └── ...
├── fichas-tecnicas/               # Documentación técnica descargable
│   └── galyon_insecta_metarhizium_anisopliae.pdf
├── preparacion/                   # Auditorías fotográficas internas e informes v5.2
│   ├── auditoria_partes_cultivos.csv
│   ├── copys_resultados_por_linea.md
│   ├── informe_de_preparacion.md
│   └── ...
├── cambios_v576.txt               # Registro histórico de versiones anteriores
└── README.md                      # Documentación maestra del repositorio
```

---

## 🚀 5. Ejecución Local

Dado que el proyecto utiliza tecnologías nativas del navegador, no requiere compilación ni `npm install`:

### Opción 1: Apertura Directa
Doble clic en `index.html` o abrirlo en cualquier navegador moderno (Chrome, Safari, Firefox, Edge).

### Opción 2: Servidor Local (Recomendado para simulación de producción)
```bash
# Con Python 3
python3 -m http.server 8000

# Con Node.js / npx
npx serve .
```
Visitar en el navegador: `http://localhost:8000`

---

## 🔍 6. Estado de Auditoría Técnica (Línea Base v5.7.6)

En la auditoría exhaustiva realizada en Noviembre de 2026 se determinó que el código es **altamente viable, seguro y ligero**, requiriendo las siguientes correcciones prioritarias:

1. **Corrección de Case-Sensitivity (Linux 404):** En `index.html#L164`, corregir el enlace de la ficha técnica de `GALYON_INSECTA...pdf` a `galyon_insecta_metarhizium_anisopliae.pdf` para evitar errores 404 al alojar en servidores Linux (Netlify, Render, Hostinger).
2. **Escuchadores de Carrusel:** Vincular en `script.js` los escuchadores de evento para `.tricho-gallery-prev`, `.tricho-gallery-next` y `.tricho-gallery-dots button`.
3. **Optimización de Assets:** Convertir `assets/combo-mango-furioso-original.png` (3.3 MB) a WebP (~250 KB) para optimizar el LCP en redes móviles.
4. **Etiquetas Open Graph:** Añadir metadatos sociales (`og:image`, `og:title`) en `<head>`.

---

## 🗺️ 7. Hoja de Ruta Incremental (Roadmap)

El proyecto evoluciona bajo un esquema secuencial estricto:

* **Incremento 1 (Estabilización):** Reparación de enlaces PDF, activación de botones de carrusel y metaetiquetas Open Graph.
* **Incremento 2 (Rendimiento):** Compresión de assets pesados y purgado de 52 selectores CSS zombis.
* **Incremento 3 (Despliegue & Dominio):** Puesta en producción en Cloudflare Pages con dominio (`.us.kg` con `/freedomain-manager` o dominio comercial `.com.ec`).
* **Incremento 4 (Persistencia & Leads):** Micro-API en Python FastAPI + base de datos en Render/Hostinger para capturar carritos y diagnósticos en segundo plano.
* **Incremento 5 (Chatbot WhatsApp con IA):** Asistente conversacional 24/7 con `/whatsapp-agent-builder` (FastAPI + Gemini 2.5 Flash + Meta Cloud API).
* **Incremento 6 (Telefonía & Agente de Voz):** Emisión y recepción de llamadas telefónicas automatizadas con IA para seguimiento post-venta.

---

## 📞 8. Canales de Contacto Comercial

* **WhatsApp Oficial:** [+593 96 893 3445](https://wa.me/593968933445)
* **Cobertura:** Envíos garantizados a todo el territorio ecuatoriano (Costa, Sierra y Oriente).
* **Sede:** Guayaquil, Ecuador.

---
*Documentación generada y certificada bajo lineamientos de arquitectura limpia y desarrollo incremental.*
