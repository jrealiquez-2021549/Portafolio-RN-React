import { useReveal } from '../hooks/useReveal';

export default function Descripcion() {
  const sectionRef = useReveal();

  return (
    <section id="descripcion" className="section section--datos" ref={sectionRef}>
      <img src="/assets/images/margen.png" className="section__margin" alt="" aria-hidden="true" />

      <div className="section__badge">
        <span className="section__badge-pill">Descripción</span>
        <img src="/assets/icons/03.png" className="section__badge-icon" alt="" aria-hidden="true" />
      </div>

      <div className="section__inner section__inner--about">
        <div className="section__about-text">
          <span className="section__eyebrow">Un poco sobre mí</span>
          <p className="section__text">
            Soy un Desarrollador Full-Stack en formación con una sólida base en la creación
            de aplicaciones web y móviles. Me enfoco en diseñar soluciones de software
            eficientes, escalables y orientadas a la experiencia del usuario. Mi meta es
            aportar valor en proyectos tecnológicos dinámicos mientras inicio mis estudios
            en Ingeniería en Sistemas, aspirando a convertirme en un arquitecto de software
            capaz de resolver problemas complejos del mundo real. A nivel técnico, cuento
            con experiencia práctica integrando tecnologías como React, Node.js, C#/.NET y
            gestionando bases de datos relacionales y no relacionales (PostgreSQL, MongoDB).
          </p>
        </div>
        <img
          src="/assets/images/12.png"
          className="section__about-image"
          alt="Ilustración de tres personajes alrededor de una fogata"
        />
      </div>
    </section>
  );
}
