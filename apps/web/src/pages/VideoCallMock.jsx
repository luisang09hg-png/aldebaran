import React from 'react';
import Button from '../components/ui/Button';

const VideoCallMock = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '20px', alignItems: 'start' }}>
      <div style={{ background: 'var(--color-primary-dark)', borderRadius: '24px', padding: '24px', color: 'var(--color-white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' }}>Llamada</p>
            <h3 style={{ margin: '4px 0 0', color: 'var(--color-white)' }}>Entrevista con Marcos</h3>
          </div>
          <span style={{ background: 'rgba(239,68,68,0.22)', color: '#fca5a5', padding: '8px 10px', borderRadius: '999px', fontSize: '0.8rem' }}>En vivo</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ minHeight: '220px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(32,120,207,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>Marcos</div>
          <div style={{ minHeight: '220px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(32,120,207,0.3), rgba(255,255,255,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>Tú</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
          <Button variant="outline">Mic</Button>
          <Button variant="outline">Cámara</Button>
          <Button variant="outline">Compartir</Button>
          <Button>Finalizar</Button>
        </div>
      </div>
      <aside style={{ background: 'var(--color-white)', borderRadius: '24px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
        <h4 style={{ color: 'var(--color-primary-dark)', marginTop: 0 }}>ALD Notes & Tips</h4>
        <ul style={{ paddingLeft: '18px', color: '#4b5563', lineHeight: 1.7 }}>
          <li>Habla con claridad y usa ejemplos concretos.</li>
          <li>Revisa tus proyectos antes de iniciar.</li>
          <li>Tu perfil ya está listo para destacar.</li>
        </ul>
      </aside>
    </div>
  );
};

export default VideoCallMock;
