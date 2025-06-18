import { db } from '@/lib/db';

/*
 * This function is used to interact with the user table in the database.
 * It is used to get a user by their email.
 */
export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({ where: { email } });

		return user;
	} catch (e) {
		console.log('Error getting user by email: ', e);

		return null;
	}
};

/*
 * This function is used to interact with the user table in the database.
 * It is used to get a user by their id.
 */
export const getUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({ where: { id } });

		return user;
	} catch (e) {
		console.log('Error getting user by id: ', e);

		return null;
	}
};
