import React, { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './MessagesPage.css';

const initialConversations = [
  { id: 1, name: 'Marcos', role: 'Reclutador', unread: 2, time: 'Hace 8 min', preview: '¿Te parece bien el jueves a las 15:00?' },
  { id: 2, name: 'Diana', role: 'Talent', unread: 0, time: 'Hace 24 min', preview: 'Te envié el feedback de la entrevista.' },
];

const initialMessages = [
  { id: 1, author: 'them', text: 'Hola Sofía, veo que te interesa la vacante de experiencias de usuario.' },
  { id: 2, author: 'me', text: 'Sí, me encantaría conversar más sobre ella.' },
];

const MessagesPage = () => {
  const [activeConversation, setActiveConversation] = useState(initialConversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [showScheduling, setShowScheduling] = useState(false);

  const selectedConversation = useMemo(() => activeConversation, [activeConversation]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: prev.length + 1, author: 'me', text: draft }]);
    setDraft('');
  };

  return (
    <div className="messages-page">
      <div className="messages-shell">
        <aside className="messages-list-panel">
          <div className="messages-list-header">
            <h4>Mensajes</h4>
            <span>3</span>
          </div>
          {initialConversations.map((conversation) => (
            <button key={conversation.id} className={`conversation-item ${selectedConversation.id === conversation.id ? 'active' : ''}`} onClick={() => setActiveConversation(conversation)}>
              <div className="conversation-avatar">{conversation.name.charAt(0)}</div>
              <div className="conversation-body">
                <div className="conversation-topline">
                  <strong>{conversation.name}</strong>
                  <span>{conversation.time}</span>
                </div>
                <p>{conversation.preview}</p>
              </div>
              {conversation.unread > 0 && <span className="unread-pill">{conversation.unread}</span>}
            </button>
          ))}
        </aside>

        <section className="thread-panel">
          <Card className="thread-card">
            <div className="thread-header">
              <div>
                <h4>{selectedConversation.name}</h4>
                <p>{selectedConversation.role}</p>
              </div>
              <Button size="sm" onClick={() => setShowScheduling(true)}>Programar entrevista</Button>
            </div>

            <div className="thread-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message-bubble ${message.author === 'me' ? 'mine' : 'theirs'}`}>
                  {message.text}
                </div>
              ))}
            </div>

            <form className="message-composer" onSubmit={sendMessage}>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escribe un mensaje..." />
              <Button type="submit" size="sm">Enviar</Button>
            </form>
          </Card>
        </section>

        <aside className="job-side-panel">
          <Card className="job-side-card">
            <h4>Detalles de la vacante</h4>
            <p className="job-label">Diseñador Junior</p>
            <p>Diseño de onboarding para nuevas plataformas digitales, colaboración con equipos de producto y marketing.</p>
            <Button size="sm" onClick={() => setShowScheduling(true)}>Programar entrevista</Button>
          </Card>
        </aside>
      </div>

      {showScheduling && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h4>Elige el mejor momento para tu charla con Marcos</h4>
              <button type="button" onClick={() => setShowScheduling(false)}>×</button>
            </div>
            <div className="calendar-grid">
              {['Lun','Mar','Mié','Jue','Vie'].map((day) => <span key={day} className="calendar-day">{day}</span>)}
              {['12','13','14','15','16'].map((item) => <button key={item} type="button" className="calendar-date">{item}</button>)}
            </div>
            <div className="time-slot-list">
              <button type="button" className="time-slot">09:00</button>
              <button type="button" className="time-slot active">15:00</button>
              <button type="button" className="time-slot">18:30</button>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowScheduling(false)}>Cancelar</Button>
              <Button onClick={() => setShowScheduling(false)}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
