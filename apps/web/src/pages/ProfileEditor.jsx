import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './ProfileEditor.css';

const ProfileEditor = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="profile-page">
      <div className="container profile-container">
        <aside className="profile-sidebar scroll-observe">
          <Card>
            <div className="profile-avatar-container">
              {/* Using generated avatar image */}
              <img src="/avatar-placeholder.png" alt="Tu Avatar" className="profile-avatar" />
              <button className="edit-avatar-btn">✏️</button>
            </div>
            <h3 className="text-center mt-4">Tu Perfil</h3>
            <p className="text-center text-muted mb-6">Completa tu perfil para destacar</p>
            
            <nav className="profile-nav">
              <button 
                className={`profile-nav-item ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                👤 Información General
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                ✨ Habilidades
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                🚀 Proyectos
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                ⚙️ Preferencias
              </button>
            </nav>
          </Card>
        </aside>

        <main className="profile-content scroll-observe delay-100">
          <div className="profile-header">
            <h2>Personaliza tu perfil</h2>
            <Button variant="outline" onClick={() => onNavigate('home')}>Volver al inicio</Button>
          </div>

          <Card className="mt-8">
            {activeTab === 'general' && (
              <div className="animate-slide-up">
                <h3>Información General</h3>
                <p className="text-muted mb-6">Cuenta tu historia. A las empresas les importa más tu potencial que tu experiencia.</p>
                
                <form className="profile-form">
                  <div className="form-group">
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Ej. Ana Pérez" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Titular (Headline)</label>
                    <input type="text" placeholder="Ej. Estudiante de diseño apasionada por UI/UX" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Sobre mí (Bio)</label>
                    <textarea rows="4" placeholder="Cuéntanos qué te apasiona, qué estás aprendiendo..." className="form-input"></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <Button type="button">Guardar cambios</Button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab !== 'general' && (
              <div className="animate-slide-up text-center py-12">
                <h3>Sección en construcción</h3>
                <p className="text-muted mt-4">Esta área del perfil estará disponible próximamente.</p>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProfileEditor;
