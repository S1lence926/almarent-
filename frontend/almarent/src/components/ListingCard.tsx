import { Link } from 'react-router-dom';
import type { Listing } from '../types';

export const ListingCard = ({ listing }: { listing: Listing }) => (
  <Link to={`/listings/${listing.id}`}>
    <div style={{
      background: 'var(--surface)',
      borderRadius: '14px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(28, 25, 23, 0.08)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        height: '190px',
        background: 'var(--pine-light)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {listing.photos?.[0] ? (
          <img src={listing.photos[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: 'var(--pine)', fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>AlmaRent</span>
        )}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(28,25,23,0.75)',
          color: '#fff',
          fontSize: '0.7rem',
          padding: '4px 10px',
          borderRadius: '999px',
          fontWeight: 500,
        }}>
          {listing.district}
        </span>
      </div>

      <div style={{ padding: '1.1rem 1.2rem' }}>
        <h3 style={{
          fontSize: '1.05rem',
          marginBottom: '0.35rem',
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {listing.title}
        </h3>
        <p style={{ margin: '0 0 0.7rem', color: 'var(--ink-soft)', fontSize: '0.85rem' }}>
          {listing.rooms}-комн. · {listing.address}
        </p>
        <p style={{ margin: '0 0 0.6rem', fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--terracotta-dark)' }}>
          {listing.price.toLocaleString()} ₸<span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 400, fontFamily: 'var(--font-body)' }}> /мес</span>
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {listing.has_furniture && <Tag>Мебель</Tag>}
          {listing.has_wifi && <Tag>Wi-Fi</Tag>}
          {listing.has_washer && <Tag>Стиралка</Tag>}
        </div>
      </div>
    </div>
  </Link>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    background: 'var(--pine-light)',
    color: 'var(--pine)',
    fontSize: '0.72rem',
    padding: '3px 9px',
    borderRadius: '999px',
    fontWeight: 500,
  }}>
    {children}
  </span>
);