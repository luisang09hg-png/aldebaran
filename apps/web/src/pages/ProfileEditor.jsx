/**
 * ProfileEditor.jsx — Página principal de edición de perfil.
 * Orquesta las secciones: Identidad, Correo empleo, Logros, Formación, Preferencias.
 */
import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import ToastContainer, { useToast } from '../components/ui/Toast';
import IdentityForm    from './profile/IdentityForm';
import JobEmailSection from './profile/JobEmailSection';
import AchievementsForm from './profile/AchievementsForm';
import EducationForm   from './profile/EducationForm';
import PreferencesForm from './profile/PreferencesForm';
import './ProfileEdit.css';

const NAV = [
  { id: 'identity',     icon: '👤', label: 'Identidad' },
  { id: 'jobEmail',     icon: '📧', label: 'Correo empleo' },
  { id: 'education',    icon: '🎓', label: 'Formación' },
  { id: 'achievements', icon: '🏆', label: 'Logros' },
  { id: 'preferences',  icon: '⚙️', label: 'Preferencias' },
];

export default function ProfileEditor({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('identity');
  const { toasts, toast } = useToast();
  const {
    profile, loading, error,
    updateIdentity,
    addAchievement, editAchievement, removeAchievement,
    addEducation,   editEducation,   removeEducation,
    savePreferences,
  } = useProfile();

  if (loading) return <div className="profile-loading">Cargando tu perfil…</div>;
  if (error)   return <div className="profile-loading" style={{ color: '#dc2626' }}>Error: {error}</div>;

  const sectionTitle = NAV.find((n) => n.id === activeTab);

  return (
    <div className="profile-edit-page">
      <div className="container profile-edit-layout">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside>
          <div className="profile-sidebar-card">
            <div className="profile-avatar-wrap">
              <img
                src={profile?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile?.name || 'U')}`}
                alt="Avatar"
              />
            </div>
            <p className="sidebar-name">{profile?.name || 'Sin nombre'}</p>
            <p className="sidebar-email">{profile?.contactEmail || '—'}</p>

            <nav className="section-nav">
              {NAV.map(({ id, icon, label }) => (
                <button
                  key={id}
                  className={`section-nav-btn ${activeTab === id ? 'active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <span className="nav-icon">{icon}</span>
                  {label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: 20 }}>
              <button
                className="section-nav-btn"
                style={{ color: '#6b7280', width: '100%' }}
                onClick={() => onNavigate('home')}
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="animate-slide-up">
          <div className="profile-main-card">
            <div className="section-header">
              <span style={{ fontSize: '1.4rem' }}>{sectionTitle?.icon}</span>
              <h2>{sectionTitle?.label}</h2>
            </div>

            {activeTab === 'identity' && (
              <IdentityForm
                profile={profile}
                onSave={updateIdentity}
                toast={toast}
              />
            )}

            {activeTab === 'jobEmail' && (
              <JobEmailSection
                profile={profile}
                toast={toast}
              />
            )}

            {activeTab === 'education' && (
              <EducationForm
                profile={profile}
                onAdd={addEducation}
                onEdit={editEducation}
                onDelete={removeEducation}
                toast={toast}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsForm
                profile={profile}
                onAdd={addAchievement}
                onEdit={editAchievement}
                onDelete={removeAchievement}
                toast={toast}
              />
            )}

            {activeTab === 'preferences' && (
              <PreferencesForm
                profile={profile}
                onSave={savePreferences}
                toast={toast}
              />
            )}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
