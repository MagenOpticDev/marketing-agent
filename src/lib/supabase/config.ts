// Supabase project URL and anon key.
//
// These are PUBLIC values — the anon key is designed to be shipped in client
// code and is protected by row-level security. They are provided here as
// fallbacks so the app works even when the NEXT_PUBLIC_* env vars are not
// configured on the host (e.g. a misconfigured Vercel project). Env vars,
// when present, still take precedence.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://sarsnicvawvfurxapyui.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcnNuaWN2YXd2ZnVyeGFweXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzA4MDMsImV4cCI6MjA5Njc0NjgwM30.JXeybL1rNG4WlfNJ7YPErGmo3mI3jIpEBkFE8PKr8n8";
