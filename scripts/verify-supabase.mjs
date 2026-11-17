import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key)
  throw new Error("Load .env.local before running this integration check.");
const writer = createClient(url, key, { auth: { persistSession: false } });
const reader = createClient(url, key, { auth: { persistSession: false } });
const body = `Supabase verification: persistent posts and live updates are working. ${new Date().toISOString()}`;
let timer;
const channel = reader.channel(`wall-verification-${Date.now()}`);

try {
  const received = new Promise((resolve, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new Error("Realtime INSERT was not delivered within 20 seconds."),
        ),
      20000,
    );
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => {
        if (payload.new.body === body) resolve(payload.new);
      },
    );
  });
  // Attach the rejection handler before performing any network operations.
  const realtimeResult = received.then(
    (post) => ({ post }),
    (error) => ({ error }),
  );
  await new Promise((resolve, reject) =>
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") resolve();
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        reject(new Error(`Realtime subscription failed: ${status}`));
    }),
  );

  const { data: post, error } = await writer
    .from("posts")
    .insert({ author_name: "Wall verification", body })
    .select()
    .single();
  if (error) throw error;
  const result = await realtimeResult;
  if (result.error) throw result.error;
  if (result.post.id !== post.id)
    throw new Error("Realtime delivered the wrong post.");
  const { data: stored, error: readError } = await reader
    .from("posts")
    .select("*")
    .eq("id", post.id)
    .single();
  if (readError || stored?.body !== body)
    throw readError || new Error("Persistent read failed.");

  for (const invalidBody of ["x".repeat(281), "   "]) {
    const { error: invalidError } = await writer
      .from("posts")
      .insert({ body: invalidBody });
    if (invalidError?.code !== "23514")
      throw new Error("Database did not reject invalid body.");
  }
  const { error: timestampError } = await writer
    .from("posts")
    .insert({
      body: "Timestamp permission check",
      created_at: "2099-01-01T00:00:00Z",
    });
  if (timestampError?.code !== "42501")
    throw new Error("Anonymous clients can override timestamps.");
  console.log(
    JSON.stringify({
      insert: "passed",
      independentRead: "passed",
      realtimeInsert: "passed",
      lengthAndWhitespaceConstraints: "passed",
      timestampProtection: "passed",
      verificationPostId: post.id,
    }),
  );
} finally {
  clearTimeout(timer);
  await reader.removeChannel(channel);
  reader.realtime.disconnect();
  writer.realtime.disconnect();
}
