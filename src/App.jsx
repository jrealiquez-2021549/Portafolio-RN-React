import { LightboxProvider } from './hooks/LightboxContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Descripcion from './components/Descripcion';
import Habilidades from './components/Habilidades';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import Turntable from './components/Turntable';
import { PROJECTS_DATA } from './data/projectsData';
import { PERSONAL_PROJECTS_DATA } from './data/personalProjectsData';

export default function App() {
  return (
    <LightboxProvider>
      <Navbar />

      <main>
        <Hero />
        <Descripcion />
        <Habilidades />
        <ProjectsSection
          sectionId="proyectos"
          sectionModifier="proyectos"
          badgeLabel="Proyectos Destacados"
          badgeIcon="/assets/icons/06.png"
          eyebrow="Trabajo reciente"
          introText="En esta parte voy a presentar algunos de los proyectos en los que he trabajado recientemente, destacando las tecnologías y herramientas que utilicé en cada uno de ellos. Cada proyecto refleja mi capacidad para enfrentar desafíos técnicos y mi compromiso con la calidad del desarrollo."
          projectsData={PROJECTS_DATA}
        />
        <ProjectsSection
          sectionId="proyectos-personales"
          sectionModifier="proyectos-personales"
          badgeLabel="Proyectos Personales"
          badgeIcon="/assets/icons/07.png"
          eyebrow="Fuera del aula"
          introText="Aquí muestro proyectos personales de menor escala que he desarrollado por iniciativa propia, explorando ideas, practicando tecnologías y divirtiéndome en el proceso. Aunque son más pequeños que mis proyectos destacados, reflejan la misma dedicación y ganas de seguir aprendiendo."
          projectsData={PERSONAL_PROJECTS_DATA}
        />
      </main>

      <Footer />

      <Lightbox />
      <Turntable />
    </LightboxProvider>
  );
}
