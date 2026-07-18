/**
 * JobEmailSection.jsx — Correo de empleo con flujo de verificación propio.
 */
import { useState } from 'react';
import { api } from '../../lib/api';

export default function JobEmailSection({ profile, toast }) {
  const [jobEmail, setJobEmail] = useState(profile?.jobEmail || '');
  const [token,    setToken]    = useState('');
  const [step,     setStep]     = useState('idle'); // idle | sent | confirming
  const [loading,  setLoading]  = useState(false);

  const isVerified = profile?.jobEmailVerified;

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/profile/job-email/verify', { jobEmail });
      setStep('sent');
      toast.success('¡Email de verificación enviado!');
      // En dev el token viene en la respuesta para facilitar pruebas
      if (res._devToken) {
        console.info('[DEV] Token:', res._devToken, 'URL:', res._devUrl);
      }
    } catch (err) {
      toast.error(err.message || 'Error al enviar verificación.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/profile/job-email/confirm', { token });
      toast.success('Correo de empleo verificado ✓');
      setStep('idle');
      // Recarga de página para reflejar estado
      window.location.reload();
    } catch (err) {
      toast.error(err.message || 'Token inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-form">
      <div className="pf-field">
        <label htmlFor="job-email">Correo para recibir ofertas de empleo</label>
        <p className="pf-hint" style={{ marginBottom: 8 }}>
          Este correo es <strong>independiente</strong> de tu correo de acceso.
          Solo se comparte con empresas cuando tú aplicas a una vacante.
        </p>

        {isVerified ? (
          <div className="verify-row">
            <input className="pf-input" type="email" value={jobEmail} readOnly style={{ flex: 1 }} />
            <span className="verified-badge">✅ Verificado</span>
          </div>
        ) : (
          <>
            <form className="verify-row" onSubmit={handleSendVerification}>
              <input
                id="job-email"
                className="pf-input"
                type="email"
                maxLength={255}
                value={jobEmail}
                onChange={(e) => setJobEmail(e.target.value)}
                placeholder="mi-empleo@email.com"
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading || step === 'sent'}>
                {loading ? '…' : step === 'sent' ? 'Enviado ✓' : 'Verificar'}
              </button>
            </form>

            {step === 'sent' && (
              <form className="mini-form" onSubmit={handleConfirm} style={{ marginTop: 12 }}>
                <p style={{ fontSize: '0.85rem', color: '#374151' }}>
                  Ingresa el código / token que recibiste en <strong>{jobEmail}</strong>:
                </p>
                <div className="pf-field">
                  <input
                    className="pf-input"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Pega aquí el token de verificación"
                    required
                  />
                </div>
                <div className="pf-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep('idle')}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Verificando…' : 'Confirmar código'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
