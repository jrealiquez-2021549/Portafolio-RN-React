import { usePetals } from '../hooks/usePetals';

export default function Hero() {
  const petalsRef = usePetals();

  return (
    <section id="inicio" className="hero" ref={petalsRef}>
      <div className="hero__background"></div>
      <div className="hero__overlay"></div>

      <div className="hero__profile">
        <div className="hero__photo">
          <img src="/assets/images/perfil.jpg" alt="Foto de Julio Gabriel Realiquez Noriega" />
        </div>

        <div className="hero__info">
          <p className="hero__eyebrow">Datos personales</p>
          <h1 className="hero__title">
            Julio Gabriel
            <br />
            Realiquez Noriega
          </h1>

          <p className="hero__phrase">
            “Tener miedo no es malo, es el miedo lo que me ha llevado tan lejos.”
          </p>

          <hr className="hero__divider" />

          <dl className="hero__stats">
            <div className="hero__stats-group">
              <div className="hero__stat">
                <dt>Edad</dt>
                <dd>17 años</dd>
              </div>
              <div className="hero__stat">
                <dt>Educación</dt>
                <dd>6to. Diversificado</dd>
              </div>
            </div>
            <div className="hero__stats-group">
              <div className="hero__stat">
                <dt>Enfoque actual</dt>
                <dd>Futuro Ingeniero en Sistemas</dd>
              </div>
              <div className="hero__stat">
                <dt>Años desarrollando</dt>
                <dd>3 años</dd>
              </div>
            </div>
            <div className="hero__stats-group">
              <div className="hero__stat">
                <dt>Especialidad</dt>
                <dd>Desarrollador Full-Stack</dd>
              </div>
              <div className="hero__stat">
                <dt>Modalidad de trabajo</dt>
                <dd>Individual / Equipo</dd>
              </div>
            </div>
            <div className="hero__stats-group">
              <div className="hero__stat">
                <dt>Ubicación</dt>
                <dd>Guatemala, Guatemala</dd>
              </div>
              <a
                href="/assets/docs/CV-Julio-Realiquez-Noriega.pdf"
                className="hero__cv-btn"
                download="CV-Julio-Realiquez-Noriega.pdf"
              >
                <iconify-icon icon="mdi:tray-download" width="18" height="18"></iconify-icon>
                <span>Descargar CV</span>
              </a>
            </div>
          </dl>
        </div>
      </div>

      <a href="#descripcion" className="hero__scroll" aria-label="Bajar a la siguiente sección">
        <span></span>
      </a>
    </section>
  );
}
