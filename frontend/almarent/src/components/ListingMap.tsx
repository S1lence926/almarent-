import { useEffect, useRef, useState } from 'react';

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export const ListingMap = ({ lat, lng, title }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
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
      center: [lng, lat],
      zoom: 15,
      key,
    });

    new MapGL.Marker(mapInstance.current, {
      coordinates: [lng, lat],
    });
  }, [mapLoaded, lat, lng]);

  return (
    <div>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>На карте</h3>
      <div ref={mapRef} style={{
        width: '100%', height: '220px',
        borderRadius: '12px', overflow: 'hidden',
        border: '1px solid var(--border)',
      }} />

      {lat && lng && (
        <a
          href={`https://2gis.kz/almaty?m=${lng},${lat}/15`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.8rem', color: 'var(--terracotta)', marginTop: '0.4rem', display: 'inline-block' }}
        >
          Открыть в 2GIS →
        </a>
      )}
    </div>
  );
};