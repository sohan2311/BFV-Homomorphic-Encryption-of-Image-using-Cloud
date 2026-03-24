import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { path: pathSegments } = await params;
        const filePath = pathSegments.join('/');

        // Verify the user has access to this file
        // Find the task that references this file
        const task = await prisma.task.findFirst({
            where: {
                OR: [
                    { originalImageUrl: filePath },
                    { memFileUrl: filePath },
                ],
            },
        });

        if (!task) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Check ownership — users can only access their own files
        if (user.role !== 'ADMIN' && task.userId !== user.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bfv-uploads/${filePath}`;
        
        return NextResponse.redirect(publicUrl);
    } catch (error) {
        console.error('File serve error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
