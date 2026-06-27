import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/listings';
import { attachPhotoToListing } from '../api/upload';
import { useAuth } from '../context/AuthContext';
import { PhotoUploader } from '../components/PhotoUploader';
import { MapPicker } from '../components/MapPicker';

const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

const geocodeAddress = async (address: string) => {
  const query = encodeURIComponent(`Алматы, ${address}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=kz`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AlmaRent/1.0 (almarent@gmail.com)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
};

export const CreateListing = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', district: DISTRICTS[0],
    address: '', rooms: '1', floor: '', has_furniture: false,
    has_wifi: false, has_washer: false,
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [addressStatus, setAddressStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [showMap, setShowMap] = useState(false);

  const validateAddress = async () => {
    if (!form.address.trim() || form.address.length < 5) return;
    setAddressStatus('checking');
    const result = await geocodeAddress(form.address);
    if (result) {
      setCoords(result);
      setAddressStatus('valid');
      setShowMap(true);
    } else {
      setCoords(null);
      setAddressStatus('invalid');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.address.trim()) { setError('Введите адрес'); return; }

    let finalCoords = coords;
    if (!finalCoords && form.address.trim()) {
      finalCoords = await geocodeAddress(form.address);
    }

    try {
      const listing = await createListing({
        ...form,
        price: Number(form.price),
        rooms: Number(form.rooms),
        floor: Number(form.floor),
        latitude: finalCoords?.lat,
        longitude: finalCoords?.lng,
      }, token);

      for (let i = 0; i < photos.length; i++) {
        await attachPhotoToListing(listing.id, photos[i], i === 0, token);
      }
      navigate('/');
    } catch {
      setError('Не удалось создать объявление');
    }
  };

  const fieldStyle: React.CSSProperties = {
    padding: '0.75rem', borderRadius: '8px',
    border: '1px solid var(--border)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  };

  return (
    <div style={{ maxWidth: '540px', margin: '3rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Новое объявление</h2>
      {error && <p style={{ color: 'var(--terracotta)', fontSize: '0.9rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Заголовок" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} style={fieldStyle} />
        <textarea placeholder="Описание" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={{ ...fieldStyle, minHeight: '100px' }} />
        <input type="number" placeholder="Цена (₸/мес)" value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} style={fieldStyle} />
        <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} style={fieldStyle}>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input placeholder="Адрес (ул. Абая 1)" value={form.address}
              onChange={e => {
                setForm({ ...form, address: e.target.value });
                setAddressStatus('idle');
              }}
              style={{ ...fieldStyle, flex: 1 }} />
            <button type="button" onClick={validateAddress}
              disabled={addressStatus === 'checking'}
              style={{
                padding: '0.75rem 1rem', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg)',
                cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-body)',
              }}>
              {addressStatus === 'checking' ? '⏳' : '📍 Найти'}
            </button>
          </div>
          {addressStatus === 'valid' && (
            <span style={{ color: 'var(--pine)', fontSize: '0.8rem' }}>
              ✅ Адрес найден — уточните точку на карте
            </span>
          )}
          {addressStatus === 'invalid' && (
            <span style={{ color: 'var(--terracotta)', fontSize: '0.8rem' }}>
              ❌ Адрес не найден — уточните название улицы
            </span>
          )}
        </div>

        <button type="button" onClick={() => setShowMap(!showMap)} style={{
          padding: '0.6rem', borderRadius: '8px',
          border: '1px dashed var(--border)', background: 'none',
          cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink-soft)',
          fontFamily: 'var(--font-body)',
        }}>
          {showMap ? '🗺 Скрыть карту' : '🗺 Выбрать точку на карте'}
        </button>

        {showMap && (
          <MapPicker
            lat={coords?.lat}
            lng={coords?.lng}
            onChange={(lat, lng) => setCoords({ lat, lng })}
          />
        )}
        {coords && (
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', margin: 0 }}>
            Координаты: {coords.lat?.toFixed(5)}, {coords.lng?.toFixed(5)}
          </p>
        )}

        <input type="number" placeholder="Кол-во комнат" value={form.rooms}
          onChange={e => setForm({ ...form, rooms: e.target.value })} style={fieldStyle} />
        <input type="number" placeholder="Этаж" value={form.floor}
          onChange={e => setForm({ ...form, floor: e.target.value })} style={fieldStyle} />
        <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={form.has_furniture}
            onChange={e => setForm({ ...form, has_furniture: e.target.checked })} /> Есть мебель
        </label>
        <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={form.has_wifi}
            onChange={e => setForm({ ...form, has_wifi: e.target.checked })} /> Есть Wi-Fi
        </label>
        <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={form.has_washer}
            onChange={e => setForm({ ...form, has_washer: e.target.checked })} /> Есть бытовая техника
        </label>

        <PhotoUploader photos={photos} onChange={setPhotos} />

        <button type="submit" style={{
          padding: '0.75rem', borderRadius: '8px',
          background: 'var(--terracotta)', color: '#fff',
          border: 'none', cursor: 'pointer', fontWeight: 600,
          fontFamily: 'var(--font-body)',
        }}>
          Опубликовать
        </button>
      </form>
    </div>
  );
};