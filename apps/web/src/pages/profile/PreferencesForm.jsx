/**
 * PreferencesForm.jsx — Tema, color de acento y orden de secciones del perfil.
 */
import { useState } from 'react';

const SECTIONS = [
  { id: 'identity',     label: '👤 Identidad' },
  { id: 'education',    label: '🎓 Formación' },
  { id: 'achievements', label: '🏆 Logros' },
];

const ACCENTS = ['#2078CF', '#7c3aed', '#059669', '#d97706', '#dc2626', '#db2777'];

export default function PreferencesForm({ profile, onSave, toast }) {
  const prefs = profile?.preferences;
  const [theme,       setTheme]       = useState(prefs?.theme || 'dark');
  const [accent,      setAccent]      = useState(prefs?.accentColor || '#2078CF');
  const [order,       setOrder]       = useState(prefs?.layoutOrder || SECTIONS.map((s) => s.id));
  const [saving,      setSaving]      = useState(false);

  const moveUp   = (i) => { if (i === 0) return; const o = [...order]; [o[i-1],o[i]]=[o[i],o[i-1]]; setOrder(o); };
  const moveDown = (i) => { if (i === order.length-1) return; const o=[...order]; [o[i],o[i+1]]=[o[i+1],o[i]]; setOrder(o); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ theme, accentColor: accent, layoutOrder: order });
      toast.success('Preferencias guardadas ✓');
    } catch (err) {
      toast.error(err.message || 'Error al guardar preferencias.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="pf-form" onSubmit={handleSubmit}>
      {/* Tema */}
      <div className="pf-field">
        <label>Tema de la interfaz</label>
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          {['light','dark'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                border: `2px solid ${theme===t ? 'var(--color-accent)' : '#d1d5db'}`,
                background: theme===t ? 'var(--color-accent)' : '#f9fafb',
                color: theme===t ? '#fff' : '#374151',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {t === 'light' ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
          ))}
        </div>
      </div>

      {/* Color de acento */}
      <div className="pf-field">
        <label>Color de acento</label>
        <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAccent(c)}
              title={c}
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: c,
                border: accent===c ? '3px solid #000521' : '3px solid transparent',
                cursor: 'pointer',
                boxShadow: accent===c ? '0 0 0 2px #fff, 0 0 0 4px '+c : 'none',
                transition: 'box-shadow 0.2s',
              }}
            />
          ))}
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            title="Color personalizado"
            style={{ width: 36, height: 36, padding: 0, border: 'none', borderRadius: '50%', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Orden de secciones */}
      <div className="pf-field">
        <label>Orden de secciones en tu perfil público</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
          {order.map((id, i) => {
            const sec = SECTIONS.find((s) => s.id === id);
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: 10, padding: '8px 14px',
              }}>
                <span style={{ flex: 1, fontSize: '0.9rem' }}>{sec?.label || id}</span>
                <button type="button" className="icon-btn" onClick={() => moveUp(i)} title="Subir">↑</button>
                <button type="button" className="icon-btn" onClick={() => moveDown(i)} title="Bajar">↓</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pf-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar preferencias'}
        </button>
      </div>
    </form>
  );
}
