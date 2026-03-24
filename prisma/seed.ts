import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
    const adminEmail = 'admin@system.local';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('admin123', 12);
        await prisma.user.create({
            data: {
                name: 'System Admin',
                email: adminEmail,
                passwordHash,
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin account created: admin@system.local / admin123');
    } else {
        console.log('ℹ️  Admin account already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
