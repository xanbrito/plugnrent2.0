// Tipos principais do Sistema Vibing

export interface UserProfile {
  user_id: string;
  full_name: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  host_name: string;
  host_full_name: string;
  host_cpf?: string;
  host_cnpj?: string;
  host_email: string;
  host_phone?: string;
  host_is_company: boolean;
  space_name: string;
  address: string;
  how_to_enter?: string;
  google_maps_link?: string;
  waze_link?: string;
  type: 'quarto' | 'espaco-inteiro';
  description: string;
  rules: Rule[];
  pricing_monday?: number;
  pricing_tuesday?: number;
  pricing_wednesday?: number;
  pricing_thursday?: number;
  pricing_friday?: number;
  pricing_saturday?: number;
  pricing_sunday?: number;
  airbnb_link?: string;
  budget_via_site: boolean;
  pet_friendly_allowed: boolean;
  pet_friendly_size?: 'pequeno' | 'grande' | 'ambos';
  pet_friendly_start_date?: string;
  pet_friendly_end_date?: string;
  pet_friendly_rules?: string;
  pet_friendly_cost_type?: 'fixed' | 'percentage';
  pet_friendly_cost_value?: number;
  whats_included_not_included?: string[];
  whats_included_kitchen_materials?: string[];
  whats_included_cleaning_materials?: string[];
  whats_included_bed_linen: boolean;
  whats_included_amenities?: string[];
  property_items: PropertyItems;
  local_tips: LocalTip[];
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Rule {
  id?: string;
  icon?: string;
  iconType?: 'emoji' | 'image' | 'default';
  title: string;
  description: string;
}

export interface PropertyItems {
  breakfast?: {
    provided: boolean;
    description?: string;
    extra_fee?: number;
  };
  kitchen?: string[];
  bedroom?: string[];
  bathroom?: string[];
  laundry?: string[];
  other?: string[];
}

export interface LocalTip {
  id?: string;
  category: 'restaurant' | 'attraction' | 'service' | 'experience';
  name: string;
  description: string;
  cover_photo?: string;
  link?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
}

export interface Photo {
  id: string;
  property_id: string;
  url: string;
  category?: string;
  is_featured: boolean;
  order: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  property_id: string;
  checkin_link_token: string;
  checkin_data: CheckinData;
  guests: GuestData[];
  channel: string;
  status: 'pending' | 'completed' | 'cancelled';
  name?: string;
  created_at: string;
}

export interface CheckinData {
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price?: number;
  notes?: string;
}

export interface GuestData {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
}

export interface Guest {
  id: string;
  reservation_id?: string;
  name: string;
  cpf?: string;
  birth_date?: string;
  rg?: string;
  email: string;
  selfie_document_url?: string;
  document_url?: string;
  status: 'active' | 'inactive';
  is_titular: boolean;
  email_verified: boolean;
  password_hash?: string;
  oauth_provider?: string;
  oauth_id?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  address_proof_url?: string;
  validation_status?: 'pending' | 'approved' | 'rejected';
  validated_by?: string;
  validated_at?: string;
  validation_notes?: string;
  profile_complete: boolean;
  is_temporary: boolean;
  created_by_guest_id?: string;
  urgencia: boolean;
  created_at: string;
}

export interface Condominium {
  id: string;
  name: string;
  cnpj?: string;
  cpf?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}

export interface CondominiumProperty {
  id: string;
  condominium_id: string;
  property_id: string;
  created_at: string;
  created_by?: string;
}

export interface CondominiumInvite {
  id: string;
  condominium_id?: string;
  property_id: string;
  host_id: string;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

export interface ReservationPublicLink {
  id: string;
  reservation_id: string;
  token: string;
  email?: string;
  expires_at: string;
  created_at: string;
  created_by?: string;
  access_count: number;
  last_accessed_at?: string;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'trial' | 'paid';
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  conversations_count: number;
  conversations_limit: number;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para formulários
export interface PropertyFormData {
  step1: {
    host_name: string;
    host_full_name: string;
    host_cpf?: string;
    host_cnpj?: string;
    host_email: string;
    host_phone?: string;
    host_is_company: boolean;
  };
  step2: {
    space_name: string;
    type: 'quarto' | 'espaco-inteiro';
    description: string;
    airbnb_link?: string;
    photos?: Array<{
      url: string;
      selected: boolean;
      isFeatured?: boolean;
      category?: string;
    }>;
  };
  step3: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    how_to_enter?: string;
    google_maps_link?: string;
    waze_link?: string;
    wifi_name?: string;
    wifi_password?: string;
  };
  step4: {
    rules: Rule[];
  };
  step5: {
    property_items: PropertyItems;
  };
  step6: {
    local_tips: LocalTip[];
  };
}

// Tipos para API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AirbnbScrapeResponse {
  success: boolean;
  data?: {
    spaceName: string;
    description: string;
    address?: string;
    photos: string[];
    rules: string[];
    amenities: string[];
    type: 'quarto' | 'espaco-inteiro';
  };
  airbnbLink?: string;
  error?: string;
}

