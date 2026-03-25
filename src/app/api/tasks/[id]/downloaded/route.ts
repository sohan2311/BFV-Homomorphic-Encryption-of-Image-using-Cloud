import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: taskId } = await context.params;

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Only the receiver can mark it as downloaded
        if (task.receiverId !== user.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Proceed if status is PROCESSED_READY
        if (task.status === 'PROCESSED_READY') {
            const updatedTask = await prisma.task.update({
                where: { id: taskId },
                data: {
                    status: 'DOWNLOADED',
                },
            });
            return NextResponse.json({ message: 'Task marked as downloaded', task: updatedTask });
        } else if (task.status === 'DOWNLOADED') {
            return NextResponse.json({ message: 'Task already downloaded', task });
        } else {
            return NextResponse.json({ error: 'Task is not ready to be downloaded' }, { status: 400 });
        }
    } catch (error) {
        console.error('Mark downloaded error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
