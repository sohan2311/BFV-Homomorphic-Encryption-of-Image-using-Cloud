import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Admin sees all tasks.
        // Users see tasks they sent OR tasks they received.
        const whereClause = user.role === 'ADMIN'
            ? {}
            : {
                OR: [
                    { senderId: user.userId },
                    { receiverId: user.userId }
                ]
            };

        const tasks = await prisma.task.findMany({
            // @ts-ignore
            where: whereClause,
            include: {
                sender: { select: { name: true, email: true } },
                receiver: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Tasks fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('image') as File | null;
        const receiverEmail = formData.get('receiverEmail') as string | null;

        if (!file) {
            return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
        }

        if (!receiverEmail) {
            return NextResponse.json({ error: 'Receiver email is required' }, { status: 400 });
        }

        // Validate receiver
        const receiver = await prisma.user.findUnique({
            where: { email: receiverEmail }
        });

        if (!receiver) {
            return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
        }

        if (receiver.id === user.userId) {
            return NextResponse.json({ error: 'Cannot send files to yourself' }, { status: 400 });
        }

        if (receiver.role === 'ADMIN') {
            return NextResponse.json({ error: 'Cannot send files to Admin accounts' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Only PNG and JPG images are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 10MB' },
                { status: 400 }
            );
        }

        // Create unique filename based on UUID
        const ext = path.extname(file.name);
        const uniqueId = uuidv4();
        const fileName = `${uniqueId}${ext}`;

        // Save file to Supabase Storage
        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        const { error: storageError } = await supabase.storage
            .from('bfv-uploads')
            .upload(`images/${fileName}`, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (storageError) {
            throw new Error(`Storage upload failed: ${storageError.message}`);
        }

        // Create task in database with sender and receiver
        const task = await prisma.task.create({
            data: {
                senderId: user.userId,
                receiverId: receiver.id,
                originalImageUrl: `images/${fileName}`,
                status: 'PENDING_ADMIN',
            },
        });

        return NextResponse.json(
            { message: 'Image uploaded successfully', task },
            { status: 201 }
        );
    } catch (error) {
        console.error('Task creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
