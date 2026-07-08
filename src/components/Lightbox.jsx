import { useEffect, useRef, useState } from 'react';
import { useLightbox } from '../hooks/LightboxContext';

const MAX_DOTS = 10;
const SLIDE_MS = 450;

export default function Lightbox() {
  const { isOpen, images, startIndex, title, closeLightbox } = useLightbox();
  const [index, setIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const slideTimeoutRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const thumbRefs = useRef([]);

  // Al abrir: posiciona el índice inicial, guarda el foco previo y enfoca el botón cerrar
  useEffect(() => {
    if (!isOpen) return;
    setIndex(startIndex || 0);
    isAnimatingRef.current = false;
    lastFocusedRef.current = document.activeElement;
    document.body.classList.add('lightbox-open');
    // Pequeño delay para asegurar que el botón ya está en el DOM
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      document.body.classList.remove('lightbox-open');
    };
  }, [isOpen, startIndex]);

  const goTo = (i) => {
    if (!images.length || isAnimatingRef.current) return;
    const newIndex = (i + images.length) % images.length;
    if (newIndex === index) return;

    isAnimatingRef.current = true;
    setIndex(newIndex);

    window.clearTimeout(slideTimeoutRef.current);
    slideTimeoutRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, SLIDE_MS);
  };

  const handleClose = () => {
    window.clearTimeout(slideTimeoutRef.current);
    isAnimatingRef.current = false;
    closeLightbox(index);
    if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
      lastFocusedRef.current.focus();
    }
  };

  // Teclado: Escape / flechas
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose();
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, images.length]);

  // Scroll automático de la miniatura activa
  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [index]);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goTo(index + 1);
      else goTo(index - 1);
    }
  };

  const handleBackdropClick = (event) => {
    if (
      event.target.classList.contains('lightbox') ||
      event.target.classList.contains('lightbox__backdrop')
    ) {
      handleClose();
    }
  };

  const multiple = images.length > 1;
  const showDots = images.length >= 2 && images.length <= MAX_DOTS;

  return (
    <div
      className={`lightbox${isOpen ? ' is-open' : ''}`}
      id="lightbox"
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lightbox__backdrop"></div>

      <button className="lightbox__close" id="lightboxClose" type="button" aria-label="Cerrar" ref={closeBtnRef} onClick={handleClose}>
        ✕
      </button>

      <div className="lightbox__stage">
        <p className="sr-only" id="lightboxTitle">{title}</p>
        <p className="sr-only" id="lightboxCounter" aria-live="polite">
          {multiple ? `${index + 1} / ${images.length}` : ''}
        </p>

        <div className="lightbox__frame">
          <button
            className="lightbox__arrow lightbox__arrow--prev"
            id="lightboxPrev"
            type="button"
            aria-label="Imagen anterior"
            style={{ display: multiple ? 'flex' : 'none' }}
            onClick={() => goTo(index - 1)}
          >
            ‹
          </button>

          <div className="lightbox__viewport">
            <div
              className="lightbox__track"
              id="lightboxTrack"
              style={{
                width: `${images.length * 100}%`,
                transform: `translateX(-${images.length ? (index * 100) / images.length : 0}%)`,
              }}
            >
              {images.map((src, i) => (
                <div
                  className="lightbox__slide"
                  key={src}
                  style={{ width: `${100 / images.length}%` }}
                >
                  <img src={src} alt={title ? `${title} — imagen ${i + 1}` : ''} draggable={false} />
                </div>
              ))}
            </div>
          </div>

          <button
            className="lightbox__arrow lightbox__arrow--next"
            id="lightboxNext"
            type="button"
            aria-label="Imagen siguiente"
            style={{ display: multiple ? 'flex' : 'none' }}
            onClick={() => goTo(index + 1)}
          >
            ›
          </button>
        </div>

        <div className="lightbox__dots" id="lightboxDots" style={{ display: showDots ? 'flex' : 'none' }}>
          {showDots &&
            images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`lightbox__dot${i === index ? ' is-active' : ''}`}
                aria-label={`Ver imagen ${i + 1} de ${images.length}`}
                onClick={() => goTo(i)}
              ></button>
            ))}
        </div>

        <div className="lightbox__thumbs" id="lightboxThumbs" style={{ display: images.length >= 2 ? 'flex' : 'none' }}>
          {images.length >= 2 &&
            images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`lightbox__thumb${i === index ? ' is-active' : ''}`}
                aria-label={`Ir a la imagen ${i + 1} de ${images.length}`}
                ref={(el) => (thumbRefs.current[i] = el)}
                onClick={() => goTo(i)}
              >
                <img src={src} alt="" draggable={false} />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
