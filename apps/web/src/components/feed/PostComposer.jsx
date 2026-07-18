import React, { useState } from 'react';
import './PostComposer.css';

const PostComposer = ({ onPostCreate }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);

  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    onPostCreate({
      content,
      media,
      timestamp: new Date().toISOString()
    });

    setContent('');
    setMedia(null);
  };

  return (
    <div className="post-composer card-glass">
      <div className="composer-header">
        <div className="avatar-placeholder"></div>
        <textarea
          className="composer-input"
          placeholder="What's on your mind?"
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

      <div className="composer-actions">
        <div className="media-upload-wrapper">
          <label htmlFor="media-upload" className="media-upload-btn">
            <span>📷 Attach Media (Img/ZIP)</span>
            <input
              type="file"
              id="media-upload"
              accept="image/*,.zip"
              onChange={handleMediaChange}
              hidden
            />
          </label>
        </div>
        <button 
          className="post-btn btn-primary" 
          onClick={handleSubmit}
          disabled={!content.trim() && !media}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
