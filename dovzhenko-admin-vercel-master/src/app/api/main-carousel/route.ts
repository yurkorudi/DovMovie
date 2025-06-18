import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sortByOrder } from '@/lib/sort/data';
import { getGTEStartTime } from '@/lib/utils';

export const GET = async () => {
	const data = await db.mainCarousel.findMany({
		where: {
			startTime: {
				gte: getGTEStartTime(),
			},
		},
	});

	return NextResponse.json(sortByOrder(data), { status: 200 });
};

export const dynamic = 'force-dynamic';
