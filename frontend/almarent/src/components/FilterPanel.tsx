import { useState } from 'react';
import type { ListingFilters } from '../api/listings';

const DISTRICTS = ['Есіл', 'Алматы', 'Бостандық', 'Медеу', 'Наурызбай', 'Турксіб', 'Жетісу', 'Алатау'];

const fieldStyle: React.CSSProperties = {
  padding: '0.65rem 0.9rem',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  fontSize: '0.88rem',
  color: 'var(--ink)',
};

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
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      padding: '1.1rem',
      background: 'var(--surface)',
      borderRadius: '14px',
      border: '1px solid var(--border)',
      marginBottom: '2rem',
    }}>
      <select onChange={e => update('district', e.target.value)} style={fieldStyle}>
        <option value="">Все районы</option>
        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <input type="number" placeholder="Цена от" onChange={e => update('price_min', Number(e.target.value))}
        style={{ ...fieldStyle, width: '110px' }} />
      <input type="number" placeholder="Цена до" onChange={e => update('price_max', Number(e.target.value))}
        style={{ ...fieldStyle, width: '110px' }} />
      <select onChange={e => update('rooms', Number(e.target.value))} style={fieldStyle}>
        <option value="">Комнат</option>
        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select onChange={e => update('sort', e.target.value)} style={fieldStyle}>
        <option value="newest">Сначала новые</option>
        <option value="price_asc">Цена ↑</option>
        <option value="price_desc">Цена ↓</option>
      </select>
    </div>
  );
};