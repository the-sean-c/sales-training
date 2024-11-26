import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - about (about page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - $ (homepage)
     * - about (about page)
     * - any (anypage)
     */
  '/((?!api|about|any|_next/static|_next/image|favicon.ico|$).*)',
  ],
};
export default withMiddlewareAuthRequired();
