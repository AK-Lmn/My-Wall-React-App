"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare } from "lucide-react";
import type { Post } from "@/lib/supabase";

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/#post-${post.id}`,
      );
      setCopied(true);
    } catch {
      setShareError("Copy the page address to share this Wall.");
    }
  }
  return (
    <article className="post" id={`post-${post.id}`}>
      <div className="post-content">
        <div className="post-heading">
          <strong>{post.author_name}</strong>
          <time
            dateTime={post.created_at}
            title={new Date(post.created_at).toLocaleString()}
          >
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </time>
        </div>
        <p className="post-body">{post.body}</p>
        {post.image_url && (
          <a
            className="post-photo"
            href={post.image_url}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              unoptimized
              width={900}
              height={600}
              src={post.image_url}
              alt={`Photo shared by ${post.author_name}`}
            />
          </a>
        )}
        <div className="post-meta">
          <button aria-pressed={liked} onClick={() => setLiked(!liked)}>
            {liked ? "Unlike" : "Like"}
          </button>
          <span>·</span>
          <button onClick={() => setCommenting(!commenting)}>Comment</button>
          <span>·</span>
          <button onClick={share}>{copied ? "Link copied" : "Share"}</button>
        </div>
        {shareError && (
          <p role="status" className="muted">
            {shareError}
          </p>
        )}
        {(liked || comments.length > 0 || commenting) && (
          <div className="post-responses">
            <small className="muted">
              Preview reactions and comments stay in this view.
            </small>
            {liked && (
              <div className="like-note">
                <ThumbsUp size={12} /> You like this.
              </div>
            )}
            {comments.map((text, i) => (
              <p className="comment" key={i}>
                <strong className="blue">You</strong> {text}
              </p>
            ))}
            {commenting && (
              <form
                className="comment-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (comment.trim()) {
                    setComments([...comments, comment.trim()]);
                    setComment("");
                  }
                }}
              >
                <MessageSquare size={14} />
                <input
                  aria-label="Write a comment"
                  placeholder="Write a comment..."
                  value={comment}
                  maxLength={280}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="blue" disabled={!comment.trim()}>
                  Post
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
