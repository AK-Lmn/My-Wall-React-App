import { createClient } from "@supabase/supabase-js";

export interface Post {
  id: string;
  author_name: string;
  body: string;
  image_url?: string | null;
  created_at: string;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Missing credentials enable the explicitly labeled, browser-local preview.
export const supabase = url && key ? createClient(url, key) : null;
