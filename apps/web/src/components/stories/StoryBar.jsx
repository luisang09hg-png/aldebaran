import React, { useState, useEffect } from 'react';
import { fetchFeedStories } from '../../lib/storiesApi';
import './StoryBar.css';

export default function StoryBar({ onOpenComposer, onSelectGroup, refreshTrigger }) {
  const [storyGroups, setStoryGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await fetchFeedStories();
      if (data.success && data.data) {
        setStoryGroups(data.data);
      } else {
        setStoryGroups(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, [refreshTrigger]);

  return (
    <div className="story-bar-container card-glass">
      <div className="story-bar-scroll">
        <div className="story-item add-story" onClick={onOpenComposer}>
          <div className="story-avatar add-avatar">
            <span className="add-icon">+</span>
          </div>
          <span className="story-author">Agregar</span>
        </div>

        {loading && (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="story-item skeleton">
                <div className="story-avatar skeleton-avatar"></div>
                <div className="skeleton-text"></div>
              </div>
            ))}
          </>
        )}

        {!loading && storyGroups.map((group, index) => (
          <div key={group.author.id} className="story-item" onClick={() => onSelectGroup({ storyGroups, initialGroupIndex: index })}>
            <div className="story-avatar-wrapper unseen">
              <div className="story-avatar">
                {group.author.avatarUrl ? (
                  <img src={group.author.avatarUrl} alt={group.author.name} />
                ) : (
                  <div className="story-avatar-fallback">
                    {group.author.name ? group.author.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
            </div>
            <span className="story-author">{group.author.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
