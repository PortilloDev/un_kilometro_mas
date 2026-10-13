# Un Kilómetro Más — Editor de publicaciones

<p align="center">
  <img src="Un Kilómetro Más al Amanecer.png" width="160" alt="Un Kilómetro Más" />
</p>

<p align="center">
  Aplicación web local para generar publicaciones de Instagram de la marca <strong>Un kilómetro más</strong>.
</p>

---

## ¿Qué es esto?

Cada día hay que correr, actualizar las estadísticas, cambiar la foto y exportar. Esta herramienta convierte ese proceso en algo rápido y visual, sin necesidad de abrir Photoshop ni ningún servicio externo.

## Tecnología

| Capa | Elección |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Exportación PNG/JPEG | html-to-image |
| Persistencia (estado) | localStorage |
| Persistencia (proyectos) | IndexedDB |
| Estilos | CSS moderno (variables, grid, flexbox) |
| Tipografías | Oswald · Bebas Neue · Inter (Google Fonts) |

Sin backend. Sin cuenta de usuario. Funciona completamente en local tras instalar las dependencias.

## Instalación

```bash
cd app
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

Para una build de producción:

```bash
npm run build       # genera app/dist/
npm run preview     # previsualiza la build en local
```

## Uso diario (flujo típico)

1. Abre la app → el estado del día anterior se restaura automáticamente
2. Panel derecho → **Reto**: avanza el contador al día siguiente
3. Panel derecho → **Stats**: introduce distancia, tiempo, ritmo, frecuencia cardíaca
4. Panel derecho → **Texto**: edita el título y la descripción del día
5. Panel derecho → **Fotos**: sube la fotografía principal y la captura del mapa
6. Elige el formato (4:5 o 1:1) en la barra superior
7. Pulsa **Exportar PNG** → descarga `un-kilometro-mas-dia-XXX.png` listo para Instagram

## Atajos de teclado

| Atajo | Acción |
|---|---|
| `Cmd+Z` / `Ctrl+Z` | Deshacer |
| `Cmd+Shift+Z` / `Ctrl+Shift+Z` | Rehacer |
| `Cmd+S` / `Ctrl+S` | Abrir diálogo de proyectos |
| `Escape` | Cerrar diálogo / deseleccionar capa |

## Editor de capas

- **Clic** sobre cualquier elemento del lienzo → selecciona la capa
- **Arrastrar** el elemento seleccionado → cambia su posición
- Panel izquierdo (Capas): activa/desactiva visibilidad, bloquea, reordena
- Panel derecho → **Props**: ajuste fino de posición X/Y y opacidad

## Proyectos guardados

- **Guardar**: botón «Proyectos» en la barra superior (o `Cmd+S`)
  - Escribe un nombre y pulsa «Guardar» para guardar el estado actual
- **Abrir**: haz clic en «Abrir» sobre cualquier proyecto guardado
- Los proyectos se almacenan en IndexedDB y persisten entre sesiones

## Formato de salida

| Formato | Dimensiones | Uso |
|---|---|---|
| 4:5 | 1080 × 1350 px | Publicación vertical (por defecto) |
| 1:1 | 1080 × 1080 px | Publicación cuadrada |

## Límites de texto

Para que el diseño no desborde en el post exportado:

| Campo | Máximo recomendado |
|---|---|
| Título — línea 1 | 40 caracteres |
| Título — línea 2 | 40 caracteres |
| Descripción | 300 caracteres (~7 líneas) |
| Frase de cierre | 50 caracteres |

El panel de texto muestra un contador en tiempo real y avisa en naranja (85 %) y rojo (superado).

## Estado del proyecto

- [x] Fase 1 — Plantilla y exportación
- [x] Fase 2 — Editor de capas con arrastrar y soltar
- [x] Fase 3 — Gestión de proyectos y deshacer/rehacer
- [x] Fase 4 — Pulido, validaciones y mensajes de estado
