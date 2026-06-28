import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getListingsForMap } from '../api/listings';
import type { Listing } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Фикс иконок Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

export const MapView = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState({ district: '', price_max: '' });
  const navigate = useNavigate();

  useEffect(() => {
    getListingsForMap().then(data => setListings(Array.isArray(data) ? data : []));
  }, []);

  const filtered = listings.filter(l => {
    if (!l.latitude || !l.longitude) return false;
    if (filters.district && l.district !== filters.district) return false;
    if (filters.price_max && l.price > Number(filters.price_max)) return false;
    return true;
  });

  return (
    <div style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      {/* Фильтры */}
      <div style={{
        padding: '0.75rem 1.5rem',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>🗺 Поиск на карте</span>
        <select value={filters.district} onChange={e => setFilters({ ...filters, district: e.target.value })}
          style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
          <option value="">Все районы</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="number" placeholder="Цена до" value={filters.price_max}
          onChange={e => setFilters({ ...filters, price_max: e.target.value })}
          style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border)', width: '110px', fontSize: '0.85rem' }} />
        <span style={{ color: 'var(--ink-soft)', fontSize: '0.82rem' }}>
          {filtered.length} на карте
        </span>
      </div>

      {/* Карта */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[43.2220, 76.8512]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filtered.map(l => (
            <Marker key={l.id} position={[Number(l.latitude), Number(l.longitude)]}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  {l.photos?.[0] && (
                    <img src={l.photos[0]} alt={l.title}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                  )}
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{l.title}</div>
                  <div style={{ color: '#C2693E', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {l.price.toLocaleString()} ₸/мес
                  </div>
                  <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{l.district}</div>
                  <button
                    onClick={() => navigate(`/listings/${l.id}`)}
                    style={{
                      width: '100%', padding: '0.4rem',
                      background: '#C2693E', color: '#fff',
                      border: 'none', borderRadius: '6px',
                      cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                    }}>
                    Подробнее
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};