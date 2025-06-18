import { type DefaultSession } from 'next-auth';
import { UserRole } from '.prisma/client';

export type ExtendedUser = DefaultSession['user'] & {
	role: UserRole;
	isTwoFactorEnabled: boolean;
	isOAuth: boolean;
	image: string;
};

declare module 'next-auth' {
	interface Session {
		user: ExtendedUser;
		expires: string;
	}
}
