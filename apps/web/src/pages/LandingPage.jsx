import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './LandingPage.css';

const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  
  // Extract digits from the value string (e.g. "10k+" -> 10, "500+" -> 500)
  const numVal = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const isK = value.toLowerCase().includes('k');
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const roundedVal = Math.round(latest);
    return isK ? `${roundedVal}k${suffix}` : `${roundedVal}${suffix}`;
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, numVal, { duration: 1.8, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, numVal, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const LandingPage = ({ onNavigate }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container hero-container">
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeInUp}>
              Tu primer trabajo <br/>
              <span className="text-gradient">puede cambiarlo todo</span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              Descubre oportunidades diseñadas para jóvenes sin experiencia. Aldebaran es tu plataforma social para iniciar tu carrera profesional.
            </motion.p>
            
            <motion.div className="hero-cta" variants={fadeInUp}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" onClick={() => onNavigate && onNavigate('auth')}>Iniciar sesión</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="ml-4">
                <Button size="lg" variant="outline" onClick={() => onNavigate && onNavigate('profile')}>Crear mi perfil</Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="hero-image-placeholder">
              <img src="/hero-placeholder.png" alt="Jóvenes colaborando" className="hero-image" />
              <motion.div 
                className="hero-badge star-glow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                ⭐ 500+ empleos nuevos hoy
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works" id="explore">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            ¿Cómo funciona?
          </motion.h2>
          
          <motion.div 
            className="steps-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {[
              { num: 1, title: 'Crea tu perfil', desc: 'Destaca tus habilidades, proyectos personales y lo que te apasiona.' },
              { num: 2, title: 'Explora', desc: 'Encuentra empleos que no requieren experiencia previa o prácticas.' },
              { num: 3, title: 'Postúlate', desc: 'Aplica en un clic y chatea directamente con reclutadores.' },
              { num: 4, title: 'Consigue tu oportunidad', desc: 'Entrevistas ágiles y feedback real para que crezcas.' }
            ].map((step) => (
              <motion.div 
                key={step.num}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="step-card" hoverable>
                  <div className="step-number">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container stats-container">
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter value="10" suffix="k+" />
            </div>
            <div className="stat-label">Oportunidades activas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter value="50" suffix="k+" />
            </div>
            <div className="stat-label">Jóvenes registrados</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter value="500" suffix="+" />
            </div>
            <div className="stat-label">Empresas aliadas</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" id="resources">
        <div className="container benefits-container">
          <motion.div 
            className="benefits-content"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2>Hecho para jóvenes <span className="text-gradient">como tú</span></h2>
            <ul className="benefits-list">
              <motion.li whileHover={{ x: 5 }}>
                <span className="check">✓</span> 
                <strong>Perfiles 100% personalizables:</strong> Muestra tu verdadera personalidad.
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <span className="check">✓</span> 
                <strong>Oportunidades reales:</strong> Cero filtros absurdos de "5 años de experiencia para junior".
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <span className="check">✓</span> 
                <strong>Comunidad:</strong> Conecta con otros jóvenes y comparte consejos.
              </motion.li>
            </ul>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
              <Button className="mt-8" onClick={() => onNavigate && onNavigate('profile')}>Personalizar mi perfil ahora</Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="benefits-visual"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ y: 15 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Card className="floating-card" hoverable>
                <h4>💡 Consejo del día</h4>
                <p>No subestimes tus proyectos escolares. ¡Son tu mejor portafolio!</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <motion.div 
          className="container text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>¿Listo para dar el primer paso?</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
            <Button size="lg" onClick={() => onNavigate && onNavigate('profile')} className="mt-8">Crear mi perfil gratis</Button>
          </motion.div>
        </motion.div>
        <div className="bg-star">★</div>
      </section>
    </div>
  );
};

export default LandingPage;
