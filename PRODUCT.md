# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

A Facebook-style Wall for visitors to write short messages and see them in a newest-first feed. The user is building the Wall coding challenge referenced in the supplied Notion page.

## Capabilities and Constraints

Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase. Messages are capped at 280 Unicode code points. Empty messages and duplicate submissions are blocked. The live deployment stores posts in the `my-wall` Supabase project (`hlnxqwehwsqejapvuljc`) in the `tenen` organization, Singapore region. Public SELECT/INSERT policies and Realtime INSERT events are enabled. Public clients cannot edit/delete posts or override timestamps. Browser-local preview storage remains available when environment variables are absent.

## Brand Commitments

The user requested a redesign using the Notion challenge as reference, then delegated visual decisions: “Just use your own design skills.” The chosen reference has a blue wall wordmark, large profile image, two-column composition, generous composer, and simple separated feed rows. No connection to a real Facebook account is implied.

## Evidence on Hand

Reference: https://tremendous-tiger-a4a.notion.site/Test-2-My-Wall-React-App-22300bbdfc3b804491bbf6d7f2481cd8
Reference screenshots: `.impeccable/references/reference-0.png` (sketch), `reference-1.png` (clean application example).
The profile belongs to Kim Lamano. Confirmed details: Muntinlupa City, Philippines; Lyceum of Alabang; programming, Roblox, Genshin Impact, aespa, Cigarettes After Sex, and badminton. The user supplied the portrait at `public/kim-lamano.jpg` and delegated bio wording. Shared profile values live in `lib/profile.ts`. Do not invent a birthday, degree, graduation year, or travel history. Existing posts retain their original authors. The Supabase plugin configured project credentials locally and on Vercel; only a publishable key is used in the browser.

The user requested additional photos from online sources. `lib/photos.ts` records the four Unsplash interest images, photographers, and source URLs. The gallery labels sourced images as inspiration and keeps the supplied portrait identified as personal.
