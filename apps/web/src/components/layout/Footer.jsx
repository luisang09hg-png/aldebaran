import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="navbar-logo">★ Aldebaran</div>
          <p>Tu primer trabajo puede cambiarlo todo.</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-col">
            <h4>Producto</h4>
            <a href="#">Explorar</a>
            <a href="#">Cursos</a>
            <a href="#">Precios</a>
          </div>
          <div className="footer-col">
            <h4>Empresas</h4>
            <a href="#">Publicar empleo</a>
            <a href="#">Búsqueda de talento</a>
          </div>
          <div className="footer-col">
            <h4>Recursos</h4>
            <a href="#">Blog</a>
            <a href="#">Guía de CV</a>
            <a href="#">Entrevistas</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aldebaran. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
