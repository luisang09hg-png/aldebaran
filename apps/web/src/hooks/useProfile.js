/**
 * useProfile.js — Hook para cargar y mutar el perfil del usuario autenticado.
 */
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useProfile() {
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/profile/me');
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateIdentity = async (fields) => {
    const { data } = await api.patch('/api/profile/me', fields);
    setProfile(data);
    return data;
  };

  const addAchievement = async (payload) => {
    const { data } = await api.post('/api/profile/achievements', payload);
    setProfile((p) => ({ ...p, achievements: [...(p.achievements || []), data] }));
    return data;
  };

  const editAchievement = async (id, payload) => {
    const { data } = await api.patch(`/api/profile/achievements/${id}`, payload);
    setProfile((p) => ({
      ...p,
      achievements: p.achievements.map((a) => (a.id === id ? data : a)),
    }));
    return data;
  };

  const removeAchievement = async (id) => {
    await api.delete(`/api/profile/achievements/${id}`);
    setProfile((p) => ({ ...p, achievements: p.achievements.filter((a) => a.id !== id) }));
  };

  const addEducation = async (payload) => {
    const { data } = await api.post('/api/profile/educations', payload);
    setProfile((p) => ({ ...p, educations: [...(p.educations || []), data] }));
    return data;
  };

  const editEducation = async (id, payload) => {
    const { data } = await api.patch(`/api/profile/educations/${id}`, payload);
    setProfile((p) => ({
      ...p,
      educations: p.educations.map((e) => (e.id === id ? data : e)),
    }));
    return data;
  };

  const removeEducation = async (id) => {
    await api.delete(`/api/profile/educations/${id}`);
    setProfile((p) => ({ ...p, educations: p.educations.filter((e) => e.id !== id) }));
  };

  const savePreferences = async (prefs) => {
    const { data } = await api.patch('/api/profile/preferences', prefs);
    setProfile((p) => ({ ...p, preferences: data }));
    return data;
  };

  return {
    profile, loading, error,
    refetch: fetchProfile,
    updateIdentity,
    addAchievement, editAchievement, removeAchievement,
    addEducation,   editEducation,   removeEducation,
    savePreferences,
  };
}
