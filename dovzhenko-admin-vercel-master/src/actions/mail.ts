'use server';

import { db } from '@/lib/db';

export const getMessages = async () => {
	const messages = await db.message.findMany({
		orderBy: { createdAt: 'desc' },
	});

	return messages;
};
