export interface StyleOption {
  label: string;
  value: string;
  imageSrc?: string;
}

export interface CountOption {
  label: string;
  value: number;
}

export interface FormContent {
  prompt_client: string;
  components: {
    style: string;
    palette: string;
    expression: string;
    base: string;
    accessory: string;
    primary_color: string;
    secondary_color: string;
    actions: string;
  };
}

export interface CommonFeatures {
  id: string;
  name: string;
  urlImage: string;
}

export interface ImageDetails {
  uid: string;
  slug: string;
  created_at: string;
  updated_at: string;
  alt: string;
  title: string;
  order: number;
  type: string;
  image: string;
  registered_by: string;
}

export interface UserDetails {
  uid: string | null;
  is_active: boolean | null;
  email: string | null;
  username: string | null;
  is_premium: boolean | null;
  is_staff: number | null;
  is_superuser: number | null;
  day_expense: number | null;
  daily_spending_limit: number | null;
  spending: number | null;
  count_emote: number | null;
  count_emote_image: number | null;
}