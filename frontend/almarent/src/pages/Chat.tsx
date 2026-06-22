import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyChats } from '../api/chat';
import { useAuth } from '../context/AuthContext';

interface ChatItem {
  id: string;
  tenant_id: string;
  landlord_id: string;
  listing_id: string;
}

export const Chat = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    if (token) {
      getMyChats(token).then(data => setChats(data || []));
    }
  }, [token]);

  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Мои чаты</h2>
      {chats.length === 0 ? (
        <p style={{ color: '#6b7280' }}>У вас пока нет диалогов</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {chats.map(c => (
            <Link key={c.id} to={`/chats/${c.id}`} style={{
              padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '10px',
            }}>
              Диалог по объявлению #{c.listing_id.slice(0, 8)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};