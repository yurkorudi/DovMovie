import { NextResponse } from 'next/server';
import { sortByGTE, sortByStartTimeByAsc } from '@/lib/sort/data';
import { getAllEvents } from '@/actions/events';

export const GET = async () => {
	const events = await getAllEvents();
	const data = sortByStartTimeByAsc(sortByGTE(events));

	return NextResponse.json(data, { status: 200 });
};

export const dynamic = 'force-dynamic';
