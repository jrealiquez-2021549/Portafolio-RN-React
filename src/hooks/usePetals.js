import { useEffect, useRef } from 'react';

const PETALS_PER_SECTION = 16;

export function usePetals() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const layer = document.createElement('div');
    layer.className = 'petals';
    layer.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < PETALS_PER_SECTION; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      if (Math.random() > 0.5) petal.classList.add('petal--alt');

      const size = (Math.random() * 10 + 8).toFixed(1);
      const left = (Math.random() * 100).toFixed(1);
      const duration = (Math.random() * 8 + 10).toFixed(1);
      const delay = (Math.random() * duration).toFixed(1);
      const drift = (Math.random() * 100 - 50).toFixed(0);
      const opacity = (Math.random() * 0.35 + 0.5).toFixed(2);
      const hue = (Math.random() * 20 - 10).toFixed(1); // leve variación azul/lavanda

      petal.style.setProperty('--size', `${size}px`);
      petal.style.setProperty('--left', `${left}%`);
      petal.style.setProperty('--duration', `${duration}s`);
      petal.style.setProperty('--delay', `-${delay}s`);
      petal.style.setProperty('--drift', `${drift}px`);
      petal.style.setProperty('--opacity', opacity);
      petal.style.setProperty('--hue', `${hue}deg`);

      layer.appendChild(petal);
    }

    container.prepend(layer);

    return () => {
      layer.remove();
    };
  }, []);

  return containerRef;
}