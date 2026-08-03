import { isLoginEnabled } from '@/lib/auth/config'
import { isStaffRole } from '@/lib/auth/roles'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  if (!isLoginEnabled()) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute =
    pathname.startsWith('/auth') || pathname.startsWith('/login')

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!isStaffRole(profile?.role)) {
      await supabase.auth.signOut()

      if (!isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('error', 'staff_only')
        return NextResponse.redirect(url)
      }

      return supabaseResponse
    }

    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
