import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListingsForMap } from '../api/listings';
import type { Listing } from '../types';

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [filters, setFilters] = useState({ district: '', price_max: '' });
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const navigate = useNavigate();

  const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

  useEffect(() => {
    getListingsForMap().then(data => setListings(Array.isArray(data) ? data : []));
  }, []);

  // Загружаем 2GIS MapGL
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://mapgl.2gis.com/api/js/v1';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  // Инициализируем карту
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;
    const key = import.meta.env.VITE_2GIS_KEY;
    const MapGL = (window as any).mapgl;
    mapInstance.current = new MapGL.Map(mapRef.current, {
      center: [76.8512, 43.2220],
      zoom: 12,
      key,
    });
  }, [mapLoaded]);

  // Добавляем/обновляем маркеры при изменении фильтров
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    const MapGL = (window as any).mapgl;

    // Удаляем старые маркеры
    markersRef.current.forEach(m => m.destroy());
    markersRef.current = [];

    const filtered = listings.filter(l => {
      if (!l.latitude || !l.longitude) return false;
      if (filters.district && l.district !== filters.district) return false;
      if (filters.price_max && l.price > Number(filters.price_max)) return false;
      return true;
    });

    filtered.forEach(l => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          background: #C2693E;
          color: white;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        ">
          ${l.price.toLocaleString()} ₸
        </div>
      `;
      el.onclick = () => setSelected(l);

      const marker = new MapGL.HtmlMarker(mapInstance.current, {
        coordinates: [l.longitude!, l.latitude!],
        html: el.innerHTML,
      });
      markersRef.current.push(marker);
    });
  }, [listings, filters, mapLoaded]);

  const filtered = listings.filter(l => {
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
          {filtered.filter(l => l.latitude).length} на карте
        </span>
      </div>

      {/* Карта */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Превью выбранного объявления */}
        {selected && (
          <div style={{
            position: 'absolute', bottom: '1.5rem', left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface)', borderRadius: '14px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            padding: '1rem', width: '320px',
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            zIndex: 10,
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--pine-light)' }}>
              {selected.photos?.[0] && (
                <img src={selected.photos[0]} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selected.title}
              </div>
              <div style={{ color: 'var(--terracotta-dark)', fontWeight: 700, fontSize: '0.95rem' }}>
                {selected.price.toLocaleString()} ₸/мес
              </div>
              <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>{selected.district}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
              <button onClick={() => navigate(`/listings/${selected.id}`)} style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px',
                background: 'var(--terracotta)', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              }}>
                Открыть
              </button>
              <button onClick={() => setSelected(null)} style={{
                padding: '0.4rem', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'none',
                cursor: 'pointer', fontSize: '0.75rem', color: 'var(--ink-soft)',
              }}>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};