import { useServerPathname } from '@/lib/routes';
import { notFound } from 'next/navigation';
import AddEditStudio from '@/components/studios/AddEditStudio';
import { getStudioById } from '@/actions/studios';

const allowedRoutes = ['/sliders/studios/add', '/sliders/studios/edit'];

const AddEditStudioPage = async () => {
	const { matchAllowedRoutes, searchParams } = useServerPathname();
	const studio = await getStudioById(searchParams?.studioId);
	const is404Edit = !studio && searchParams?.studioId;

	if (is404Edit || !matchAllowedRoutes(allowedRoutes)) {
		return notFound();
	}

	return <AddEditStudio studio={studio} />;
};

export default AddEditStudioPage;
