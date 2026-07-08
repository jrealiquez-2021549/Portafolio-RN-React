import { useEffect, useRef } from 'react';
import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { loadWobbleUpdater } from '@tsparticles/updater-wobble';

// El motor de tsParticles solo necesita registrarse una vez, sin importar
// cuántas secciones (Hero, Habilidades, ProjectDetail) monten el hook.
let enginePromise = null;
function ensureEngine() {
  if (!enginePromise) {
    enginePromise = Promise.all([
      loadSlim(tsParticles),
      loadWobbleUpdater(tsParticles),
    ]);
  }
  return enginePromise;
}

const petalsOptions = {
  fullScreen: { enable: false },
  detectRetina: true,
  fpsLimit: 60,
  background: { color: { value: 'transparent' } },
  particles: {
    number: {
      value: 16,
    },
    shape: {
      type: 'image',
      options: {
        image: [
          { src: '/assets/images/petalo-luna-1.png', width: 64, height: 82 },
          { src: '/assets/images/petalo-luna-2.png', width: 64, height: 82 },
        ],
      },
    },
    size: {
      value: { min: 12, max: 24 },
    },
    opacity: {
      value: { min: 0.45, max: 0.9 },
      animation: {
        enable: true,
        speed: 0.6,
        sync: false,
        startValue: 'random',
        destroy: 'none',
      },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: 'random',
      animation: { enable: true, speed: 4 },
    },
    wobble: {
      enable: true,
      distance: 14,
      speed: { min: -6, max: 6 },
    },
    move: {
      enable: true,
      direction: 'bottom',
      straight: false,
      random: false,
      speed: { min: 0.5, max: 1.4 },
      outModes: { default: 'out', top: 'none' },
      gravity: { enable: false },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: false },
      onClick: { enable: false },
      resize: { enable: true },
    },
  },
  responsive: [
    {
      maxWidth: 768,
      options: {
        particles: { number: { value: 8 } },
      },
    },
  ],
};

export function usePetals() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let particlesContainer = null;

    const layer = document.createElement('div');
    layer.className = 'petals';
    layer.setAttribute('aria-hidden', 'true');
    const layerId = `petals-${Math.random().toString(36).slice(2)}`;
    layer.id = layerId;
    container.prepend(layer);

    ensureEngine().then(async () => {
      if (cancelled) return;
      particlesContainer = await tsParticles.load({
        id: layerId,
        options: petalsOptions,
      });
    });

    return () => {
      cancelled = true;
      particlesContainer?.destroy();
      layer.remove();
    };
  }, []);

  return containerRef;
}
