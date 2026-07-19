import React, { useState, useEffect } from 'react';
import { fetchJobById, applyToJob } from '../../lib/jobsApi';
import './JobDetails.css';

const JobDetails = ({ jobId, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [cvFile, setCvFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const data = await fetchJobById(jobId);
        setJob(data);
      } catch (err) {
        setError(err.message || 'Error al cargar detalles');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setApplyError('Por favor sube un archivo PDF.');
        setCvFile(null);
        return;
      }
      setCvFile(file);
      setApplyError('');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setApplyError('El CV es requerido para postularse.');
      return;
    }
    
    setApplying(true);
    setApplyError('');
    try {
      await applyToJob(jobId, cvFile);
      setApplySuccess(true);
    } catch (err) {
      setApplyError(err.message || 'Error al postularse. Intenta nuevamente.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-details-overlay" onClick={onClose}>
      <div className="job-details-modal" onClick={e => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>×</button>
        
        {loading ? (
          <div className="details-loading">Cargando...</div>
        ) : error ? (
          <div className="details-error">{error}</div>
        ) : job ? (
          <div className="job-details-content">
            <div className="job-details-header">
              <h2>{job.title}</h2>
              <div className="job-company-info">
                <span className="company-name">{job.company || job.authorName || 'Empresa Confidencial'}</span>
                {job.location && <span className="location">📍 {job.location}</span>}
              </div>
              {job.salary && <div className="salary">💰 {job.salary}</div>}
            </div>

            <div className="job-section">
              <h3>Descripción del Puesto</h3>
              <p className="job-description">{job.description}</p>
            </div>

            <div className="job-section">
              <h3>Requisitos</h3>
              <p className="job-requirements">{job.requirements}</p>
            </div>

            <div className="apply-section">
              {applySuccess ? (
                <div className="apply-success">
                  <h4>¡Postulación Exitosa!</h4>
                  <p>Hemos enviado tu CV al empleador.</p>
                  <button className="btn-secondary" onClick={onClose}>Cerrar</button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="apply-form">
                  <h3>Postularse a esta oferta</h3>
                  <div className="file-input-group">
                    <label htmlFor="cv-upload">Sube tu CV (PDF)</label>
                    <input 
                      type="file" 
                      id="cv-upload" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                    />
                  </div>
                  {applyError && <div className="error-message">{applyError}</div>}
                  <button 
                    type="submit" 
                    className="btn-apply" 
                    disabled={applying}
                  >
                    {applying ? 'Enviando...' : 'Postularme'}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default JobDetails;
