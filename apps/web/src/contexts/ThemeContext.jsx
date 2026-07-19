/**
 * ThemeProvider.jsx
 * Lee las preferencias del usuario desde la API y las aplica como
 * variables CSS en :root, en tiempo real.
 * Exporta también ThemeContext para que cualquier componente pueda
 * acceder a las prefs y al helper savePreferences.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

// ─── Mapeo de fuentes → Google Fonts import URL ───────────────────────────────
const FONT_IMPORTS = {
  Inter:      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
  Poppins:    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  Roboto:     'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  Outfit:     'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
  'Fira Code':'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap',
};

// ─── Paleta completa de temas ──────────────────────────────────────────────────
const THEME_TOKENS = {
  dark: {
    '--color-base-dark':    '#000521',
    '--color-primary-dark': '#020C47',
    '--color-primary-mid':  '#011F65',
    '--color-primary-light':'#0E4EB2',
    '--color-bg-surface':   '#1A1F2E',
    '--color-bg-card':      '#1E293B',
    '--color-text-primary': '#F9FAFB',
    '--color-text-muted':   '#9CA3AF',
    '--color-border':       'rgba(255,255,255,0.08)',
    '--body-bg':            '#0B0F19',
  },
  light: {
    '--color-base-dark':    '#F0F4FF',
    '--color-primary-dark': '#DBEAFE',
    '--color-primary-mid':  '#BFDBFE',
    '--color-primary-light':'#3B82F6',
    '--color-bg-surface':   '#FFFFFF',
    '--color-bg-card':      '#F9FAFB',
    '--color-text-primary': '#111827',
    '--color-text-muted':   '#6B7280',
    '--color-border':       'rgba(0,0,0,0.08)',
    '--body-bg':            '#F3F4F6',
  },
};

// ─── Valores por defecto ───────────────────────────────────────────────────────
const DEFAULT_PREFS = {
  theme:       'dark',
  accentColor: '#2078CF',
  fontFamily:  'Inter',
  layoutStyle: 'grid',
  layoutOrder: ['identity', 'education', 'achievements'],
};

// ─── Context ──────────────────────────────────────────────────────────────────
export const ThemeContext = createContext({
  prefs: DEFAULT_PREFS,
  savePreferences: async () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// ─── Aplicador de variables CSS ────────────────────────────────────────────────
function applyTheme(prefs) {
  const root = document.documentElement;
  const tokens = THEME_TOKENS[prefs.theme] || THEME_TOKENS.dark;

  // Tokens de tema (light/dark)
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));

  // Body background
  document.body.style.backgroundColor = tokens['--body-bg'];
  document.body.style.color           = tokens['--color-text-primary'];

  // Color de acento dinámico
  if (prefs.accentColor) {
    root.style.setProperty('--color-accent', prefs.accentColor);
    root.style.setProperty('--shadow-glow', `0 0 15px ${prefs.accentColor}80`);
  }

  // Fuente tipográfica
  if (prefs.fontFamily) {
    root.style.setProperty('--font-body', `'${prefs.fontFamily}', sans-serif`);

    // Cargar la fuente si no está ya
    const linkId = `gfont-${prefs.fontFamily.replace(/\s+/g, '-')}`;
    if (!document.getElementById(linkId) && FONT_IMPORTS[prefs.fontFamily]) {
      const link = document.createElement('link');
      link.id   = linkId;
      link.rel  = 'stylesheet';
      link.href = FONT_IMPORTS[prefs.fontFamily];
      document.head.appendChild(link);
    }
  }

  // Layout style como data-attribute para CSS descendente
  document.documentElement.setAttribute('data-layout', prefs.layoutStyle || 'grid');
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  // Cargar prefs desde el perfil al montar (si el usuario está autenticado)
  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    api.get('/api/profile/me')
      .then(res => {
        const p = res?.data?.preferences;
        if (p) {
          const merged = {
            ...DEFAULT_PREFS,
            ...p,
            layoutOrder: Array.isArray(p.layoutOrder)
              ? p.layoutOrder
              : DEFAULT_PREFS.layoutOrder,
          };
          setPrefs(merged);
          applyTheme(merged);
        } else {
          applyTheme(DEFAULT_PREFS);
        }
      })
      .catch(() => {
        applyTheme(DEFAULT_PREFS);
      });
  }, []);

  // Guardar preferencias y aplicarlas en tiempo real
  const savePreferences = useCallback(async (newPrefs) => {
    await api.patch('/api/profile/preferences', newPrefs);
    const merged = { ...prefs, ...newPrefs };
    setPrefs(merged);
    applyTheme(merged);
    return merged;
  }, [prefs]);

  return (
    <ThemeContext.Provider value={{ prefs, savePreferences }}>
      {children}
    </ThemeContext.Provider>
  );
}
