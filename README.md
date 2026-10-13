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
| Persistencia | localStorage (estado) |
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

## Uso diario

1. Abre la app
2. Actualiza el **contador del reto** (panel derecho → Reto)
3. Introduce las **estadísticas** del entrenamiento (Stats)
4. Edita el **texto del día** si quieres (Texto)
5. Sube la **fotografía principal** y la **captura del mapa** (Fotos)
6. Pulsa **Exportar PNG** → descarga `un-kilometro-mas-dia-XXX.png` listo para Instagram

## Formato de salida

| Formato | Dimensiones | Uso |
|---|---|---|
| 4:5 | 1080 × 1350 px | Publicación vertical (por defecto) |
| 1:1 | 1080 × 1080 px | Publicación cuadrada |

## Estado del proyecto

- [x] Fase 1 — Plantilla y exportación
- [ ] Fase 2 — Editor de capas con arrastrar y soltar
- [ ] Fase 3 — Gestión de proyectos y deshacer/rehacer
- [ ] Fase 4 — Pulido y validaciones
