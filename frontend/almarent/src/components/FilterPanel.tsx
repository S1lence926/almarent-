import { useState } from 'react';
import { type ListingFilters } from '../api/listings';

const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

interface Props {
  onChange: (filters: ListingFilters) => void;
}

export const FilterPanel = ({ onChange }: Props) => {
  const [filters, setFilters] = useState<ListingFilters>({});

  const update = (key: keyof ListingFilters, value: string | number) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: '#f9fafb', borderRadius: '12px', marginBottom: '1.5rem' }}>
      <select onChange={e => update('district', e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <option value="">Все районы</option>
        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <input type="number" placeholder="Цена от" onChange={e => update('price_min', Number(e.target.value))}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', width: '120px' }} />
      <input type="number" placeholder="Цена до" onChange={e => update('price_max', Number(e.target.value))}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', width: '120px' }} />
      <select onChange={e => update('rooms', Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <option value="">Комнат</option>
        {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select onChange={e => update('sort', e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <option value="newest">Сначала новые</option>
        <option value="price_asc">Цена ↑</option>
        <option value="price_desc">Цена ↓</option>
      </select>
    </div>
  );
};