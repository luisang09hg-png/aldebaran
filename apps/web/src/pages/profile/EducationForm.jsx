/**
 * EducationForm.jsx — CRUD de formación académica.
 */
import { useState } from 'react';

const STATUS_LABELS = {
  EN_CURSO: 'En curso',
  EGRESADO: 'Egresado',
  TITULADO: 'Titulado',
};

const EMPTY = { institution: '', degree: '', startDate: '', endDate: '', eduStatus: 'EN_CURSO' };

export default function EducationForm({ profile, onAdd, onEdit, onDelete, toast }) {
  const educations = profile?.educations || [];
  const [showAdd, setShowAdd] = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const toDateInput = (iso) => (iso ? iso.slice(0, 10) : '');

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowAdd(true); };
  const openEdit = (e) => {
    setForm({
      institution: e.institution,
      degree:      e.degree,
      startDate:   toDateInput(e.startDate),
      endDate:     toDateInput(e.endDate),
      eduStatus:   e.eduStatus,
    });
    setEditId(e.id);
    setShowAdd(true);
  };
  const closeForm = () => { setShowAdd(false); setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.institution.trim() || !form.degree.trim() || !form.startDate) return;
    setSaving(true);
    try {
      const payload = {
        institution: form.institution.trim().slice(0, 200),
        degree:      form.degree.trim().slice(0, 200),
        startDate:   new Date(form.startDate).toISOString(),
        endDate:     form.endDate ? new Date(form.endDate).toISOString() : null,
        eduStatus:   form.eduStatus,
      };
      if (editId) {
        await onEdit(editId, payload);
        toast.success('Formación actualizada ✓');
      } else {
        await onAdd(payload);
        toast.success('Formación añadida ✓');
      }
      closeForm();
    } catch (err) {
      toast.error(err.message || 'Error al guardar formación.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta entrada de formación?')) return;
    try {
      await onDelete(id);
      toast.success('Formación eliminada.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {educations.length === 0 && !showAdd && (
        <p className="profile-empty">Agrega tu formación universitaria o técnica.</p>
      )}

      <div className="item-list">
        {educations.map((e) => (
          <div key={e.id} className="item-card">
            <div className="item-card-body">
              <div className="item-card-title">{e.degree}</div>
              <div className="item-card-sub">{e.institution}</div>
              <div className="item-card-sub">
                {toDateInput(e.startDate)} → {e.endDate ? toDateInput(e.endDate) : 'Presente'}
              </div>
              <span className="item-card-badge">{STATUS_LABELS[e.eduStatus] || e.eduStatus}</span>
            </div>
            <div className="item-card-actions">
              <button className="icon-btn" onClick={() => openEdit(e)} title="Editar">✏️</button>
              <button className="icon-btn danger" onClick={() => handleDelete(e.id)} title="Eliminar">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <form className="mini-form" onSubmit={handleSubmit}>
          <div className="pf-row">
            <div className="pf-field">
              <label>Institución *</label>
              <input
                className="pf-input"
                type="text"
                maxLength={200}
                required
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="Universidad / Instituto"
              />
            </div>
            <div className="pf-field">
              <label>Carrera / Título *</label>
              <input
                className="pf-input"
                type="text"
                maxLength={200}
                required
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="Ing. en Sistemas"
              />
            </div>
          </div>
          <div className="pf-row">
            <div className="pf-field">
              <label>Fecha de inicio *</label>
              <input
                className="pf-input"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="pf-field">
              <label>Fecha de egreso</label>
              <input
                className="pf-input"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="pf-field">
            <label>Estado</label>
            <select
              className="pf-select"
              value={form.eduStatus}
              onChange={(e) => setForm({ ...form, eduStatus: e.target.value })}
            >
              <option value="EN_CURSO">En curso</option>
              <option value="EGRESADO">Egresado</option>
              <option value="TITULADO">Titulado</option>
            </select>
          </div>
          <div className="pf-actions">
            <button type="button" className="btn btn-outline" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : editId ? 'Actualizar' : 'Añadir formación'}
            </button>
          </div>
        </form>
      )}

      {!showAdd && (
        <button type="button" className="add-btn" onClick={openAdd}>
          ＋ Añadir formación
        </button>
      )}
    </div>
  );
}
