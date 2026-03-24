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

        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.userId };

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { name: true, email: true },
                },
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

        if (!file) {
            return NextResponse.json(
                { error: 'Image file is required' },
                { status: 400 }
            );
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

        // Create unique filename
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

        // Create task in database
        const task = await prisma.task.create({
            data: {
                userId: user.userId,
                originalImageUrl: `images/${fileName}`,
                originalFileName: file.name,
                status: 'PENDING',
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
