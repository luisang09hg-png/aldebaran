import { BASE } from './api';

function getToken() {
  return localStorage.getItem('session_token');
}

export async function fetchFeedStories() {
  const token = getToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}/api/stories/feed`, { headers });
  if (!res.ok) {
    throw new Error('Failed to fetch stories');
  }
  return res.json();
}

export async function createStory(mediaFile, caption = '') {
  const token = getToken();
  const formData = new FormData();
  formData.append('media', mediaFile);
  if (caption) {
    formData.append('caption', caption);
  }

  const res = await fetch(`${BASE}/api/stories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Failed to create story');
  }
  return res.json();
}

export async function deleteStory(storyId) {
  const token = getToken();
  const res = await fetch(`${BASE}/api/stories/${storyId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete story');
  }
  return res.json();
}

export async function reactToStory(storyId, type = 'like') {
  const token = getToken();
  const res = await fetch(`${BASE}/api/stories/${storyId}/react`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type })
  });
  if (!res.ok) {
    throw new Error('Failed to react to story');
  }
  return res.json();
}
