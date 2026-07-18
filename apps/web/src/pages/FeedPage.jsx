import React, { useState, useEffect } from 'react';
import PostComposer from '../components/feed/PostComposer';
import PostCard from '../components/feed/PostCard';
import './FeedPage.css';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Mock initial posts
    setPosts([
      {
        id: 1,
        author: 'Alex Developer',
        content: 'Just launched my new portfolio! Built with React and Three.js 🚀 What do you think?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 12,
        comments: [
          { id: 1, author: 'Jane UI', text: 'Looks amazing!' }
        ],
        mediaUrl: 'https://via.placeholder.com/600x400/020C47/FFFFFF?text=Portfolio+Launch',
        mediaType: 'image'
      },
      {
        id: 2,
        author: 'Sarah Backend',
        content: 'Here is the source code for the microservices architecture we discussed. Feel free to review.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 5,
        comments: [],
        mediaUrl: '#', // mock download link
        mediaType: 'zip'
      }
    ]);
  }, []);

  const handleCreatePost = (newPostData) => {
    const newPost = {
      id: Date.now(),
      author: 'You',
      content: newPostData.content,
      timestamp: newPostData.timestamp,
      likes: 0,
      comments: [],
    };

    if (newPostData.media) {
      // In a real app, you would upload to a server and get a URL.
      // Mocking it with a local object URL for preview.
      newPost.mediaUrl = URL.createObjectURL(newPostData.media);
      newPost.mediaType = newPostData.media.name.endsWith('.zip') ? 'zip' : 'image';
    }

    setPosts([newPost, ...posts]);
  };

  return (
    <div className="feed-page-container">
      <div className="feed-layout container">
        <aside className="feed-sidebar left">
          <div className="card-glass profile-summary">
            <div className="avatar-placeholder-lg"></div>
            <h3>Your Profile</h3>
            <p>Software Engineer</p>
            <div className="stats">
              <div>
                <span>Connections</span>
                <strong>42</strong>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="feed-main">
          <PostComposer onPostCreate={handleCreatePost} />
          
          <div className="posts-container">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        
        <aside className="feed-sidebar right">
          <div className="card-glass recommendations">
            <h3>Trending Tech</h3>
            <ul>
              <li>#ReactJS</li>
              <li>#Web3</li>
              <li>#AI</li>
              <li>#TypeScript</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
