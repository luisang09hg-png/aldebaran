import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import './PostComposer.css';

const PostComposer = ({ onPostCreate }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievementId, setSelectedAchievementId] = useState('');
  const [showAchievementSelector, setShowAchievementSelector] = useState(false);

  useEffect(() => {
    // Cargar logros del perfil del usuario
    api.get('/api/profile/me')
      .then(res => {
        if (res.data && res.data.achievements) {
          setAchievements(res.data.achievements);
        }
      })
      .catch(err => console.error('Error al cargar logros para el composer:', err));
  }, []);

  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSelectAchievement = (e) => {
    const id = e.target.value;
    setSelectedAchievementId(id);
    if (id) {
      const selected = achievements.find(a => a.id === parseInt(id, 10));
      if (selected) {
        // Generar automáticamente publicación formateada
        const achievementText = `🏆 ¡He completado un nuevo logro!\n\n✨ **${selected.title}**\n📝 ${selected.description || ''}`;
        setContent(achievementText);
      }
    } else {
      setContent('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !media && !selectedAchievementId) return;

    onPostCreate({
      content,
      media,
      achievementId: selectedAchievementId ? parseInt(selectedAchievementId, 10) : undefined,
      timestamp: new Date().toISOString()
    });

    setContent('');
    setMedia(null);
    setSelectedAchievementId('');
    setShowAchievementSelector(false);
  };

  return (
    <form className="post-composer card-glass animate-slide-up" onSubmit={handleSubmit}>
      <div className="composer-header">
        <div className="avatar-placeholder"></div>
        <textarea
          className="composer-input"
          placeholder="¿Qué tienes en mente hoy?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      </div>
      
      {media && (
        <div className="media-preview">
          <span className="media-name">{media.name}</span>
          <button className="remove-media" onClick={() => setMedia(null)}>×</button>
        </div>
      )}

      {showAchievementSelector && achievements.length > 0 && (
        <div className="achievement-selector-wrapper">
          <label htmlFor="achievement-select" className="block text-xs font-semibold text-gray-400 mb-1">
            Vincular un Logro registrado en tu Perfil:
          </label>
          <select
            id="achievement-select"
            value={selectedAchievementId}
            onChange={handleSelectAchievement}
            className="achievement-select-dropdown"
          >
            <option value="">-- Selecciona un logro --</option>
            {achievements.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.status === 'verified' ? '✓ Verificado' : 'Sin verificar'})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="composer-actions">
        <div className="composer-options-left">
          <label htmlFor="media-upload" className="media-upload-btn">
            <span>📷 Adjuntar Multimedia</span>
            <input
              type="file"
              id="media-upload"
              accept="image/*,.zip"
              onChange={handleMediaChange}
              hidden
            />
          </label>
          
          {achievements.length > 0 && (
            <button 
              type="button"
              className={`achievement-toggle-btn ${showAchievementSelector ? 'active' : ''}`}
              onClick={() => setShowAchievementSelector(!showAchievementSelector)}
            >
              🏆 Publicar Logro
            </button>
          )}
        </div>
        
        <button 
          type="submit"
          className="post-btn btn-primary" 
          disabled={!content.trim() && !media && !selectedAchievementId}
        >
          Publicar
        </button>
      </div>
    </form>
  );
};

export default PostComposer;

