const API = import.meta.env.VITE_API_URL;

export const uploadPhoto = async (file: File, token: string): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  const SERVER = API.replace('/api', '');
  return `${SERVER}${data.url}`;
};

export const attachPhotoToListing = async (listingId: string, url: string, isMain: boolean, token: string) => {
  await fetch(`${API}/listings/${listingId}/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, is_main: isMain }),
  });
};