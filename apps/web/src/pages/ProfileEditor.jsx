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
  { id: 'identity', icon: '👤', label: 'Información' },
  { id: 'experience', icon: '💼', label: 'Experiencia' },
  { id: 'skills', icon: '🛠️', label: 'Habilidades' },
  { id: 'projects', icon: '📁', label: 'Proyectos' },
  { id: 'interests', icon: '✨', label: 'Intereses' },
  { id: 'settings', icon: '⚙️', label: 'Ajustes' },
];

export default function ProfileEditor({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('identity');
  const [bannerPreset, setBannerPreset] = useState('preset');
  const [bannerColor, setBannerColor] = useState('var(--color-accent)');
  const [bannerImage, setBannerImage] = useState('');
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
                onClick={() => onNavigate && onNavigate('dashboard')}
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

            {activeTab === 'experience' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Experiencia reciente</label>
                  <textarea className="pf-textarea" defaultValue="Diseñador junior con enfoque en onboarding digital y UX para productos educativos." />
                </div>
                <div className="pf-field">
                  <label>Logros destacados</label>
                  <textarea className="pf-textarea" defaultValue="Participé en 3 proyectos de prototipado guiados por investigación y testing." />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Habilidades clave</label>
                  <div className="tag-list">
                    {(profile?.skills || ['Diseño', 'React', 'Content']).map((skill) => (
                      <span className="tag" key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Proyectos</label>
                  <textarea className="pf-textarea" defaultValue="Portal de mentorías para jóvenes, landing page con diseño accesible y microinteracciones." />
                </div>
              </div>
            )}

            {activeTab === 'interests' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Intereses</label>
                  <div className="tag-list">
                    {['Startups', 'UX', 'Tecnología', 'Aprendizaje'].map((interest) => (
                      <span className="tag" key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Personalizar banner</label>
                  <select className="pf-select" value={bannerPreset} onChange={(e) => setBannerPreset(e.target.value)}>
                    <option value="preset">Preset</option>
                    <option value="image">Cargar imagen</option>
                    <option value="color">Color</option>
                  </select>
                </div>
                {bannerPreset === 'image' && (
                  <div className="pf-field">
                    <label>URL de la imagen</label>
                    <input className="pf-input" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} placeholder="https://..." />
                  </div>
                )}
                {bannerPreset === 'color' && (
                  <div className="pf-field">
                    <label>Color del banner</label>
                    <input className="pf-input" type="color" value={bannerColor} onChange={(e) => setBannerColor(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Experiencia reciente</label>
                  <textarea className="pf-textarea" defaultValue="Diseñador junior con enfoque en onboarding digital y UX para productos educativos." />
                </div>
                <div className="pf-field">
                  <label>Logros destacados</label>
                  <textarea className="pf-textarea" defaultValue="Participé en 3 proyectos de prototipado guiados por investigación y testing." />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Habilidades clave</label>
                  <div className="tag-list">
                    {(profile?.skills || ['Diseño', 'React', 'Content']).map((skill) => (
                      <span className="tag" key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Proyectos</label>
                  <textarea className="pf-textarea" defaultValue="Portal de mentorías para jóvenes, landing page con diseño accesible y microinteracciones." />
                </div>
              </div>
            )}

            {activeTab === 'interests' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Intereses</label>
                  <div className="tag-list">
                    {['Startups', 'UX', 'Tecnología', 'Aprendizaje'].map((interest) => (
                      <span className="tag" key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="pf-form">
                <div className="pf-field">
                  <label>Personalizar banner</label>
                  <select className="pf-select" value={bannerPreset} onChange={(e) => setBannerPreset(e.target.value)}>
                    <option value="preset">Preset</option>
                    <option value="image">Cargar imagen</option>
                    <option value="color">Color</option>
                  </select>
                </div>
                {bannerPreset === 'image' && (
                  <div className="pf-field">
                    <label>URL de la imagen</label>
                    <input className="pf-input" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} placeholder="https://..." />
                  </div>
                )}
                {bannerPreset === 'color' && (
                  <div className="pf-field">
                    <label>Color del banner</label>
                    <input className="pf-input" type="color" value={bannerColor} onChange={(e) => setBannerColor(e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <aside className="profile-preview-panel">
          <div className="profile-preview-card">
            <div className="profile-preview-banner" style={{ background: bannerPreset === 'color' ? bannerColor : bannerPreset === 'image' && bannerImage ? `url(${bannerImage}) center/cover` : 'linear-gradient(135deg, var(--color-accent), var(--color-primary-dark))' }} />
            <div className="profile-preview-body">
              <div className="profile-preview-avatar">{(profile?.name || 'S').charAt(0)}</div>
              <h3>{profile?.name || 'Sofía Torres'}</h3>
              <p>{profile?.bio || 'Diseñadora digital en crecimiento'}</p>
              <div className="tag-list">
                {(profile?.skills || ['Diseño', 'UX']).slice(0, 3).map((skill) => <span className="tag" key={skill}>{skill}</span>)}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
