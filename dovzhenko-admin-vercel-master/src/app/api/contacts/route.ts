import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
	const data = await db.contacts.findFirst();

	return NextResponse.json(data, { status: 200 });
};

export const dynamic = 'force-dynamic';
