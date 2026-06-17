import { Link } from 'react-router-dom';
import { type Listing } from '../types';

export const ListingCard = ({ listing }: { listing: Listing }) => (
  <Link to={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
      <div style={{ height: '200px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {listing.photos?.[0]
          ? <img src={listing.photos[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ color: '#9ca3af' }}>Нет фото</span>
        }
      </div>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{listing.title}</h3>
        <p style={{ margin: '0 0 0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>{listing.district} · {listing.rooms} комн.</p>
        <p style={{ margin: 0, fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>
          {listing.price.toLocaleString()} ₸/мес
        </p>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {listing.has_furniture && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem' }}>Мебель</span>}
          {listing.has_wifi && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem' }}>Wi-Fi</span>}
          {listing.has_washer && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem' }}>Стиралка</span>}
        </div>
      </div>
    </div>
  </Link>
);