import NextAuth from 'next-auth';
import AuthConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById } from '@/services/user';
import { UserRole } from '.prisma/client';
import { getTwoFactorConfirmationByUserId } from '@/services/two-factor-confirmation';
import { getAccountByUserId } from '@/services/account';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	events: {
		linkAccount: async ({ user }) => {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			// Allow OAuth with email verification
			if (account?.provider !== 'credentials') return true;

			// Block auth by api if email is not verified
			const existingUser = await getUserById(user.id!);
			if (!existingUser?.emailVerified) return false;

			if (existingUser?.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					user.id!,
				);

				if (!twoFactorConfirmation) return false;

				// Delete two factor confirmation
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		jwt: async ({ token }) => {
			if (!token.sub) return token;
			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.role = existingUser?.role;
			token.isTwoFactorEnabled = existingUser?.isTwoFactorEnabled;
			token.name = existingUser?.name;
			token.email = existingUser?.email;
			token.image = existingUser?.image;

			return token;
		},
		session: async ({ token, session }) => {
			// If user does not have an id, we can add it manually
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}

			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
				session.user.email = token.email as string;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			if (session.user && session?.user?.name) {
				session.user.name = token.name as string;
			}

			if (session.user && session?.user?.image) {
				session.user.image = token.image as string;
			}

			return session;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...AuthConfig,
});
