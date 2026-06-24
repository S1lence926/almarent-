export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  district: string;
  address: string;
  rooms: number;
  floor: number;
  has_furniture: boolean;
  has_wifi: boolean;
  has_washer: boolean;
  is_active: boolean;
  status: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  created_at: string;
}