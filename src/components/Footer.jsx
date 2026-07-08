export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <img src="/assets/images/margen.png" className="section__margin" alt="" aria-hidden="true" />
      <div className="footer__inner">
        <p>&copy; <span id="year">{year}</span> Realiquez Company. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
