const API = import.meta.env.VITE_API_URL;

export const addFavorite = async (listingId: string, token: string) => {
  await fetch(`${API}/listings/${listingId}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFavorite = async (listingId: string, token: string) => {
  await fetch(`${API}/listings/${listingId}/favorite`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const checkFavorite = async (listingId: string, token: string): Promise<boolean> => {
  const res = await fetch(`${API}/listings/${listingId}/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.is_favorite;
};

export const getMyFavorites = async (token: string) => {
  const res = await fetch(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};