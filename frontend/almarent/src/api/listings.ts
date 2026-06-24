const API = import.meta.env.VITE_API_URL;

export interface ListingFilters {
  district?: string;
  price_min?: number;
  price_max?: number;
  rooms?: number;
  sort?: string;
}

export const getListings = async (filters: ListingFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.append(k, String(v));
  });
  const res = await fetch(`${API}/listings?${params}`);
  return res.json();
};

export const getListing = async (id: string) => {
  const res = await fetch(`${API}/listings/${id}`);
  return res.json();
};

export const getListingsForMap = async () => {
  const res = await fetch(`${API}/listings/map`);
  return res.json();
};

export const getMyListings = async (token: string) => {
  const res = await fetch(`${API}/my-listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const createListing = async (data: object, token: string) => {
  const res = await fetch(`${API}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  return res.json();
};

export const archiveListing = async (id: string, token: string) => {
  await fetch(`${API}/listings/${id}/archive`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const restoreListing = async (id: string, token: string) => {
  await fetch(`${API}/listings/${id}/restore`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const hardDeleteListing = async (id: string, token: string) => {
  await fetch(`${API}/listings/${id}/hard`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteListing = async (id: string, token: string) => {
  await fetch(`${API}/listings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};