/**
 * PreferencesForm.jsx
 * Módulo 6 — Personalización Avanzada de la interfaz.
 * Permite seleccionar: tema, color de acento, fuente tipográfica,
 * estilo de layout y orden de secciones del perfil.
 * Los cambios se aplican en VIVO gracias al ThemeProvider.
 */
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SECTIONS = [
  { id: 'identity',     label: '👤 Identidad' },
  { id: 'education',    label: '🎓 Formación' },
  { id: 'achievements', label: '🏆 Logros' },
];

const ACCENTS = [
  { hex: '#2078CF', name: 'Aldebarán Blue' },
  { hex: '#7c3aed', name: 'Violeta' },
  { hex: '#059669', name: 'Esmeralda' },
  { hex: '#d97706', name: 'Ámbar' },
  { hex: '#dc2626', name: 'Rojo' },
  { hex: '#db2777', name: 'Rosa' },
  { hex: '#0891b2', name: 'Cyan' },
  { hex: '#ea580c', name: 'Naranja' },
];

const FONTS = [
  { value: 'Inter',      label: 'Inter',      preview: 'Aa' },
  { value: 'Poppins',    label: 'Poppins',    preview: 'Aa' },
  { value: 'Roboto',     label: 'Roboto',     preview: 'Aa' },
  { value: 'Outfit',     label: 'Outfit',     preview: 'Aa' },
  { value: 'Fira Code',  label: 'Fira Code',  preview: 'Aa' },
];

const LAYOUTS = [
  { value: 'grid',     label: 'Cuadrícula', icon: '▦' },
  { value: 'list',     label: 'Lista',      icon: '☰' },
  { value: 'magazine', label: 'Revista',    icon: '◫' },
];

