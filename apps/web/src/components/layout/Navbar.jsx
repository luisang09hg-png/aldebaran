import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import './Navbar.css';

const Navbar = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="navbar-logo star-glow" onClick={() => onNavigate && onNavigate('home')} style={{cursor: 'pointer'}}>
          ★ Aldebaran
        </div>
        
        <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Inicio</a>
          <a href="#explore" onClick={() => setMenuOpen(false)}>Explorar empleos</a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>Recursos</a>
          <a href="#companies" onClick={() => setMenuOpen(false)}>Para empresas</a>
          
          <div className="navbar-actions">
            <Button variant="outline" size="sm">Iniciar sesión</Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate && onNavigate('profile')}>
              Crear mi perfil
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
