const API = import.meta.env.VITE_API_URL;

export const addFavorite = async (listingId: string, token: string) => {
  const res = await fetch(`${API}/listings/${listingId}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Add favorite failed: ${res.status} ${err}`);
  }
};

export const removeFavorite = async (listingId: string, token: string) => {
  const res = await fetch(`${API}/listings/${listingId}/favorite`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Remove favorite failed: ${res.status} ${err}`);
  }
};

export const checkFavorite = async (listingId: string, token: string | null): Promise<boolean> => {
  if (!token) return false;
  const res = await fetch(`${API}/listings/${listingId}/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data?.is_favorite ?? false;
};

export const getMyFavorites = async (token: string) => {
  const res = await fetch(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};