import { useEffect, useRef, useState } from 'react';
import { SKILLS_DATA } from '../data/skillsData';
import { usePetals } from '../hooks/usePetals';
import { useReveal } from '../hooks/useReveal';

function SkillRow({ item, animated }) {
  return (
    <div className="skill__row">
      <span className="skill__icon">
        <iconify-icon icon={item.icon} width="22" height="22"></iconify-icon>
      </span>
      <div className="skill__info">
        <div className="skill__head">
          <span className="skill__name">{item.name}</span>
          <span className="skill__percent">{item.percent}%</span>
        </div>
        <div className="skill__bar">
          <div
            className="skill__bar-fill"
            style={{ width: animated ? `${item.percent}%` : '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function Habilidades() {
  const petalsRef = usePetals();
  const revealRef = useReveal();
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(SKILLS_DATA[0]?.id);
  const [animatedPanels, setAnimatedPanels] = useState(() => new Set());

  // Combina la ref de las petals, la ref de reveal y la ref local de la sección
  const setRefs = (node) => {
    sectionRef.current = node;
    petalsRef.current = node;
    revealRef.current = node;
  };

  const markAnimated = (categoryId) => {
    setAnimatedPanels((prev) => {
      if (prev.has(categoryId)) return prev;
      const next = new Set(prev);
      next.add(categoryId);
      return next;
    });
  };

  // Anima el primer panel cuando la sección entra en el viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!('IntersectionObserver' in window)) {
      markAnimated(SKILLS_DATA[0]?.id);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markAnimated(SKILLS_DATA[0]?.id);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleTabClick = (categoryId) => {
    setActiveCategory(categoryId);
    markAnimated(categoryId);
  };

  return (
    <section id="habilidades" className="section section--habilidades" ref={setRefs}>
      <div className="section__badge">
        <span className="section__badge-pill">Habilidades técnicas</span>
        <img src="/assets/icons/02.png" className="section__badge-icon" alt="" aria-hidden="true" />
      </div>

      <div className="section__inner">
        <span className="section__eyebrow">Lo que sé hacer</span>

        <p className="section__text skills__intro">
          Tecnologías y herramientas que he tenido la oportunidad de aprender y aplicar en
          mis proyectos hasta el momento. Esta sección muestra las áreas en las que he
          venido trabajando, agrupadas por categorías para reflejar mi nivel de familiaridad
          y práctica actual con cada una de ellas.
        </p>

        <div className="skills__tabs" id="skillsTabs" role="tablist">
          {SKILLS_DATA.map((category) => (
            <button
              key={category.id}
              className={`skills__tab${activeCategory === category.id ? ' is-active' : ''}`}
              data-category={category.id}
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => handleTabClick(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div className="skills__panels" id="skillsPanels">
          {SKILLS_DATA.map((category) => (
            <div
              key={category.id}
              className={`skills__panel${activeCategory === category.id ? ' is-active' : ''}`}
              data-category={category.id}
              role="tabpanel"
            >
              <div className="skills__list">
                {category.items.map((item) => (
                  <SkillRow key={item.name} item={item} animated={animatedPanels.has(category.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
