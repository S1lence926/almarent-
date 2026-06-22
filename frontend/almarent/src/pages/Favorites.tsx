import { useEffect, useState } from 'react';
import type { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { getMyFavorites } from '../api/favorites';
import { useAuth } from '../context/AuthContext';

export const Favorites = () => {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (token) getMyFavorites(token).then(setListings);
  }, [token]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Избранное</h2>
      {listings.length === 0 ? (
        <p style={{ color: '#6b7280' }}>У вас пока нет избранных объявлений</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
};