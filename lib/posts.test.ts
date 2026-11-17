import { describe, expect, it } from "vitest";
import { canShare, clampMessage, mergePosts } from "./posts";

describe("composer boundaries", () => {
  it("rejects whitespace, long messages, and duplicate submissions", () => {
    expect(canShare("  \n")).toBe(false);
    expect(canShare("a".repeat(281))).toBe(false);
    expect(canShare("hello", true)).toBe(false);
    expect(canShare("a".repeat(280))).toBe(true);
  });
  it("truncates pasted text at 280 without splitting emoji", () => {
    expect(Array.from(clampMessage("😀".repeat(281)))).toHaveLength(280);
    expect(clampMessage("a".repeat(281))).toHaveLength(280);
  });
});

describe("realtime feed reconciliation", () => {
  it("deduplicates inserts and preserves timestamp order when events arrive out of order", () => {
    const post = (id: string, created_at: string) => ({
      id,
      created_at,
      author_name: "Friend",
      body: "Hello",
    });
    const older = post("old", "2026-01-01T00:00:00Z");
    const newer = post("new", "2026-01-02T00:00:00Z");
    expect(mergePosts([newer], [older, newer]).map((p) => p.id)).toEqual([
      "new",
      "old",
    ]);
  });
  it("keeps the newest 50 posts", () => {
    const posts = Array.from({ length: 60 }, (_, i) => ({
      id: String(i),
      author_name: "Friend",
      body: "Hi",
      created_at: new Date(i * 1000).toISOString(),
    }));
    expect(mergePosts([], posts)).toHaveLength(50);
    expect(mergePosts([], posts)[0].id).toBe("59");
  });
});
