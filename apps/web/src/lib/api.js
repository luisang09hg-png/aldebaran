/**
 * api.js — Cliente HTTP centralizado para llamadas a la API.
 * Adjunta el token de sesión automáticamente desde localStorage.
 */
const isProd = import.meta.env.PROD;
const VITE_API_URL = import.meta.env.VITE_API_URL;

if (isProd && !VITE_API_URL) {
  console.error("CRITICAL ERROR: VITE_API_URL is not defined in production!");
}

export const BASE = VITE_API_URL || 'http://localhost:3000';


async function request(method, path, body) {
  const token = localStorage.getItem('session_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: 'Respuesta inválida del servidor' };
  }

  // FIXED: Handle both data.error and data.message for error messages
  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Error desconocido';
    const error = new Error(errorMessage);
    error.status = res.status;
    error.response = data;
    throw error;
  }

  return data;
}

export const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  patch:  (path, body)   => request('PATCH',  path, body),
  delete: (path)         => request('DELETE', path),
};
