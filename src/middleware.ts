import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin sub-routes (not /admin itself which is the login page)
  const isAdminSubRoute = pathname.startsWith("/admin/");

  if (!isAdminSubRoute) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, block access entirely
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder-project")
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // No valid session → redirect to login page
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Optional: enforce single-admin email whitelist via ADMIN_EMAIL env var
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && session.user.email !== adminEmail) {
    // Valid Supabase session but wrong email — block and redirect
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL("/admin?error=unauthorized", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path+"],
};
