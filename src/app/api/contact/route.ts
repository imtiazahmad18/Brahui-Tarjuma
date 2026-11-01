import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function configured() {
  return (
    supabaseUrl &&
    !supabaseUrl.includes("placeholder-project") &&
    supabaseAnonKey &&
    !supabaseAnonKey.includes("placeholder-anon-key")
  );
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, message } = (payload ?? {}) as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return NextResponse.json(
      { error: "Name, email and message are all required." },
      { status: 400 }
    );
  }
  if (!isEmail(cleanEmail)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (cleanName.length > 200 || cleanEmail.length > 320 || cleanMessage.length > 5000) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }

  if (!configured()) {
    return NextResponse.json(
      { error: "Message service is not configured on the server." },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  let insertError: { message: string; code?: string } | null = null;
  try {
    const { error } = await supabase.from("contact_messages").insert({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });
    insertError = error;
  } catch (error) {
    console.error("Supabase contact_messages request failed:", error);
    return NextResponse.json(
      { error: "The site cannot reach Supabase. Check the Supabase Project URL in .env.local, then restart the website." },
      { status: 503 }
    );
  }

  if (insertError) {
    console.error("contact_messages insert failed:", insertError.code, insertError.message);
    return NextResponse.json(
      { error: insertError.code === "42P01"
        ? "The contact message table is missing. Run supabase-schema.sql in your Supabase SQL Editor."
        : "Could not save your message. Check that contact_messages is set up in Supabase, then try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
