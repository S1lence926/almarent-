const CLOUD_NAME = 'dmy2mszbu';
const UPLOAD_PRESET = 'almarent_unsigned';

export const uploadPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
};

export const attachPhotoToListing = async (
  listingId: string,
  url: string,
  isMain: boolean,
  token: string
) => {
  await fetch(`${import.meta.env.VITE_API_URL}/listings/${listingId}/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, is_main: isMain }),
  });
};