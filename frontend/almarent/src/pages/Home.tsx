import { useEffect, useState } from 'react';
import { getListings, type ListingFilters } from '../api/listings';
import { type Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { FilterPanel } from '../components/FilterPanel';

export const Home = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async (filters: ListingFilters = {}) => {
    setLoading(true);
    const data = await getListings(filters);
    setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Аренда жилья в Алматы</h1>
      <FilterPanel onChange={fetchListings} />
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
};