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

  useEffect(() => {
    if ((window as any).mapgl) {
      setMapLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://mapgl.2gis.com/api/js/v1';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;
    const MapGL = (window as any).mapgl;
    const key = import.meta.env.VITE_2GIS_KEY;

    mapInstance.current = new MapGL.Map(mapRef.current, {
      center: [lng ?? 76.8512, lat ?? 43.2220],
      zoom: 13,
      key,
    });

    // Если уже есть координаты — ставим маркер
    if (lat && lng) {
      markerRef.current = new MapGL.Marker(mapInstance.current, {
        coordinates: [lng, lat],
      });
    }

    // Клик по карте — ставим/двигаем маркер
    mapInstance.current.on('click', (e: any) => {
      const { lat: clickLat, lng: clickLng } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.destroy();
      }
      markerRef.current = new MapGL.Marker(mapInstance.current, {
        coordinates: [clickLng, clickLat],
      });

      onChange(clickLat, clickLng);
    });
  }, [mapLoaded]);

  return (
    <div>
      <label style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
        📍 Кликните на карте чтобы выбрать точное местоположение
      </label>
      <div ref={mapRef} style={{
        width: '100%',
        height: '250px',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }} />
    </div>
  );
};