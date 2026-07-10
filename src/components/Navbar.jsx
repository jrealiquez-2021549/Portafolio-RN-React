import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 60;
const CONTACT_EMAIL = 'realiqueznoriega80@gmail.com';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  {
    href: '#descripcion',
    label: 'Sobre mí',
    children: [{ href: '#habilidades', label: 'Habilidades Técnicas' }],
  },
  {
    href: '#proyectos',
    label: 'Proyectos',
    children: [
      { href: '#proyectos', label: 'Proyectos Destacados' },
      { href: '#proyectos-personales', label: 'Proyectos Personales' },
    ],
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#inicio');
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const mailRef = useRef(null);

  // 1) Navbar transparente -> sólido al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2) Clase en <body> para el menú móvil
  useEffect(() => {
    document.body.classList.toggle('nav-open', isNavOpen);
  }, [isNavOpen]);

  // 3) Resaltar el enlace de la sección visible
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.getAttribute('id')}`);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // 4) Cerrar el popover del correo al hacer click afuera o presionar Escape
  useEffect(() => {
    if (!isMailOpen) return undefined;

    const handleClickOutside = (event) => {
      if (mailRef.current && !mailRef.current.contains(event.target)) {
        setIsMailOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsMailOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMailOpen]);

  // 5) El aviso de "Copiado" vuelve a "Copiar" solo después de un momento
  useEffect(() => {
    if (!isEmailCopied) return undefined;
    const timeout = setTimeout(() => setIsEmailCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [isEmailCopied]);

  const handleNavLinkClick = () => setIsNavOpen(false);

  const isLinkActive = (link) =>
    activeHref === link.href || (link.children?.some((child) => child.href === activeHref) ?? false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setIsEmailCopied(true);
    } catch {
      // Fallback por si el navegador bloquea el acceso al portapapeles
      const textarea = document.createElement('textarea');
      textarea.value = CONTACT_EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsEmailCopied(true);
    }
  };

  return (
    <header className={`navbar${isScrolled ? ' is-scrolled' : ''}`} id="navbar">
      <nav className="navbar__inner">
        <ul className="navbar__links" id="navLinks">
          {NAV_LINKS.map((link) => (
            <li
              key={link.href}
              className={`navbar__item${link.children ? ' navbar__item--has-submenu' : ''}`}
            >
              <a
                href={link.href}
                className={`navbar__link${isLinkActive(link) ? ' is-active' : ''}`}
                onClick={handleNavLinkClick}
              >
                {link.label}
                {link.children && <span className="navbar__caret" aria-hidden="true">⌄</span>}
              </a>

              {link.children && (
                <ul className="navbar__submenu">
                  {link.children.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        className={`navbar__sublink${activeHref === child.href ? ' is-active' : ''}`}
                        onClick={handleNavLinkClick}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <a href="#inicio" className="navbar__logo" aria-label="Ir al inicio">
          <img src="/assets/icons/logo.png" alt="Logo" />
        </a>

        <ul className="navbar__socials">
          <li className="navbar__mail" ref={mailRef}>
            <button
              type="button"
              className="navbar__social-btn"
              aria-label="Mostrar correo de contacto"
              aria-expanded={isMailOpen}
              onClick={() => setIsMailOpen((open) => !open)}
            >
              <img src="/assets/icons/mail.png" alt="Correo" />
            </button>

            {isMailOpen && (
              <div className="navbar__mail-popover" role="dialog" aria-label="Correo de contacto">
                <span className="navbar__mail-address">{CONTACT_EMAIL}</span>
                <button
                  type="button"
                  className="navbar__mail-copy"
                  onClick={handleCopyEmail}
                >
                  <iconify-icon
                    icon={isEmailCopied ? 'mdi:check' : 'mdi:content-copy'}
                    width="15"
                    height="15"
                  ></iconify-icon>
                  {isEmailCopied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            )}
          </li>
          <li>
            <a href="https://instagram.com/realiquez_ac/" target="_blank" rel="noopener" aria-label="Instagram">
              <img src="/assets/icons/instagram.png" alt="Instagram" />
            </a>
          </li>
          <li>
            <a href="https://wa.me/50231100319" target="_blank" rel="noopener" aria-label="WhatsApp">
              <img src="/assets/icons/whatsapp.png" alt="WhatsApp" />
            </a>
          </li>
          <li>
            <a href="https://github.com/jrealiquez-2021549/" target="_blank" rel="noopener" aria-label="GitHub">
              <img src="/assets/icons/github.png" alt="GitHub" />
            </a>
          </li>
          <li>
            <a href="https://facebook.com/proxyCS549/" target="_blank" rel="noopener" aria-label="Facebook">
              <img src="/assets/icons/facebook.png" alt="Facebook" />
            </a>
          </li>
        </ul>

        <button
          className="navbar__toggle"
          id="navToggle"
          aria-label="Abrir menú"
          aria-expanded={isNavOpen}
          onClick={() => setIsNavOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
