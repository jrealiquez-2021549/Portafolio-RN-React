# Portafolio-RN (versión React)

Migración a React + Vite del portafolio original en HTML/CSS/JS, manteniendo
exactamente el mismo diseño, contenido y comportamiento.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente http://localhost:5173).

Para generar la build de producción:

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  components/
    Navbar.jsx               // Navbar con scroll sólido, menú móvil y sección activa
    Hero.jsx                 // Sección "Inicio"
    Descripcion.jsx          // Sección "Descripción"
    Habilidades.jsx          // Sección "Habilidades" (pestañas + barras animadas)
    ProjectsSection.jsx      // Carrusel de tarjetas de proyectos + detalle
    ProjectCard.jsx
    ProjectDetail.jsx
    ProjectImageCarousel.jsx // Carrusel de imágenes dentro del detalle
    Lightbox.jsx              // Visor de imágenes en grande
    Turntable.jsx              // Reproductor de música de fondo (YouTube)
    Footer.jsx
  data/
    skillsData.js            // Igual a js/skills-data.js original
    projectsData.js          // Igual a js/projects-data.js original
  hooks/
    usePetals.js             // Réplica de js/petals.js como hook
    useReveal.js              // Réplica del "reveal on scroll" de script.js
    LightboxContext.jsx       // Estado global del lightbox (abrir/cerrar desde cualquier carrusel)
  App.jsx
  main.jsx
  index.css                   // El mismo css/styles.css original (rutas de imágenes ajustadas a /assets/...)
public/
  assets/                     // Imágenes, iconos, fuentes y el PDF del CV (idénticos al original)
```

## Notas de la migración

- Todo el CSS original se mantuvo intacto en `src/index.css`; solo se
  ajustaron las rutas `../assets/...` a `/assets/...` porque en Vite los
  archivos estáticos se sirven desde `public/`.
- La lógica de cada script (`script.js`, `skills.js`, `projects.js`,
  `lightbox.js`, `petals.js`, `turntable.js`) se tradujo 1 a 1 a componentes
  y hooks de React, usando `useState`/`useEffect`/`IntersectionObserver` en
  vez de manipulación directa del DOM.
- Los datos de habilidades y proyectos son los mismos arrays, solo
  exportados como módulos ES para importarlos en los componentes.
- `iconify-icon` se sigue cargando vía `<script>` en `index.html`, igual que
  en el proyecto original.
