export type Role = 'tenant' | 'landlord';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar_url?: string;
}

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
  photos: string[];
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  tenant_id: string;
  landlord_id: string;
  listing_id: string;
}