import { useSession } from 'next-auth/react';

const useCurrentRole = () => {
	const session = useSession();

	return session?.data?.user?.role;
};

export default useCurrentRole;
