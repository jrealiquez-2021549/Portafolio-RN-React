import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { usePetals } from '../hooks/usePetals';
import ProjectImageCarousel from './ProjectImageCarousel';
import ProjectTechStack from './ProjectTechStack';

function ActionButton({ href, icon, label, variant }) {
  if (!href) return null;
  return (
    <a
      className={`project__btn project__btn--${variant}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={icon} alt="" />
      <span>{label}</span>
    </a>
  );
}

export default function ProjectDetail({ project }) {
  const revealRef = useReveal();
  const petalsRef = usePetals();
  const sectionRef = useRef(null);

  // Combina la ref de reveal, la ref de petals y la ref local de la sección
  const setRefs = (node) => {
    sectionRef.current = node;
    revealRef.current = node;
    petalsRef.current = node;
  };

  return (
    <section
      id="proyectoDetalle"
      className={`section section--proyecto-detalle project__detail--${project.id}`}
      ref={setRefs}
      style={{ backgroundImage: `url('${project.background}')` }}
    >
      <div className="section__inner">
        <div className="project__detail is-active" id="projectDetail">
          <div className="project__detail-inner">
            <div className="project__detail-text">
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="project__actions">
                <ActionButton href={project.links.repo} icon="/assets/icons/github.png" label="Repositorio" variant="repo" />
                <ActionButton href={project.links.presentacion} icon="/assets/icons/presentacion.png" label="Presentación" variant="presentacion" />
                <ActionButton href={project.links.sitio} icon="/assets/icons/sitio.png" label="Ir al sitio" variant="sitio" />
              </div>
            </div>

            <ProjectImageCarousel project={project} />
          </div>

          <ProjectTechStack projectId={project.id} />
        </div>
      </div>
    </section>
  );
}