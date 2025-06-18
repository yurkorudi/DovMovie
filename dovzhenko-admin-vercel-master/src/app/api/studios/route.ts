import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sortByOrder } from '@/lib/sort/data';

export const GET = async () => {
	const data = await db.studio.findMany();

	return NextResponse.json(sortByOrder(data), { status: 200 });
};

export const dynamic = 'force-dynamic';
