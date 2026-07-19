import React, { useState } from 'react';
import { createStory } from '../../lib/storiesApi';
import './StoryComposer.css';

export default function StoryComposer({ onClose, onCreated }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setError('');
      await createStory(file, caption);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al publicar historia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-composer-overlay">
      <div className="story-composer-card card-glass">
        <h3>Nueva Historia</h3>
        
        {error && <div className="error-message">{error}</div>}

        <div className="story-preview-area">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="story-preview-img" />
          ) : (
            <div className="story-placeholder">
              <label className="btn-primary file-btn">
                Seleccionar Imagen
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="story-inputs">
            <input 
              type="text" 
              placeholder="Escribe un pie de foto..." 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
              maxLength={200}
              className="story-caption-input"
            />
            
            <div className="story-actions">
              <button className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading || !file}>
                {loading ? 'Publicando...' : 'Publicar Historia'}
              </button>
            </div>
          </div>
        )}
        
        {!previewUrl && (
          <button className="btn-secondary full-width" onClick={onClose} style={{ marginTop: '1rem' }}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
