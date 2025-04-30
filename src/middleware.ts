// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // List of public routes that don't require authentication
// const publicRoutes = [
//   "/",
//   "/login",
//   "/signup",
//   "/api/auth/signin",  
//   "/api/auth/signup",
//   "/api/auth/signout",
//   "/api/website"
  
// ];c

// // List of routes that require authentication
// // If user is not authenticated, they will be redirected to login page
// const authRoutes = [
//   "/dashboard",
//   "/edit",
//   "/home"
// ];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Check if path is a public route
//   const isPublicRoute = publicRoutes.some(route => 
//     pathname.startsWith(route) || pathname === route
//   );
  
//   // Check if path requires authentication
//   const requiresAuth = authRoutes.some(route => 
//     pathname.startsWith(route) || pathname === route
//   );
  
//   // Get the authentication status from cookie or session
//   // For now, this is a simple check - you might want to implement proper token validation
//   const hasAuthCookie = request.cookies.has('auth-token');
//   const isAuthenticated = hasAuthCookie;
  
//   // If route requires auth but user is not authenticated, redirect to login
//   if (requiresAuth && !isAuthenticated) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('redirect', encodeURIComponent(request.url));
//     return NextResponse.redirect(loginUrl);
//   }
  
//   // Continue with the request
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// }; 




import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}