import { useEffect, useState } from 'react';
import { getListings, type ListingFilters } from '../api/listings';
import type { Listing } from '../types';
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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 2.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
          АЛМАТЫ
        </p>
        <h1 style={{ fontSize: '2.6rem', lineHeight: 1.1, maxWidth: '600px' }}>
          Найдите дом, который чувствуется своим
        </h1>
      </div>

      <FilterPanel onChange={fetchListings} />

      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>Загрузка...</p>
      ) : listings.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)' }}>Объявлений пока нет — станьте первым, кто разместит жильё.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
};