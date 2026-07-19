import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchMyApplications, fetchJobs } from '../lib/jobsApi';
import { api } from '../lib/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipDismissed, setTipDismissed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, applicationsRes, jobsRes] = await Promise.all([
          api.get('/api/profile/me'),
          fetchMyApplications(1, 5),
          fetchJobs({ page: 1, limit: 3 }),
        ]);
        setProfile(profileRes?.data || null);
        setApplications(applicationsRes?.applications || []);
        setJobs(jobsRes?.jobs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const completion = useMemo(() => {
    if (!profile) return 58;
    const fields = [profile.name, profile.contactEmail, profile.bio, (profile.skills || []).length > 0];
    const complete = fields.filter(Boolean).length;
    return Math.round((complete / fields.length) * 100);
  }, [profile]);

  const statusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'reviewed':
      case 'pending':
        return 'En revisión';
      case 'interview':
        return 'Entrevista';
      case 'rejected':
        return 'Descartado';
      default:
        return 'En revisión';
    }
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-kicker">Tu panel</p>
          <h3>¡Hola, {profile?.name || user?.name || user?.email || 'Sofía'}!</h3>
          <p className="dashboard-subtitle">Tu perfil está al {completion}% y ya tienes oportunidades recomendadas para ti.</p>
        </div>
        <div className="profile-completion-card">
          <div className="completion-row">
            <span>Completar perfil</span>
            <strong>{completion}%</strong>
          </div>
          <div className="completion-bar">
            <div style={{ width: `${completion}%` }} />
          </div>
          <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'profile' }))}>Completar perfil</Button>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {!tipDismissed && (
            <Card className="tip-card" hoverable>
              <div className="tip-card-header">
                <strong>Tip del día</strong>
                <button type="button" onClick={() => setTipDismissed(true)}>×</button>
              </div>
              <p>Destaca tus proyectos de estudio en tu perfil para captar la atención de reclutadores jóvenes.</p>
            </Card>
          )}

          <section className="dashboard-section">
            <div className="section-header-row">
              <h4>Recomendados para ti</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'jobs' })); }}>Ver más</a>
            </div>
            <div className="jobs-list">
              {jobs.map((job) => (
                <Card key={job.id} hoverable className="job-preview-card">
                  <div className="job-preview-top">
                    <strong>{job.title}</strong>
                    <span>{job.location || 'Remoto'}</span>
                  </div>
                  <p>{job.description?.slice(0, 120) || 'Oportunidad ideal para jóvenes con ganas de crecer.'}</p>
                  <Button size="sm" variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'jobs' }))}>Aplicar</Button>
                </Card>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header-row">
              <h4>Postulaciones recientes</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'applications' })); }}>Ver todas</a>
            </div>
            {loading ? (
              <p>Cargando postulaciones…</p>
            ) : applications.length === 0 ? (
              <p>No tienes postulaciones recientes.</p>
            ) : (
              <div className="applications-list">
                {applications.map((application) => (
                  <div key={application.id} className="application-row">
                    <div>
                      <strong>{application.job?.title || 'Vacante'}</strong>
                      <p>{application.job?.company || application.job?.authorName || 'Equipo de reclutamiento'}</p>
                    </div>
                    <span className={`status-pill ${statusLabel(application.status).toLowerCase().replace(/\s+/g, '-')}`}>
                      {statusLabel(application.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-side">
          <Card className="profile-summary-card" hoverable>
            <div className="avatar-round">{(profile?.name || user?.name || 'S').charAt(0)}</div>
            <h4>{profile?.name || user?.name || 'Sofía'}</h4>
            <p>{profile?.bio || 'Diseñadora digital en crecimiento'}</p>
            <div className="summary-meta">
              <span>📍 {profile?.location || 'Madrid'}</span>
              <span>💼 {profile?.contactEmail || user?.email || 'correo@aldebaran.com'}</span>
            </div>
            <div className="skill-bars">
              {(profile?.skills || ['Diseño', 'React', 'Contenido']).slice(0, 3).map((skill, index) => (
                <div key={skill} className="skill-bar-row">
                  <div className="skill-bar-label">
                    <span>{skill}</span>
                    <span>{70 + index * 10}%</span>
                  </div>
                  <div className="skill-bar-track"><div style={{ width: `${70 + index * 10}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="interest-tags">
              {(profile?.preferences?.layoutOrder || ['Diseño', 'Startups', 'UX']).slice(0, 3).map((interest) => (
                <span key={interest} className="interest-tag">{interest}</span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
