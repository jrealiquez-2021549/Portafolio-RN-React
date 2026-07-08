import { LightboxProvider } from './hooks/LightboxContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Descripcion from './components/Descripcion';
import Habilidades from './components/Habilidades';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import Turntable from './components/Turntable';

export default function App() {
  return (
    <LightboxProvider>
      <Navbar />

      <main>
        <Hero />
        <Descripcion />
        <Habilidades />
        <ProjectsSection />
      </main>

      <Footer />

      <Lightbox />
      <Turntable />
    </LightboxProvider>
  );
}
