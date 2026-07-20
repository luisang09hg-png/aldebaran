import { BASE as API_URL } from './api';

const getHeaders = () => {
  const token = localStorage.getItem('session_token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

export const fetchJobs = async ({ search = '', location = '', page = 1, limit = 10 } = {}) => {
  const queryParams = new URLSearchParams({ search, location, page, limit });
  const response = await fetch(`${API_URL}/api/jobs?${queryParams}`, {
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
};

export const fetchJobById = async (id) => {
  const response = await fetch(`${API_URL}/api/jobs/${id}`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch job details');
  return response.json();
};

export const applyToJob = async (jobId, cvFile) => {
  const formData = new FormData();
  if (cvFile) formData.append('cv', cvFile);
  
  const token = localStorage.getItem('session_token');
  const response = await fetch(`${API_URL}/api/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to apply to job');
  }
  return response.json();
};

export const fetchMyApplications = async (page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({ page, limit });
  const response = await fetch(`${API_URL}/api/applications?${queryParams}`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
};

export const fetchApplicationById = async (id) => {
  const response = await fetch(`${API_URL}/api/applications/${id}`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch application details');
  return response.json();
};
