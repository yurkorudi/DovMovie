import AddEditUser from '@/components/user/add-edit-user';
import { useServerPathname } from '@/lib/routes';
import { notFound } from 'next/navigation';
import { ROUTER_PATHS } from '@/routes';
import { getUserById } from '@/services/user';

const allowedRoutes = [ROUTER_PATHS.ADD_USER, ROUTER_PATHS.EDIT_USER];

const AddEditUserPage = async () => {
	const { matchAllowedRoutes, searchParams } = useServerPathname();
	const user = searchParams?.userId
		? await getUserById(searchParams?.userId)
		: null;
	const is404Edit = !user && searchParams?.userId;

	if (is404Edit || !matchAllowedRoutes(allowedRoutes)) {
		return notFound();
	}

	return <AddEditUser user={user} userId={searchParams?.userId} />;
};

export default AddEditUserPage;
