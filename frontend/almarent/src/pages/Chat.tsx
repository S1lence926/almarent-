import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyChats } from '../api/chat';
import { useAuth } from '../context/AuthContext';

interface ChatItem {
  id: string;
  tenant_id: string;
  landlord_id: string;
  listing_id: string;
  listing_title?: string;
  listing_address?: string;
}

export const Chat = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    if (token) getMyChats(token).then(data => setChats(data || []));
  }, [token]);

  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Мои чаты</h2>
      {chats.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)' }}>У вас пока нет диалогов</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {chats.map(c => (
            <Link key={c.id} to={`/chats/${c.id}`} style={{
              padding: '1rem 1.25rem',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              color: 'inherit',
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {c.listing_title || 'Объявление'}
              </span>
              {c.listing_address && (
                <span style={{ color: 'var(--ink-soft)', fontSize: '0.82rem' }}>
                  📍 {c.listing_address}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};