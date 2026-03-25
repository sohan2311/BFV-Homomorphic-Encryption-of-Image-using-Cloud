import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ users: [] });
        }

        // Search users by name or email, excluding the requesting user and ADMINs
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                    { id: { not: user.userId } },
                    { role: { not: 'ADMIN' } },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            take: 5, // Limit results
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Users search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
