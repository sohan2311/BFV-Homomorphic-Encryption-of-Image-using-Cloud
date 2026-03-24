import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const formData = await request.formData();
        const memFile = formData.get('memFile') as File | null;
        const cipherKey = formData.get('cipherKey') as string | null;

        if (!memFile && !cipherKey) {
            return NextResponse.json(
                { error: 'At least a .mem file or cipher key is required' },
                { status: 400 }
            );
        }

        let memFileUrl: string | null = task.memFileUrl;

        if (memFile) {
            const ext = path.extname(memFile.name) || '.mem';
            const uniqueId = uuidv4();
            const fileName = `${uniqueId}${ext}`;

            const bytes = await memFile.arrayBuffer();
            const buffer = new Uint8Array(bytes);

            const { error: storageError } = await supabase.storage
                .from('bfv-uploads')
                .upload(`mem/${fileName}`, buffer, {
                    contentType: 'application/octet-stream',
                    upsert: false
                });

            if (storageError) {
                throw new Error(`Storage upload failed: ${storageError.message}`);
            }

            memFileUrl = `mem/${fileName}`;
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                memFileUrl,
                cipherKey: cipherKey || task.cipherKey,
                status: 'PROCESSED',
            },
        });

        return NextResponse.json({
            message: 'Task fulfilled successfully',
            task: updatedTask,
        });
    } catch (error) {
        console.error('Fulfill error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
