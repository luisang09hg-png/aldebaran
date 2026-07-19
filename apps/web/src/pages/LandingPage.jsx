import React, { useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './LandingPage.css';

const LandingPage = ({ onNavigate }) => {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-observe').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container hero-container">
          <div className="hero-content scroll-observe">
            <h1>Tu primer trabajo <br/><span className="text-gradient">puede cambiarlo todo</span></h1>
            <p className="hero-subtitle">Descubre oportunidades diseñadas para jóvenes sin experiencia. Aldebaran es tu plataforma social para iniciar tu carrera profesional.</p>
            <div className="hero-cta">
              <Button size="lg" onClick={() => onNavigate && onNavigate('auth')}>Iniciar sesión</Button>
              <Button size="lg" variant="outline" className="ml-4" onClick={() => onNavigate && onNavigate('profile')}>Crear mi perfil</Button>
            </div>
          </div>
          <div className="hero-image-wrapper scroll-observe delay-200">
             {/* Using the generated hero image */}
             <div className="hero-image-placeholder">
               <img src="/hero-placeholder.png" alt="Jóvenes colaborando" className="hero-image" />
               <div className="hero-badge star-glow">⭐ 500+ empleos nuevos hoy</div>
             </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works" id="explore">
        <div className="container">
          <h2 className="section-title scroll-observe">¿Cómo funciona?</h2>
          <div className="steps-grid">
            {[
              { num: 1, title: 'Crea tu perfil', desc: 'Destaca tus habilidades, proyectos personales y lo que te apasiona.' },
              { num: 2, title: 'Explora', desc: 'Encuentra empleos que no requieren experiencia previa o prácticas.' },
              { num: 3, title: 'Postúlate', desc: 'Aplica en un clic y chatea directamente con reclutadores.' },
              { num: 4, title: 'Consigue tu oportunidad', desc: 'Entrevistas ágiles y feedback real para que crezcas.' }
            ].map((step, index) => (
              <Card key={step.num} className={`step-card scroll-observe delay-${(index+1)*100}`} hoverable>
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats scroll-observe">
        <div className="container stats-container">
          <div className="stat-item">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Oportunidades activas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50k+</div>
            <div className="stat-label">Jóvenes registrados</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Empresas aliadas</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" id="resources">
        <div className="container benefits-container">
          <div className="benefits-content scroll-observe">
            <h2>Hecho para jóvenes <span className="text-gradient">como tú</span></h2>
            <ul className="benefits-list">
              <li>
                <span className="check">✓</span> 
                <strong>Perfiles 100% personalizables:</strong> Muestra tu verdadera personalidad.
              </li>
              <li>
                <span className="check">✓</span> 
                <strong>Oportunidades reales:</strong> Cero filtros absurdos de "5 años de experiencia para junior".
              </li>
              <li>
                <span className="check">✓</span> 
                <strong>Comunidad:</strong> Conecta con otros jóvenes y comparte consejos.
              </li>
            </ul>
            <Button className="mt-8" onClick={() => onNavigate && onNavigate('profile')}>Personalizar mi perfil ahora</Button>
          </div>
          <div className="benefits-visual scroll-observe delay-200">
             <Card className="floating-card" hoverable>
               <h4>💡 Consejo del día</h4>
               <p>No subestimes tus proyectos escolares. ¡Son tu mejor portafolio!</p>
             </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta scroll-observe">
        <div className="container text-center">
          <h2>¿Listo para dar el primer paso?</h2>
          <Button size="lg" onClick={() => onNavigate && onNavigate('profile')} className="mt-8">Crear mi perfil gratis</Button>
        </div>
        <div className="bg-star">★</div>
      </section>
    </div>
  );
};

export default LandingPage;
