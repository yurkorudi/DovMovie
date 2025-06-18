import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sortByOrder } from '@/lib/sort/data';

export const GET = async () => {
	try {
		const data = await db.about.findMany();

		return NextResponse.json(sortByOrder(data), { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 },
		);
	}
};

export const dynamic = 'force-dynamic';
