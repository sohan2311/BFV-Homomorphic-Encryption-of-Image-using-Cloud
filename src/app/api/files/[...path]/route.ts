import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { path: pathSegments } = await context.params;
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

        // Admin has access to all files
        if (user.role === 'ADMIN') {
            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bfv-uploads/${filePath}`;
            return NextResponse.redirect(publicUrl);
        }

        // Sender cannot access raw image anymore
        if (task.senderId === user.userId) {
            return NextResponse.json({ error: 'Forbidden. Senders cannot download files once submitted.' }, { status: 403 });
        }

        // Receiver can only access the processed .mem file (and cipher key technically doesn't go through here)
        if (task.receiverId === user.userId) {
            if (task.memFileUrl === filePath) {
                const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bfv-uploads/${filePath}`;
                return NextResponse.redirect(publicUrl);
            } else {
                return NextResponse.json({ error: 'Forbidden. You do not have permission to view the original uploaded image.' }, { status: 403 });
            }
        }

        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } catch (error) {
        console.error('File serve error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
