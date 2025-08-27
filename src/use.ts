

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import jwt from 'jsonwebtoken';
 import { JwtPayload } from 'jsonwebtoken';
const publicRoutes = ['/', '/login', '/api/auth/login']; 
export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;
  console.log("coo------------------",cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
//   const allCookies = request.cookies.getAll()
//   console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]
 
//   request.cookies.has('nextjs') // => true
//   request.cookies.delete('nextjs')
//   request.cookies.has('nextjs') // => false
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next()
try {
  const token = cookie
  console.log("token bdav",token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log('Decoded JWT in middleware:', decoded);

    // If the token is valid, allow the request to proceed.
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token in middleware:', error);

    // If the token is invalid, delete the expired cookie and redirect.
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

//   response.cookies.set('vercel', 'fast')
//   response.cookies.set({
//     name: 'vercel',
//     value: 'fast',
//     path: '/',
//   })
//   cookie = response.cookies.get('vercel')
//   console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.
 
  // return response
}


// // export async function getSession() {
  
// //   const cookieStore = await cookies();
// //   const token = cookieStore.get("session")?.value;

// //   if (!token) return null;

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET!)  as JwtPayload;
// //     // console.log('decoded obj',decoded)
// //     return decoded; // { id, email, iat, exp }
// //   } catch (error) {
// //     console.error("Invalid token:", error);
// //     return null;
// //   }
// // }


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import jwt, { JwtPayload } from 'jsonwebtoken';

// // It's a good practice to define which routes the middleware should apply to.
// // This example protects /dashboard and any nested routes.
// const protectedRoutes = ['/dashboard'];
// const publicRoutes = ['/', '/login', '/api/auth/login']; // Add your public routes

// export async function middleware(request: NextRequest) {
//   // Get the token from the incoming request's cookies
//   const token = request.cookies.get('session')?.value;
//   const { pathname } = request.nextUrl;

//   console.log('Middleware cookie value:', token);

//   // If the user is on a public route, allow the request to proceed.
//   if (publicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // If there is no token, redirect to the login page.
//   if (!token) {
//     const url = new URL('/auth/login', request.url);
//     url.searchParams.set('redirect', pathname); // Optional: add a redirect URL
//     return NextResponse.redirect(url);
//   }

//   // Verify the token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     console.log('Decoded JWT in middleware:', decoded);

//     // If the token is valid, allow the request to proceed.
//     return NextResponse.next();
//   } catch (error) {
//     console.error('Invalid token in middleware:', error);

//     // If the token is invalid, delete the expired cookie and redirect.
//     const response = NextResponse.redirect(new URL('/auth/login', request.url));
//     response.cookies.delete('session');
//     return response;
//   }
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };
