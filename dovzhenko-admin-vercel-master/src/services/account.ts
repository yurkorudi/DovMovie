import { db } from '@/lib/db';

export const getAccountByUserId = async (id: string) => {
	// Prisma query to get account by userId
	try {
		// Query to get account by userId
		const account = await db.account.findFirst({
			where: { userId: id },
		});

		return account;
	} catch (e) {
		console.error('Error getting account by userId', e);

		return null;
	}
};
