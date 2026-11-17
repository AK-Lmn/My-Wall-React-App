# Wall surface

Mode: Operate. Code-first redesign; the user delegated visual decisions after supplying the Wall challenge reference.

The visitor's primary task is writing a short message and seeing it appear first. The reference's useful structure is a large profile portrait, a blue wordmark, a wide composer, and simple feed rows. Use Kim Lamano's confirmed profile details and supplied portrait through `lib/profile.ts`. Preserve existing posts with their original authors. Keep the 280-character cap, disabled/submitting states, failed-draft retention, browser-local preview notice, filtering, attachments, and Supabase integration.

Use the implemented blue/white palette and restrained two-column frame. At phone widths, compact the portrait and identity above a horizontal tab row; the composer and feed occupy the full width. A post's author, message, timestamp, and actions must stay distinct. Do not add unrelated dashboards, friend promotions, decorative statistics, or a third content column.

Required verification: desktop and 390px phone screenshots, no horizontal overflow, composer boundary tests, posting, tab switching, and public Vercel URL. Supabase is now connected; persistent reads after refresh and Realtime delivery to a second browser tab were verified on the public deployment.
