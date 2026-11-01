import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!supabaseUrl || !supabaseAnonKey || !adminEmail) {
    return pathname === "/admin"
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser validates the access token with Supabase; getSession alone only
  // reads the cookie and is not sufficient for a server-side access check.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return pathname === "/admin" ? response : NextResponse.redirect(new URL("/admin", request.url));
  }

  const isOwner = user.app_metadata?.role === "owner" && user.email?.toLowerCase() === adminEmail;
  if (!isOwner) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
