import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getListing } from '../api/listings';
import type { Listing } from '../types';

export const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (id) getListing(id).then(setListing);
  }, [id]);

  if (!listing) return <p style={{ padding: '2rem' }}>Загрузка...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1>{listing.title}</h1>
      <p style={{ color: '#6b7280' }}>{listing.district}, {listing.address}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>{listing.price.toLocaleString()} ₸/мес</p>
      <p>{listing.description}</p>
      <button style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
        Связаться с арендодателем
      </button>
    </div>
  );
};