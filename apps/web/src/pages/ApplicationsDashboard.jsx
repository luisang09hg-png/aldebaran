import React, { useState, useEffect } from 'react';
import { fetchMyApplications } from '../lib/jobsApi';
import StatusTracker from '../components/StatusTracker';
import './ApplicationsDashboard.css';

const ApplicationsDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMyApplications(page, limit);
      setApplications(data.applications || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err.message || 'Error al cargar tus postulaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  // Map backend status to StatusTracker values
  const mapStatus = (backendStatus) => {
    const statusMap = {
      'pending': 'SUBMITTED',
      'reviewed': 'IN_REVIEW',
      'interview': 'INTERVIEW',
      'accepted': 'ACCEPTED',
      'rejected': 'REJECTED'
    };
    return statusMap[backendStatus?.toLowerCase()] || 'SUBMITTED';
  };

  return (
    <div className="applications-dashboard-container">
      <header className="dashboard-header">
        <h1>Mis Postulaciones</h1>
        <p>Haz seguimiento del estado de tus candidaturas</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <h3>Aún no te has postulado a ningún empleo</h3>
          <p>Explora el portal de empleos y encuentra tu próxima oportunidad.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map(app => (
            <div className="application-card" key={app.id || app._id}>
              <div className="app-main-info">
                <div className="app-job-header">
                  <h3>{app.job?.title || 'Puesto no disponible'}</h3>
                  <span className="app-company">
                    {app.job?.company || app.job?.authorName || 'Empresa Confidencial'}
                  </span>
                </div>
                <div className="app-date">
                  Aplicaste el: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Fecha desconocida'}
                </div>
              </div>
              
              <div className="app-status-section">
                <StatusTracker currentStatus={mapStatus(app.status)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1 || loading}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages || loading}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default ApplicationsDashboard;
