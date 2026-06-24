import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListingsForMap } from '../api/listings';
import type { Listing } from '../types';

export const MapView = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [filters, setFilters] = useState({ district: '', price_max: '' });
  const navigate = useNavigate();

  useEffect(() => {
    getListingsForMap().then(data => setListings(Array.isArray(data) ? data : []));
  }, []);

  const filtered = listings.filter(l => {
    if (filters.district && l.district !== filters.district) return false;
    if (filters.price_max && l.price > Number(filters.price_max)) return false;
    return true;
  });

  const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

  // Центр Алматы
  const centerLat = 43.2220;
  const centerLng = 76.8512;

  return (
    <div style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      {/* Фильтры */}
      <div style={{
        padding: '0.75rem 1.5rem',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: '0.75rem', alignItems: 'center',
      }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Поиск на карте</span>
        <select value={filters.district} onChange={e => setFilters({ ...filters, district: e.target.value })}
          style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
          <option value="">Все районы</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="number" placeholder="Цена до" value={filters.price_max}
          onChange={e => setFilters({ ...filters, price_max: e.target.value })}
          style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border)', width: '120px', fontSize: '0.85rem' }} />
        <span style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>{filtered.length} объявлений</span>
      </div>

      {/* Контент */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Карта через 2GIS iframe */}
        <iframe
          src={`https://maps.2gis.com/2gis/api/gate/Maps/2.0/get_firm_list?country_code=kg&project=almaty&q=алматы&zoom=12&lat=${centerLat}&lng=${centerLng}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Карта Алматы"
        />

        {/* Список маркеров поверх карты */}
        <div style={{
          position: 'absolute', top: '1rem', right: '1rem',
          width: '280px', maxHeight: 'calc(100% - 2rem)',
          background: 'var(--surface)', borderRadius: '14px',
          border: '1px solid var(--border)', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.85rem' }}>
            Объявления на карте
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--ink-soft)', fontSize: '0.85rem', textAlign: 'center' }}>
              Нет объявлений с координатами.<br />
              <span style={{ fontSize: '0.75rem' }}>Добавьте координаты при создании объявления.</span>
            </div>
          ) : (
            filtered.map(l => (
              <div key={l.id}
                onClick={() => setSelected(selected?.id === l.id ? null : l)}
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selected?.id === l.id ? 'var(--pine-light)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                <div style={{ fontWeight: 500, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{l.title}</div>
                <div style={{ color: 'var(--terracotta-dark)', fontWeight: 600, fontSize: '0.85rem' }}>
                  {l.price.toLocaleString()} ₸/мес
                </div>
                <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>{l.district}</div>
              </div>
            ))
          )}
        </div>

        {/* Превью карточки выбранного объявления */}
        {selected && (
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface)', borderRadius: '14px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            padding: '1rem', width: '320px',
            display: 'flex', gap: '0.75rem', alignItems: 'center',
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--pine-light)' }}>
              {selected.photos?.[0] && <img src={selected.photos[0]} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{selected.title}</div>
              <div style={{ color: 'var(--terracotta-dark)', fontWeight: 700, fontSize: '0.95rem' }}>
                {selected.price.toLocaleString()} ₸/мес
              </div>
              <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>{selected.district}</div>
            </div>
            <button onClick={() => navigate(`/listings/${selected.id}`)} style={{
              padding: '0.5rem 0.75rem', borderRadius: '8px',
              background: 'var(--terracotta)', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              flexShrink: 0,
            }}>
              Открыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};