import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, archiveListing, restoreListing, hardDeleteListing } from '../api/listings';
import { useAuth } from '../context/AuthContext';
import type { Listing } from '../types';

export const MyListings = () => {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const data = await getMyListings(token);
    setListings(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const handleArchive = async (id: string) => {
    if (!token) return;
    await archiveListing(id, token);
    load();
  };

  const handleRestore = async (id: string) => {
    if (!token) return;
    await restoreListing(id, token);
    load();
  };

  const handleDelete = async () => {
    if (!token || !deleteId) return;
    await hardDeleteListing(deleteId, token);
    setDeleteId(null);
    load();
  };

  const filtered = listings.filter(l =>
    tab === 'active' ? l.status === 'active' : l.status === 'archived'
  );

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Мои объявления</h2>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {(['active', 'archived'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: tab === t ? 600 : 400,
            color: tab === t ? 'var(--terracotta)' : 'var(--ink-soft)',
            borderBottom: tab === t ? '2px solid var(--terracotta)' : '2px solid transparent',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            marginBottom: '-1px',
          }}>
            {t === 'active' ? 'Активные' : 'Архив'}
          </button>
        ))}
      </div>

      {/* Список */}
      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>Загрузка...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)' }}>
          {tab === 'active' ? 'У вас нет активных объявлений' : 'Архив пуст'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(l => (
            <div key={l.id} style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              alignItems: 'center',
            }}>
              {/* Фото */}
              <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--pine-light)' }}>
                {l.photos?.[0] ? (
                  <img src={l.photos[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
              </div>

              {/* Инфо */}
              <div style={{ flex: 1 }}>
                <Link to={`/listings/${l.id}`} style={{ fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>
                  {l.title}
                </Link>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--ink-soft)', fontSize: '0.85rem' }}>
                  {l.district} · {l.price.toLocaleString()} ₸/мес
                </p>
              </div>

              {/* Кнопки */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {tab === 'active' && (
                  <button onClick={() => handleArchive(l.id)} style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'var(--ink)',
                  }}>
                    📦 Архив
                  </button>
                )}
                {tab === 'archived' && (
                  <button onClick={() => handleRestore(l.id)} style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--pine-light)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'var(--pine)',
                  }}>
                    ♻️ Восстановить
                  </button>
                )}
                <button onClick={() => setDeleteId(l.id)} style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  background: '#fff5f5',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: '#dc2626',
                }}>
                  🗑 Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно удаления */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '16px',
            padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Удалить объявление?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Это действие необратимо. Объявление будет удалено навсегда.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} style={{
                padding: '0.65rem 1.25rem', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
                Отмена
              </button>
              <button onClick={handleDelete} style={{
                padding: '0.65rem 1.25rem', borderRadius: '8px',
                border: 'none', background: '#dc2626', color: '#fff',
                cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)',
              }}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};