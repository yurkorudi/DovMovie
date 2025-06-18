'use client';

import { PropsWithChildren } from 'react';
import { UserRole } from '.prisma/client';
import useCurrentRole from '@/hooks/use-current-role';
import FormError from '@/components/form-error';

const RoleGate = ({
	children,
	allowedRole,
}: PropsWithChildren & { allowedRole: UserRole }) => {
	const userRole = useCurrentRole();

	if (userRole !== allowedRole) {
		return (
			<FormError message={"You don't have permissions to see the content"} />
		);
	}

	return children;
};

export default RoleGate;
