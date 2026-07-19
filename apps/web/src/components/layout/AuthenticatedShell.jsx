import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import './AuthenticatedShell.css';

const navItems = [
  { key: 'dashboard', label: 'Inicio', icon: '⌂' },
  { key: 'jobs', label: 'Explorar empleos', icon: '◫' },
  { key: 'applications', label: 'Mis postulaciones', icon: '✓' },
  { key: 'messages', label: 'Mensajes', icon: '✉' },
  { key: 'feed', label: 'Feed', icon: '◷' },
  { key: 'resources', label: 'Recursos', icon: '▣' },
  { key: 'profile', label: 'Mi perfil', icon: '◔' },
];

const AuthenticatedShell = ({ currentPage, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const activeLabel = navItems.find((item) => item.key === currentPage)?.label || 'Inicio';

  return (
    <div className="shell-layout">
      <aside className="shell-sidebar">
        <div className="shell-brand">
          <div className="brand-mark">★</div>
          <div>
            <h3>Aldebaran</h3>
            <p>Talent Hub</p>
          </div>
        </div>

        <nav className="shell-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`shell-nav-item ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.key === 'messages' && <span className="nav-badge">3</span>}
            </button>
          ))}
        </nav>

        <div className="shell-footer-card">
          <p>Hola, {user?.name || user?.email || 'Sofía'}</p>
          <Button variant="outline" size="sm" onClick={logout}>Cerrar sesión</Button>
        </div>
      </aside>

      <main className="shell-content">
        <div className="shell-topbar">
          <div>
            <p className="shell-eyebrow">Panel de talento</p>
            <h2>{activeLabel}</h2>
          </div>
          <div className="topbar-pill">{activeLabel}</div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedShell;
