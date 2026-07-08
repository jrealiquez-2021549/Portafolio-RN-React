import { useEffect, useRef, useState } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import { useReveal } from '../hooks/useReveal';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

const getCardsPerView = () => {
  const width = window.innerWidth;
  if (width <= 560) return 1;
  if (width <= 900) return 2;
  return 3;
};

export default function ProjectsSection() {
  const sectionRef = useReveal();
  const gridRef = useRef(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [transform, setTransform] = useState('translateX(0px)');
  const [selectedId, setSelectedId] = useState(PROJECTS_DATA[0]?.id);

  const getMaxIndex = () => Math.max(0, PROJECTS_DATA.length - getCardsPerView());

  const renderCarousel = (index) => {
    const grid = gridRef.current;
    if (!grid) return;
    const cardEls = grid.querySelectorAll('.project__card');
    if (!cardEls.length) return;

    const maxIndex = getMaxIndex();
    const clampedIndex = Math.min(index, maxIndex);

    const cardWidth = cardEls[0].getBoundingClientRect().width;
    const gap =
      parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap) || 0;
    setTransform(`translateX(-${clampedIndex * (cardWidth + gap)}px)`);

    return clampedIndex;
  };

  useEffect(() => {
    const applied = renderCarousel(cardIndex);
    if (applied !== undefined && applied !== cardIndex) setCardIndex(applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex]);

  useEffect(() => {
    const handleResize = () => renderCarousel(cardIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex]);

  const goToCard = (index) => {
    setCardIndex(Math.min(Math.max(index, 0), getMaxIndex()));
  };

  const maxIndex = getMaxIndex();
  const needsArrows = maxIndex > 0;
  const selectedProject = PROJECTS_DATA.find((p) => p.id === selectedId) || PROJECTS_DATA[0];

  return (
    <>
      <section id="proyectos" className="section section--proyectos" ref={sectionRef}>
        <img src="/assets/images/margen.png" className="section__margin" alt="" aria-hidden="true" />

        <div className="section__badge">
          <span className="section__badge-pill">Proyectos</span>
          <img src="/assets/icons/06.png" className="section__badge-icon" alt="" aria-hidden="true" />
        </div>

        <div className="section__inner">
          <span className="section__eyebrow">Trabajo reciente</span>
          <p className="section__text skills__intro">
            En esta parte voy a presentar algunos de los proyectos en los que he trabajado
            recientemente, destacando las tecnologías y herramientas que utilicé en cada uno
            de ellos. Cada proyecto refleja mi capacidad para enfrentar desafíos técnicos y mi
            compromiso con la calidad del desarrollo.
          </p>

          <div className="projects__carousel">
            <button
              className={`projects__arrow projects__arrow--prev${!needsArrows ? ' is-hidden' : ''}`}
              id="projectsPrev"
              type="button"
              aria-label="Proyecto anterior"
              disabled={cardIndex === 0}
              onClick={() => goToCard(cardIndex - 1)}
            >
              ‹
            </button>

            <div className="projects__viewport">
              <div className="projects__grid" id="projectsGrid" ref={gridRef} style={{ transform }}>
                {PROJECTS_DATA.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isActive={project.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            </div>

            <button
              className={`projects__arrow projects__arrow--next${!needsArrows ? ' is-hidden' : ''}`}
              id="projectsNext"
              type="button"
              aria-label="Proyecto siguiente"
              disabled={cardIndex >= maxIndex}
              onClick={() => goToCard(cardIndex + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {selectedProject && <ProjectDetail key={selectedProject.id} project={selectedProject} />}
    </>
  );
}
