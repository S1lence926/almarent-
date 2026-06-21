import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/listings';
import { attachPhotoToListing } from '../api/upload';
import { useAuth } from '../context/AuthContext';
import { PhotoUploader } from '../components/PhotoUploader';

const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) return;
  try {
    const listing = await createListing({
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      floor: Number(form.floor),
    }, token);

    console.log('Created listing:', listing);
    console.log('Photos to attach:', photos);

    for (let i = 0; i < photos.length; i++) {
      console.log('Attaching photo', photos[i], 'to listing', listing.id);
      await attachPhotoToListing(listing.id, photos[i], i === 0, token);
    }

    navigate('/');
  } catch (err) {
    console.error('CREATE LISTING ERROR:', err);
    setError('Не удалось создать объявление');
  }
};

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Новое объявление</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Заголовок" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <textarea placeholder="Описание" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '100px' }} />
        <input type="number" placeholder="Цена (₸/мес)" value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input placeholder="Адрес" value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <input type="number" placeholder="Кол-во комнат" value={form.rooms}
          onChange={e => setForm({ ...form, rooms: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <input type="number" placeholder="Этаж" value={form.floor}
          onChange={e => setForm({ ...form, floor: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <label><input type="checkbox" checked={form.has_furniture}
          onChange={e => setForm({ ...form, has_furniture: e.target.checked })} /> Есть мебель</label>
        <label><input type="checkbox" checked={form.has_wifi}
          onChange={e => setForm({ ...form, has_wifi: e.target.checked })} /> Есть Wi-Fi</label>
        <label><input type="checkbox" checked={form.has_washer}
          onChange={e => setForm({ ...form, has_washer: e.target.checked })} /> Есть стиральная машина</label>

        <PhotoUploader photos={photos} onChange={setPhotos} />

        <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Опубликовать
        </button>
      </form>
    </div>
  );
};