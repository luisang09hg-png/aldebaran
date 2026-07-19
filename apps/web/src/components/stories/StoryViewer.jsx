import React, { useState, useEffect } from 'react';
import { reactToStory } from '../../lib/storiesApi';
import './StoryViewer.css';

export default function StoryViewer({ storyGroups, initialGroupIndex, onClose }) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const currentGroup = storyGroups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          handleNext();
          return 0;
        }
        return p + 2; // 50 steps of 100ms = 5000ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [groupIndex, storyIndex]);

  const handleNext = () => {
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex(i => i + 1);
    } else if (groupIndex < storyGroups.length - 1) {
      setGroupIndex(i => i + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (storyIndex > 0) {
      setStoryIndex(i => i - 1);
    } else if (groupIndex > 0) {
      setGroupIndex(i => i - 1);
      setStoryIndex(storyGroups[groupIndex - 1].stories.length - 1);
    } else {
      setProgress(0);
    }
  };

  const handleReact = async () => {
    if (!currentStory) return;
    try {
      await reactToStory(currentStory.id, 'like');
    } catch (err) {
      console.error('Error reacting to story', err);
    }
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer-card">
        {/* Progress bar */}
        <div className="story-progress-container">
          {currentGroup.stories.map((story, idx) => (
            <div key={story.id} className="story-progress-bar">
              <div 
                className="story-progress-fill" 
                style={{ 
                  width: idx === storyIndex ? `${progress}%` : (idx < storyIndex ? '100%' : '0%') 
                }} 
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="story-viewer-header">
          <div className="story-viewer-author">
            {currentGroup.author.avatarUrl ? (
              <img src={currentGroup.author.avatarUrl} alt={currentGroup.author.name} className="viewer-avatar" />
            ) : (
              <div className="viewer-avatar fallback">
                {currentGroup.author.name ? currentGroup.author.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <span className="viewer-author-name">{currentGroup.author.name}</span>
          </div>
          <button className="story-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Media */}
        <div className="story-media-container">
          {currentStory.mediaUrl && (
            <img key={currentStory.id} src={currentStory.mediaUrl} alt="Story" className="story-media fade-in" />
          )}
        </div>

        {/* Navigation Zones */}
        <div className="story-nav-zone left" onClick={handlePrev}></div>
        <div className="story-nav-zone right" onClick={handleNext}></div>

        {/* Footer / Caption */}
        <div className="story-viewer-footer">
          {currentStory.caption && (
            <div className="story-caption">{currentStory.caption}</div>
          )}
          <button className="story-react-btn" onClick={handleReact}>
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}
