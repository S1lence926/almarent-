import { useState, useRef } from 'react';
import { uploadPhoto } from '../api/upload';

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUploader = ({ photos, onChange, maxPhotos = 10 }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setError('');

    const remaining = maxPhotos - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);

    if (toUpload.length === 0) {
      setError(`Максимум ${maxPhotos} фото`);
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const url = await uploadPhoto(file); // <-- убрал token
        uploaded.push(url);
      }
      onChange([...photos, ...uploaded]);
    } catch {
      setError('Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 500 }}>
        Фотографии ({photos.length}/{maxPhotos})
      </label>

      {error && <p style={{ color: '#C2693E', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.6rem', marginBottom: '0.75rem' }}>
        {photos.map((url, i) => (
          <div key={url} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={url} alt={`Фото ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'rgba(28,25,23,0.7)', color: '#fff', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', lineHeight: 1,
              }}
            >
              ×
            </button>
            {i === 0 && (
              <span style={{
                position: 'absolute', bottom: '4px', left: '4px',
                background: 'var(--terracotta)', color: '#fff',
                fontSize: '0.6rem', padding: '2px 6px', borderRadius: '999px', fontWeight: 500,
              }}>
                Главное
              </span>
            )}
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              aspectRatio: '1',
              borderRadius: '10px',
              border: '1.5px dashed var(--border)',
              background: 'var(--pine-light)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--pine)',
              fontSize: '0.75rem',
              gap: '4px',
            }}
          >
            {uploading ? '...' : (
              <>
                <span style={{ fontSize: '1.3rem' }}>+</span>
                Добавить
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
};