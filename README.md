# My Wall

A Facebook-style Wall built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase. Its redesigned two-column layout follows the supplied Wall challenge reference: a large profile portrait, blue wordmark, spacious composer, and simple newest-first feed.

Live app: https://my-wall-2008.vercel.app. Production is connected to the `my-wall` Supabase project in the `tenen` organization (Singapore). Posts persist in PostgreSQL and arrive through Supabase Realtime. Existing browser-local preview posts are not automatically imported.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Without Supabase environment variables, the app runs a clearly labeled local preview. Sample posts and your new posts persist in browser localStorage and sync between tabs on the same origin. They are not shared between devices. Likes and comments are view-local preview interactions. Profile details and posts contain sample content.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/setup.sql` in the project's SQL Editor. It creates the posts table, timestamp index, public read/insert RLS policies, narrow grants, and Realtime publication membership.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` using the project URL and publishable (or legacy anon) key. Never use a service-role key.
5. Restart the dev server. The status changes to “Live updates on” after a successful subscription.

The composer counts Unicode code points, matching PostgreSQL `char_length`. Pasting text truncates at 280 characters without splitting emoji. New posts are merged by ID and sorted newest first, including events received during initial fetch or reconnection. A successful insert appears immediately even if Realtime delivery is delayed. The feed keeps the newest 50 posts.

## Verify

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

To verify the configured database, run `node --env-file=.env.local scripts/verify-supabase.mjs`. This creates one labeled verification post and checks an independent read, Realtime INSERT delivery, invalid-body rejection, and timestamp permissions.

Open two tabs. Share a post in one and confirm the other updates without refresh. Paste more than 280 characters; the input must stop at 280 and the counter show 0. Empty or whitespace-only input must disable Share. Test failed requests with browser offline mode; the message must remain editable and an error must appear. With Supabase configured, repeat these checks in two independent browser contexts to verify database persistence and `postgres_changes` delivery.

## Deploy to Vercel

Import this repository in Vercel, select Next.js, and add both public Supabase environment variables for Production and Preview. Run a production deployment. `NEXT_PUBLIC_` values are embedded at build time, so changing them requires a new deployment. No environment variables are required to deploy the local preview.

## Public posting model

The requested RLS policies intentionally allow anyone to read and insert posts under any display name. No authentication, identity verification, moderation, or rate limiting is included. Deploying a public production community requires abuse controls appropriate to that audience. Browser clients cannot update/delete posts or set their timestamps using the supplied grants. React escapes post text; attached images accept HTTPS URLs.

This is an independent nostalgic recreation, not an official Facebook product. Kim Lamano supplied the portrait at `public/kim-lamano.jpg`. Profile content lives in `lib/profile.ts`. The coast image and unused original sample portrait are stock photos from Unsplash.

The Photos tab includes four interest images (programming, gaming, badminton, and live music), in addition to Kim's portrait. Image credits and original Unsplash links live in `lib/photos.ts` and appear under each photo. These sourced photos are labeled as inspiration rather than personal memories.
