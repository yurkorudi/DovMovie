import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import {
	API_ROUTES,
	authRoutes,
	DEFAULT_REDIRECT,
	publicApiRoutes,
	publicRoutes,
} from '@/routes';
import { NextResponse } from 'next/server';
export const { auth } = NextAuth(authConfig);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const requestHeaders = new Headers(req.headers);
	requestHeaders.set('x-url', nextUrl.pathname);
	requestHeaders.set('x-search', nextUrl.search);

	const isApiAuthRoute = nextUrl.pathname.startsWith(API_ROUTES.AUTH);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	const isPublicApiRoute = (publicApiRoutes as string[]).includes(
		nextUrl.pathname,
	);

	// Allow public API routes
	if (isPublicApiRoute || isApiAuthRoute) {
		return null;
	}

	// Authentication pages
	if (isAuthRoute) {
		// The way to create an absolute url
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
		}

		return null;
	}

	if (!isLoggedIn && !isPublicRoute) {
		// Redirect to previous page after login
		let callbackUrl = nextUrl.pathname;

		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return Response.redirect(
			new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
		);
	}

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
});

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: [
		// Exclude files with a "." followed by an extension, which are typically static files.
		// Exclude files in the _next directory, which are Next.js internals.

		'/((?!.+\\.[\\w]+$|_next).*)',
		// Re-include any files in the api or trpc folders that might have an extension
		'/(api|trpc)(.*)',
	],
};
