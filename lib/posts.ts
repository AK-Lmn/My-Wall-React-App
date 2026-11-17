import type { Post } from "./supabase";

export function canShare(message: string, submitting = false): boolean {
  return (
    !submitting &&
    message.trim().length > 0 &&
    Array.from(message).length <= 280
  );
}
export function clampMessage(message: string): string {
  return Array.from(message).slice(0, 280).join("");
}
export function mergePosts(previous: Post[], incoming: Post[]): Post[] {
  const posts = new Map(
    [...previous, ...incoming].map((post) => [post.id, post]),
  );
  return [...posts.values()]
    .sort(
      (a, b) =>
        Date.parse(b.created_at) - Date.parse(a.created_at) ||
        b.id.localeCompare(a.id),
    )
    .slice(0, 50);
}
