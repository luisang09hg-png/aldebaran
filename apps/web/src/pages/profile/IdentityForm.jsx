/**
 * IdentityForm.jsx — Sección de identidad del perfil.
 * Campos: nombre, bio, correo de contacto, skills.
 */
import { useState } from 'react';

export default function IdentityForm({ profile, onSave, toast }) {
  const [name,    setName]    = useState(profile?.name || '');
  const [bio,     setBio]     = useState(profile?.bio  || '');
  const [contact, setContact] = useState(profile?.contactEmail || '');
  const [skills,  setSkills]  = useState(profile?.skills || []);
  const [skill,   setSkill]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const addSkill = () => {
    const s = skill.trim().slice(0, 50);
    if (!s || skills.includes(s) || skills.length >= 30) return;
    setSkills([...skills, s]);
    setSkill('');
  };
  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, bio, contactEmail: contact || null, skills });
      toast.success('Identidad guardada ✓');
    } catch (err) {
      toast.error(err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="pf-form" onSubmit={handleSubmit}>
      <div className="pf-row">
        <div className="pf-field">
          <label htmlFor="ident-name">Nombre completo</label>
          <input
            id="ident-name"
            className="pf-input"
            type="text"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Ana Pérez"
          />
        </div>
        <div className="pf-field">
          <label htmlFor="ident-contact">Correo de contacto público</label>
          <input
            id="ident-contact"
            className="pf-input"
            type="email"
            maxLength={255}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="ana@email.com"
          />
        </div>
      </div>

      <div className="pf-field">
        <label htmlFor="ident-bio">Bio (sobre ti)</label>
        <textarea
          id="ident-bio"
          className="pf-textarea"
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Cuéntanos qué te apasiona y qué buscas..."
        />
        <span className="pf-hint">{bio.length}/500 caracteres</span>
      </div>

      <div className="pf-field">
        <label>Skills / habilidades</label>
        <div className="tag-list">
          {skills.map((s) => (
            <span key={s} className="tag">
              {s}
              <button type="button" className="tag-remove" onClick={() => removeSkill(s)} aria-label={`Eliminar ${s}`}>×</button>
            </span>
          ))}
        </div>
        <div className="tag-input-row">
          <input
            className="pf-input"
            type="text"
            maxLength={50}
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Ej. JavaScript"
          />
          <button type="button" className="add-btn" onClick={addSkill}>+ Añadir</button>
        </div>
        <span className="pf-hint">{skills.length}/30 skills</span>
      </div>

      <div className="pf-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar identidad'}
        </button>
      </div>
    </form>
  );
}
