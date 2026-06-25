import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing } from '../api/listings';
import { startChat } from '../api/chat';
import type { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { ListingMap } from '../components/ListingMap';

export const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (id) getListing(id).then(data => {
      setListing(data);
      setActivePhoto(0);
    });
  }, [id]);

  const handleContact = async () => {
    if (!isAuthenticated || !token) { navigate('/login'); return; }
    if (!listing) return;
    try {
      const chat = await startChat(listing.id, token);
      navigate(`/chats/${chat.id}`);
    } catch {
      setError('Не удалось начать чат');
    }
  };

  if (!listing) return <p style={{ padding: '2rem', color: 'var(--ink-soft)' }}>Загрузка...</p>;

  const amenities = [
    listing.has_furniture && 'Мебель',
    listing.has_wifi && 'Wi-Fi',
    listing.has_washer && 'Бытовая техника',
  ].filter(Boolean);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1.5rem 2rem' }}>

      {/* Галерея */}
      {listing.photos && listing.photos.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', height: '400px', background: 'var(--pine-light)', marginBottom: '0.75rem' }}>
            <img src={listing.photos[activePhoto]} alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {listing.photos.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {listing.photos.map((photo, i) => (
                <img key={i} src={photo} alt={`Фото ${i + 1}`}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    width: '80px', height: '60px', objectFit: 'cover',
                    borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                    border: i === activePhoto ? '2px solid var(--terracotta)' : '2px solid transparent',
                    opacity: i === activePhoto ? 1 : 0.7,
                    transition: 'opacity 0.15s, border 0.15s',
                  }} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ height: '300px', background: 'var(--pine-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--pine)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>AlmaRent</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

        {/* Основная информация */}
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{
              background: 'rgba(28,25,23,0.08)', padding: '4px 10px',
              borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500,
            }}>
              {listing.district}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', margin: '0.5rem 0', lineHeight: 1.2 }}>{listing.title}</h1>
          <p style={{ color: 'var(--ink-soft)', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
            📍 {listing.address}
          </p>

          {listing.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Описание</h3>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>{listing.description}</p>
            </div>
          )}

          {/* Характеристики */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Характеристики</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <CharRow label="Комнат" value={`${listing.rooms}`} />
              {listing.floor && <CharRow label="Этаж" value={`${listing.floor}`} />}
            </div>
          </div>

          {amenities.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Удобства</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {amenities.map(a => (
                  <span key={a as string} style={{
                    background: 'var(--pine-light)', color: 'var(--pine)',
                    padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500,
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Боковая панель */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'sticky',
          top: '80px',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--terracotta-dark)', margin: '0 0 0.25rem' }}>
            {listing.price.toLocaleString()} ₸
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>в месяц</p>

          {error && <p style={{ color: 'var(--terracotta)', fontSize: '0.85rem' }}>{error}</p>}

          <button onClick={handleContact} style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '10px',
            background: 'var(--terracotta)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
          }}>
            Связаться с владельцем
          </button>
        </div>
      </div>
    </div>
  );
};

const CharRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    padding: '0.6rem 0.9rem',
    background: 'var(--bg)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  }}>
    <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value}</span>
  </div>
);