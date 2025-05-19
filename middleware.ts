import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { nextUrl } = req;

  // Skip auth for certain API routes
  if (
    nextUrl.pathname.startsWith('/api/uploadthing') ||
    nextUrl.pathname.startsWith('/api/groups')
  ) {
    return;
  }

  // Protect all routes except the public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Protect all routes except static files and Next.js internals
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
