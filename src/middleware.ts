import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-change-me'
);

const publicPaths = ['/', '/login', '/admin/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (publicPaths.some((p) => pathname === p)) {
        return NextResponse.next();
    }

    // Allow static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Get token from cookie
    const token = request.cookies.get('bfv-auth-token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;

        // Admin routes require ADMIN role
        if (pathname.startsWith('/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/user/upload', request.url));
        }

        // User routes — both ADMIN and USER can access
        if (pathname.startsWith('/user') && role !== 'USER' && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Admin-only API routes
        if (pathname.includes('/api/tasks') && pathname.includes('/fulfill') && role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.next();
    } catch {
        // Invalid token
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('bfv-auth-token');
        return response;
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
