"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Link as LinkIcon,
  Loader2,
  LockKeyhole,
  RotateCw,
} from "lucide-react";
import { supabase, type Post } from "@/lib/supabase";
import { DEMO_KEY, initialPosts } from "@/lib/demo";
import { canShare, clampMessage, mergePosts } from "@/lib/posts";
import PostCard from "./PostCard";
import { profile } from "@/lib/profile";

export default function WallFeed({ query }: { query: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState<string>(profile.name);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [connection, setConnection] = useState("Connecting…");
  const [filter, setFilter] = useState("Everyone");
  const [attachment, setAttachment] = useState<"Photo" | "Link" | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [notice, setNotice] = useState("");
  const submittingRef = useRef(false);
  const live = useRef(true);
  const latestRequest = useRef(0);
  const loadPosts = useCallback(async () => {
    if (!supabase) return;
    const request = ++latestRequest.current;
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(50);
      if (!live.current || request !== latestRequest.current) return;
      if (error) throw error;
      // Merge rather than replace: an INSERT can arrive while this request is in flight.
      setPosts((previous) => mergePosts(previous, data as Post[]));
      setError("");
    } catch {
      if (live.current && request === latestRequest.current)
        setError(
          "Could not load the Wall. Check your connection and try again.",
        );
    } finally {
      if (live.current && request === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    live.current = true;
    if (!supabase) {
      function readPreview() {
        try {
          const stored = localStorage.getItem(DEMO_KEY);
          const data: Post[] = stored ? JSON.parse(stored) : initialPosts();
          if (!Array.isArray(data)) throw new Error("Invalid preview");
          const valid = data.filter(
            (post) =>
              post &&
              typeof post.id === "string" &&
              typeof post.body === "string" &&
              typeof post.author_name === "string" &&
              Number.isFinite(Date.parse(post.created_at)),
          );
          setPosts(mergePosts([], valid));
          if (!stored) localStorage.setItem(DEMO_KEY, JSON.stringify(valid));
        } catch {
          setPosts(initialPosts());
          setError(
            "Browser storage is unavailable. Preview posts cannot be saved.",
          );
        }
        setLoading(false);
      }
      readPreview();
      const storage = (event: StorageEvent) => {
        if (event.key === DEMO_KEY) readPreview();
      };
      window.addEventListener("storage", storage);
      setConnection("Local preview");
      return () => {
        live.current = false;
        window.removeEventListener("storage", storage);
      };
    }
    void loadPosts();
    const channel = supabase
      .channel("wall-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          if (live.current)
            setPosts((previous) => mergePosts(previous, [payload.new as Post]));
        },
      )
      .subscribe((status) => {
        if (!live.current) return;
        if (status === "SUBSCRIBED") {
          setConnection("Live updates on");
          void loadPosts();
        } else if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        )
          setConnection("Reconnecting…");
      });
    const refresh = () => {
      if (document.visibilityState === "visible") void loadPosts();
    };
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      live.current = false;
      // Invalidate requests here, rather than capturing their earlier sequence.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      latestRequest.current++;
      void supabase?.removeChannel(channel);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loadPosts]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canShare(message, submittingRef.current)) return;
    if (imageUrl && !/^https:\/\//i.test(imageUrl)) {
      setError("Use an HTTPS address for your photo.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const values = {
        body: message.trim(),
        author_name: authorName.trim() || "Anonymous Friend",
        image_url: attachment === "Photo" && imageUrl ? imageUrl : null,
      };
      let post: Post;
      if (supabase) {
        const { data, error } = await supabase
          .from("posts")
          .insert(values)
          .select()
          .single();
        if (error) throw error;
        post = data as Post;
      } else {
        post = {
          ...values,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        const stored: Post[] = JSON.parse(
          localStorage.getItem(DEMO_KEY) || "[]",
        );
        localStorage.setItem(
          DEMO_KEY,
          JSON.stringify(mergePosts(stored, [post])),
        );
      }
      if (!live.current) return;
      setPosts((previous) => mergePosts(previous, [post]));
      setMessage("");
      setImageUrl("");
      setAttachment(null);
      setNotice(
        supabase
          ? "Your post was shared."
          : "Your post was saved in this browser.",
      );
    } catch {
      if (live.current)
        setError(
          "Your post could not be shared. Your message is still here. Please try again.",
        );
    } finally {
      submittingRef.current = false;
      if (live.current) setSubmitting(false);
    }
  }
  const remaining = 280 - Array.from(message).length;
  const visible = posts.filter(
    (post) =>
      (filter !== `Just ${profile.firstName}` ||
        post.author_name === profile.name) &&
      `${post.body} ${post.author_name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  return (
    <section aria-label="Wall posts">
      <form className="composer" onSubmit={submit}>
        <div className="composer-title">
          <strong>Write on the wall</strong>
        </div>
        <div className="composer-fields">
          <label className="author-field">
            Posting as{" "}
            <input
              aria-label="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={80}
            />
          </label>
          <label className="sr-only" htmlFor="message">
            Write on the Wall
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="What’s on your mind?"
            value={message}
            onChange={(e) => {
              setMessage(clampMessage(e.target.value));
              setNotice("");
            }}
            aria-describedby="characters"
          />
          {attachment === "Photo" && (
            <label className="attachment-input">
              Photo address
              <input
                type="url"
                placeholder="https://…"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
          )}
          {attachment === "Link" && (
            <p className="attachment-help">
              <LinkIcon size={12} /> Paste your link into your message to share
              it.
            </p>
          )}
        </div>
        <div className="composer-bottom">
          <div className="attach">
            <span>Attach:</span>
            <button
              type="button"
              title="Attach a photo"
              aria-label="Attach a photo"
              aria-pressed={attachment === "Photo"}
              onClick={() =>
                setAttachment(attachment === "Photo" ? null : "Photo")
              }
            >
              <ImagePlus size={17} />
            </button>
            <button
              type="button"
              title="Share a link"
              aria-label="Share a link"
              aria-pressed={attachment === "Link"}
              onClick={() =>
                setAttachment(attachment === "Link" ? null : "Link")
              }
            >
              <LinkIcon size={16} />
            </button>
          </div>
          <span
            id="characters"
            className={`character-count ${remaining < 20 ? "low" : ""}`}
            aria-live="polite"
          >
            {remaining}
            <span> characters remaining</span>
          </span>
          <button
            className="share-button"
            disabled={!canShare(message, submitting)}
          >
            {submitting && <Loader2 size={12} className="animate-spin" />}
            {submitting ? "Sharing…" : "Share"}
          </button>
        </div>
      </form>
      <div className="privacy-note">
        <LockKeyhole size={11} />
        <span>
          {supabase
            ? "Anyone can see and write on this Wall."
            : "Local preview · Posts are saved only in this browser."}
        </span>
      </div>
      {notice && (
        <p className="success-note" role="status">
          {notice}
        </p>
      )}
      {error && (
        <div className="error-note" role="alert">
          {error}{" "}
          {supabase && (
            <button onClick={() => void loadPosts()}>Try again</button>
          )}
        </div>
      )}
      <div className="feed-toolbar">
        <div>
          <strong>Posts</strong>
          <span className="feed-divider">/</span>
          {["Everyone", `Just ${profile.firstName}`].map((label) => (
            <button
              className={filter === label ? "selected-filter" : ""}
              key={label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="connection">
          <i className={connection === "Live updates on" ? "connected" : ""} />
          {connection}
        </span>
      </div>
      {query && <p className="search-result">Results for “{query}”</p>}
      <div aria-busy={loading}>
        {loading ? (
          <p className="empty-state">
            <Loader2 size={16} className="animate-spin" /> Loading Wall posts…
          </p>
        ) : visible.length ? (
          visible.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="empty-state">
            {query
              ? "No posts match your search."
              : "No posts yet. Write something to get the conversation started."}
          </p>
        )}
      </div>
      {!loading && visible.length > 0 && (
        <div className="end-feed">
          <span>You’re all caught up.</span>
          <button
            onClick={() => {
              if (supabase) void loadPosts();
              else setNotice("Your local Wall is up to date.");
            }}
          >
            <RotateCw size={11} /> Refresh Wall
          </button>
        </div>
      )}
    </section>
  );
}
