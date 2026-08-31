import { isLoginEnabled } from "@/lib/auth/config";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function nextWithRequest(request: NextRequest) {
  return NextResponse.next({ request });
}

export async function updateSession(request: NextRequest) {
  if (!isLoginEnabled()) {
    return nextWithRequest(request);
  }

  let supabaseResponse = nextWithRequest(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = nextWithRequest(request);
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims verifies the JWT locally (and refreshes only when near expiry).
  // Avoid getUser() here — it round-trips Auth on every navigation.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/auth") || pathname.startsWith("/login");
  const isInviteCompletion =
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/set-password");

  if (user && isAuthRoute && !isInviteCompletion) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
