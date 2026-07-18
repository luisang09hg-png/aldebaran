/**
 * AchievementsForm.jsx — CRUD de logros con estado verificado/no verificado.
 */
import { useState } from 'react';

const EMPTY = { title: '', description: '', fileUrl: '' };

export default function AchievementsForm({ profile, onAdd, onEdit, onDelete, toast }) {
  const achievements = profile?.achievements || [];
  const [showAdd,  setShowAdd]  = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowAdd(true); };
  const openEdit = (a) => { setForm({ title: a.title, description: a.description || '', fileUrl: a.fileUrl || '' }); setEditId(a.id); setShowAdd(true); };
  const closeForm = () => { setShowAdd(false); setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title:       form.title.trim().slice(0, 120),
        description: form.description.trim().slice(0, 500) || undefined,
        fileUrl:     form.fileUrl.trim() || undefined,
      };
      if (editId) {
        await onEdit(editId, payload);
        toast.success('Logro actualizado ✓');
      } else {
        await onAdd(payload);
        toast.success('Logro añadido ✓');
      }
      closeForm();
    } catch (err) {
      toast.error(err.message || 'Error al guardar logro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este logro?')) return;
    try {
      await onDelete(id);
      toast.success('Logro eliminado.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {achievements.length === 0 && !showAdd && (
        <p className="profile-empty">Aún no tienes logros. ¡Añade tu primer diploma o certificado!</p>
      )}

      <div className="item-list">
        {achievements.map((a) => (
          <div key={a.id} className="item-card">
            <div className="item-card-body">
              <div className="item-card-title">{a.title}</div>
              {a.description && <div className="item-card-sub">{a.description}</div>}
              <span className={`item-card-badge ${a.status !== 'verified' ? 'unverified' : ''}`}>
                {a.status === 'verified' ? '✅ Verificado' : '⏳ Sin verificar'}
              </span>
            </div>
            <div className="item-card-actions">
              <button className="icon-btn" onClick={() => openEdit(a)} title="Editar">✏️</button>
              <button className="icon-btn danger" onClick={() => handleDelete(a.id)} title="Eliminar">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <form className="mini-form" onSubmit={handleSubmit}>
          <div className="pf-field">
            <label>Título del logro *</label>
            <input
              className="pf-input"
              type="text"
              maxLength={120}
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej. Certificado en React – Coursera"
            />
          </div>
          <div className="pf-field">
            <label>Descripción</label>
            <textarea
              className="pf-textarea"
              maxLength={500}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detalles del logro o certificación"
              rows={3}
            />
          </div>
          <div className="pf-field">
            <label>URL del archivo de respaldo</label>
            <input
              className="pf-input"
              type="url"
              maxLength={2048}
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="https://... (imagen, PDF, etc.)"
            />
          </div>
          <div className="pf-actions">
            <button type="button" className="btn btn-outline" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : editId ? 'Actualizar' : 'Añadir logro'}
            </button>
          </div>
        </form>
      )}

      {!showAdd && (
        <button type="button" className="add-btn" onClick={openAdd}>
          ＋ Añadir logro o certificado
        </button>
      )}
    </div>
  );
}