export default function PreferencesForm({ profile, onSave, toast }) {
  const { prefs, savePreferences } = useTheme();

  const initPrefs = profile?.preferences;
  const [theme,       setTheme]       = useState(initPrefs?.theme       || prefs.theme       || 'dark');
  const [accent,      setAccent]      = useState(initPrefs?.accentColor || prefs.accentColor || '#2078CF');
  const [fontFamily,  setFontFamily]  = useState(initPrefs?.fontFamily  || prefs.fontFamily  || 'Inter');
  const [layoutStyle, setLayoutStyle] = useState(initPrefs?.layoutStyle || prefs.layoutStyle || 'grid');
  const [order,       setOrder]       = useState(initPrefs?.layoutOrder || prefs.layoutOrder || SECTIONS.map((s) => s.id));
  const [saving,      setSaving]      = useState(false);

  const moveUp   = (i) => { if (i === 0) return; const o = [...order]; [o[i-1],o[i]]=[o[i],o[i-1]]; setOrder(o); };
  const moveDown = (i) => { if (i === order.length-1) return; const o=[...order]; [o[i],o[i+1]]=[o[i+1],o[i]]; setOrder(o); };

  // Preview en vivo: aplica los cambios mientras el usuario hace clic (sin guardar)
  const previewChange = (key, value) => {
    const previewPrefs = { theme, accentColor: accent, fontFamily, layoutStyle, [key]: value };
    // Aplicar inmediatamente como preview
    import('../../contexts/ThemeContext').then(({ default: _unused }) => {
      // Mini-apply sin guardar
      const root = document.documentElement;
      if (key === 'accentColor') {
        root.style.setProperty('--color-accent', value);
        root.style.setProperty('--shadow-glow', `0 0 15px ${value}80`);
      }
      if (key === 'fontFamily') {
        root.style.setProperty('--font-body', `'${value}', sans-serif`);
        const linkId = `gfont-${value.replace(/\s+/g, '-')}`;
        if (!document.getElementById(linkId)) {
          const FONT_IMPORTS = {
            Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
            Poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
            Roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
            Outfit: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
            'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap',
          };
          if (FONT_IMPORTS[value]) {
            const link = document.createElement('link');
            link.id = linkId; link.rel = 'stylesheet'; link.href = FONT_IMPORTS[value];
            document.head.appendChild(link);
          }
        }
      }
      if (key === 'theme') {
        const DARK = { '--color-base-dark':'#000521','--color-primary-dark':'#020C47','--body-bg':'#0B0F19','--color-text-primary':'#F9FAFB','--color-bg-card':'#1E293B' };
        const LIGHT = { '--color-base-dark':'#F0F4FF','--color-primary-dark':'#DBEAFE','--body-bg':'#F3F4F6','--color-text-primary':'#111827','--color-bg-card':'#F9FAFB' };
        const tokens = value === 'dark' ? DARK : LIGHT;
        Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
        document.body.style.backgroundColor = tokens['--body-bg'];
        document.body.style.color = tokens['--color-text-primary'];
      }
      if (key === 'layoutStyle') {
        document.documentElement.setAttribute('data-layout', value);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await savePreferences({ theme, accentColor: accent, fontFamily, layoutStyle, layoutOrder: order });
      if (onSave) await onSave({ theme, accentColor: accent, fontFamily, layoutStyle, layoutOrder: order });
      toast.success('Preferencias guardadas y aplicadas ✓');
    } catch (err) {
      toast.error(err.message || 'Error al guardar preferencias.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="pf-form prefs-advanced" onSubmit={handleSubmit}>

      {/* ── Tema ────────────────────────────────────────────────────────── */}
      <div className="pf-field">
        <label>Tema de la interfaz</label>
        <div className="theme-toggle-group">
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              type="button"
              className={`theme-toggle-btn ${theme === t ? 'active' : ''}`}
              onClick={() => { setTheme(t); previewChange('theme', t); }}
            >
              {t === 'light' ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Color de acento ─────────────────────────────────────────────── */}
      <div className="pf-field">
        <label>Color de acento</label>
        <p className="pf-hint">Define el color primario de botones, enlaces y highlights.</p>
        <div className="accent-palette">
          {ACCENTS.map((c) => (
            <button
              key={c.hex}
              type="button"
              className={`accent-swatch ${accent === c.hex ? 'selected' : ''}`}
              style={{ background: c.hex }}
              title={c.name}
              onClick={() => { setAccent(c.hex); previewChange('accentColor', c.hex); }}
            />
          ))}
          <div className="accent-custom-wrap" title="Color personalizado">
            <input
              type="color"
              value={accent}
              onChange={(e) => { setAccent(e.target.value); previewChange('accentColor', e.target.value); }}
              className="accent-color-input"
            />
            <span className="accent-custom-label">✎</span>
          </div>
        </div>
        <div className="accent-preview" style={{ background: accent }}>
          <span>Vista previa: {accent}</span>
        </div>
      </div>

      {/* ── Tipografía ──────────────────────────────────────────────────── */}
      <div className="pf-field">
        <label>Tipografía</label>
        <p className="pf-hint">Cambia la fuente de texto de toda la interfaz.</p>
        <div className="font-selector">
          {FONTS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`font-option ${fontFamily === f.value ? 'selected' : ''}`}
              style={{ fontFamily: `'${f.value}', sans-serif` }}
              onClick={() => { setFontFamily(f.value); previewChange('fontFamily', f.value); }}
            >
              <span className="font-preview">{f.preview}</span>
              <span className="font-name">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Estilo de layout ─────────────────────────────────────────────── */}
      <div className="pf-field">
        <label>Estilo de visualización del feed</label>
        <p className="pf-hint">Afecta cómo se presentan las publicaciones y el contenido.</p>
        <div className="layout-selector">
          {LAYOUTS.map((l) => (
            <button
              key={l.value}
              type="button"
              className={`layout-option ${layoutStyle === l.value ? 'selected' : ''}`}
              onClick={() => { setLayoutStyle(l.value); previewChange('layoutStyle', l.value); }}
            >
              <span className="layout-icon">{l.icon}</span>
              <span className="layout-label">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Orden de secciones ──────────────────────────────────────────── */}
      <div className="pf-field">
        <label>Orden de secciones en tu perfil público</label>
        <p className="pf-hint">Arrastra o usa las flechas para reordenar cómo aparecen tus secciones.</p>
        <div className="sections-order-list">
          {order.map((id, i) => {
            const sec = SECTIONS.find((s) => s.id === id);
            return (
              <div key={id} className="section-order-item">
                <span className="order-drag-handle">⠿</span>
                <span className="order-label">{sec?.label || id}</span>
                <div className="order-arrows">
                  <button type="button" className="order-arrow-btn" onClick={() => moveUp(i)} disabled={i === 0}>↑</button>
                  <button type="button" className="order-arrow-btn" onClick={() => moveDown(i)} disabled={i === order.length - 1}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pf-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : '💾 Guardar y aplicar'}
        </button>
      </div>
    </form>
  );
}
