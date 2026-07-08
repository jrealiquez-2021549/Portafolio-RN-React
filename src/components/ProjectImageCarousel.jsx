import { useEffect, useRef, useState } from 'react';
import { useLightbox } from '../hooks/LightboxContext';

const AUTOPLAY_MS = 5000;

export default function ProjectImageCarousel({ project }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const { openLightbox } = useLightbox();
  const images = project.images;

  const goTo = (i) => {
    setIndex(((i % images.length) + images.length) % images.length);
  };

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, AUTOPLAY_MS);
    }
  };

  // Reinicia el carrusel e inicia el autoplay cada vez que cambia de proyecto
  useEffect(() => {
    setIndex(0);
    resetAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const handleImageClick = (i) => {
    if (timerRef.current) clearInterval(timerRef.current);
    openLightbox(images, i, project.title, (finalIndex) => {
      goTo(finalIndex);
      resetAutoplay();
    });
  };

  const handleDotClick = (i) => {
    goTo(i);
    resetAutoplay();
  };

  const handleArrowClick = (dir) => {
    goTo(index + dir);
    resetAutoplay();
  };

  return (
    <div
      className={`project__carousel project__carousel--${project.id}`}
      data-carousel
      onMouseEnter={() => {
        if (timerRef.current) clearInterval(timerRef.current);
      }}
      onMouseLeave={resetAutoplay}
    >
      <div
        className="project__carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div className="project__carousel-slide" key={src}>
            <img
              src={src}
              alt={project.title}
              loading="lazy"
              onClick={() => handleImageClick(i)}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="project__carousel-arrow project__carousel-arrow--prev"
            data-dir="-1"
            aria-label="Imagen anterior"
            onClick={() => handleArrowClick(-1)}
          >
            ‹
          </button>
          <button
            className="project__carousel-arrow project__carousel-arrow--next"
            data-dir="1"
            aria-label="Imagen siguiente"
            onClick={() => handleArrowClick(1)}
          >
            ›
          </button>
          <div className="project__carousel-dots">
            {images.map((src, i) => (
              <button
                key={src}
                className={`project__carousel-dot${i === index ? ' is-active' : ''}`}
                data-index={i}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={() => handleDotClick(i)}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
