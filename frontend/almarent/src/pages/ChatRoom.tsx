import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage } from '../api/chat';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const ChatRoom = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (id && token) {
      const data = await getMessages(id, token);
      setMessages(data || []);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [id, token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !id || !token) return;
    await sendMessage(id, text, token);
    setText('');
    load();
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', display: 'flex', flexDirection: 'column', height: '75vh' }}>
      <h3 style={{ marginBottom: '1rem' }}>Диалог</h3>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.sender_id === user?.id ? 'flex-end' : 'flex-start',
            background: m.sender_id === user?.id ? '#2563eb' : '#f3f4f6',
            color: m.sender_id === user?.id ? '#fff' : '#1c1917',
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            maxWidth: '70%',
          }}>
            {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Сообщение..."
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Отправить
        </button>
      </form>
    </div>
  );
};