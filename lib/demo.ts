import type { Post } from "./supabase";

export const DEMO_KEY = "facebook-wall-preview-v1";
export function initialPosts(): Post[] {
  const now = Date.now();
  return [
    {
      id: "demo-1",
      author_name: "Alex Morgan",
      body: "is bringing back the good old days. No algorithms, no endless scrolling. Just a wall and a few good friends. :)",
      created_at: new Date(now - 12 * 60000).toISOString(),
    },
    {
      id: "demo-2",
      author_name: "Sarah Chen",
      body: "Found this from our weekend in Big Sur. Can we go back already? 🌊",
      image_url: "/coast.jpg",
      created_at: new Date(now - 48 * 60000).toISOString(),
    },
    {
      id: "demo-3",
      author_name: "James Wilson",
      body: "Anyone up for coffee at Philz tomorrow? The next big idea always starts with a good cup of coffee.",
      created_at: new Date(now - 2 * 3600000).toISOString(),
    },
    {
      id: "demo-4",
      author_name: "Emily Parker",
      body: "just joined the Palo Alto network. This place is starting to feel like home.",
      created_at: new Date(now - 4 * 3600000).toISOString(),
    },
    {
      id: "demo-5",
      author_name: "Michael Davis",
      body: "Made a playlist for the road trip. Yes, there is a lot of Coldplay. No, I will not be taking questions.",
      created_at: new Date(now - 7 * 3600000).toISOString(),
    },
  ];
}
