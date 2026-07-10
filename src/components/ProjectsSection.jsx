import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

const getCardsPerView = () => {
  const width = window.innerWidth;
  if (width <= 560) return 1;
  if (width <= 900) return 2;
  return 3;
};

export default function ProjectsSection({
  sectionId,
  sectionModifier,
  badgeLabel,
  badgeIcon,
  eyebrow,
  introText,
  projectsData,
}) {
  const sectionRef = useReveal();
  const gridRef = useRef(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [transform, setTransform] = useState('translateX(0px)');
  const [selectedId, setSelectedId] = useState(projectsData[0]?.id);

  const getMaxIndex = () => Math.max(0, projectsData.length - getCardsPerView());

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
  const selectedProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => goToCard(cardIndex + 1),
    onSwipeRight: () => goToCard(cardIndex - 1),
  });

  return (
    <>
      <section
        id={sectionId}
        className={`section section--${sectionModifier}`}
        ref={sectionRef}
      >
        <img src="/assets/images/margen.png" className="section__margin" alt="" aria-hidden="true" />

        <div className="section__badge">
          <span className="section__badge-pill">{badgeLabel}</span>
          <img src={badgeIcon} className="section__badge-icon" alt="" aria-hidden="true" />
        </div>

        <div className="section__inner">
          <span className="section__eyebrow">{eyebrow}</span>
          <p className="section__text skills__intro">{introText}</p>

          <div className="projects__carousel">
            <button
              className={`projects__arrow projects__arrow--prev${!needsArrows ? ' is-hidden' : ''}`}
              type="button"
              aria-label="Proyecto anterior"
              disabled={cardIndex === 0}
              onClick={() => goToCard(cardIndex - 1)}
            >
              ‹
            </button>

            <div className="projects__viewport" {...swipeHandlers}>
              <div className="projects__grid" ref={gridRef} style={{ transform }}>
                {projectsData.map((project) => (
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
