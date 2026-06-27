import { useEffect, useRef, useState } from 'react';

interface Props {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
}

export const MapPicker = ({ lat, lng, onChange }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if ((window as any).mapgl) {
      setMapLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://mapgl.2gis.com/api/js/v1';
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;

    try {
      const MapGL = (window as any).mapgl;
      const key = import.meta.env.VITE_2GIS_KEY;

      mapInstance.current = new MapGL.Map(mapRef.current, {
        center: [lng ?? 76.8512, lat ?? 43.2220],
        zoom: 13,
        key,
      });

      if (lat && lng) {
        markerRef.current = new MapGL.Marker(mapInstance.current, {
          coordinates: [lng, lat],
        });
      }

      mapInstance.current.on('click', (e: any) => {
        try {
          // 2GIS возвращает lngLat как объект {lat, lng} или массив
          let clickLat: number;
          let clickLng: number;

          if (e.lngLat && typeof e.lngLat.lat === 'number') {
            clickLat = e.lngLat.lat;
            clickLng = e.lngLat.lng;
          } else if (Array.isArray(e.lngLat)) {
            clickLng = e.lngLat[0];
            clickLat = e.lngLat[1];
          } else if (e.point) {
            // fallback
            clickLat = e.point.lat ?? e.point.y;
            clickLng = e.point.lng ?? e.point.x;
          } else {
            return;
          }

          if (typeof clickLat !== 'number' || typeof clickLng !== 'number') return;

          if (markerRef.current) {
            markerRef.current.destroy();
          }
          markerRef.current = new MapGL.Marker(mapInstance.current, {
            coordinates: [clickLng, clickLat],
          });

          onChange(clickLat, clickLng);
        } catch (err) {
          console.error('Map click error:', err);
        }
      });
    } catch (err) {
      console.error('Map init error:', err);
      setError(true);
    }
  }, [mapLoaded]);

  if (error) {
    return (
      <div style={{
        padding: '1rem', borderRadius: '10px',
        border: '1px solid var(--border)', background: 'var(--bg)',
        color: 'var(--ink-soft)', fontSize: '0.85rem', textAlign: 'center',
      }}>
        Не удалось загрузить карту. Координаты будут получены автоматически по адресу.
      </div>
    );
  }

  return (
    <div>
      <label style={{
        fontSize: '0.85rem', color: 'var(--ink-soft)',
        fontWeight: 500, display: 'block', marginBottom: '0.4rem',
      }}>
        📍 Кликните на карте чтобы выбрать точное местоположение
      </label>
      <div ref={mapRef} style={{
        width: '100%', height: '250px',
        borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden',
      }} />
    </div>
  );
};