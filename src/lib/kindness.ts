import { supabase } from "@/integrations/supabase/client";

export type KindnessPin = {
  id: string;
  story: string;
  location_name: string;
  author_name: string | null;
  lat: number;
  lng: number;
  source: string;
  created_at: string;
};

export async function fetchPins(): Promise<KindnessPin[]> {
  const { data, error } = await supabase
    .from("kindness_pins")
    .select("id, story, location_name, author_name, lat, lng, source, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) throw error;
  return (data ?? []) as KindnessPin[];
}

export type NewPin = {
  story: string;
  location_name: string;
  author_name?: string | null;
  lat: number;
  lng: number;
};

export async function createPin(pin: NewPin): Promise<KindnessPin> {
  const { data, error } = await supabase
    .from("kindness_pins")
    .insert({
      story: pin.story.trim(),
      location_name: pin.location_name.trim() || "Somewhere on Earth",
      author_name: pin.author_name?.trim() ? pin.author_name.trim() : null,
      lat: pin.lat,
      lng: pin.lng,
      source: "community",
    })
    .select("id, story, location_name, author_name, lat, lng, source, created_at")
    .single();

  if (error) throw error;
  return data as KindnessPin;
}
