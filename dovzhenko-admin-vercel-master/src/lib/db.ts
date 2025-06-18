import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient;
}

// This line exists to avoid reinitializing PrismaClient in development on hot reload
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalThis.prisma = db;
}
