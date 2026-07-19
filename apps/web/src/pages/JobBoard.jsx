import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../lib/jobsApi';
import JobDetails from '../components/jobs/JobDetails';
import './JobBoard.css';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  const [selectedJobId, setSelectedJobId] = useState(null);

  const loadJobs = async (resetPage = false) => {
    setLoading(true);
    setError('');
    try {
      const targetPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);
      
      const data = await fetchJobs({ search, location, page: targetPage, limit });
      setJobs(data.jobs || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err.message || 'Error al cargar empleos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs(true);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  return (
    <div className="job-board-container">
      <header className="job-board-header">
        <h1>Portal de Empleos</h1>
        <p>Encuentra tu próximo gran desafío profesional</p>
      </header>

      <form className="job-search-form" onSubmit={handleSearch}>
        <div className="search-inputs">
          <input 
            type="text" 
            placeholder="Buscar por puesto, empresa o palabras clave..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Ubicación (ej. Remoto, Madrid)" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" className="search-button">Buscar</button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="jobs-loading">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron empleos</h3>
          <p>Prueba buscando con otros términos o ubicación.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div className="job-card" key={job.id || job._id}>
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className="job-company">{job.company || job.authorName || 'Empresa Confidencial'}</span>
              </div>
              <div className="job-card-meta">
                {job.location && (
                  <span className="job-meta-item">
                    📍 {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="job-meta-item salary-highlight">
                    💰 {job.salary}
                  </span>
                )}
              </div>
              <p className="job-requirements-excerpt">
                {job.requirements || job.description}
              </p>
              <div className="job-card-footer">
                <span className="job-date">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Reciente'}
                </span>
                <button 
                  className="btn-details"
                  onClick={() => setSelectedJobId(job.id || job._id)}
                >
                  Ver Detalles
                </button>
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

      {selectedJobId && (
        <JobDetails 
          jobId={selectedJobId} 
          onClose={() => setSelectedJobId(null)} 
        />
      )}
    </div>
  );
};

export default JobBoard;
