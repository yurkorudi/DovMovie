import { useServerPathname } from '@/lib/routes';
import { notFound } from 'next/navigation';
import AddEditAboutUs from '@/components/about-us/AddEditAboutUs';
import { getAboutSlideById } from '@/actions/about-us';

const allowedRoutes = ['/sliders/about/add', '/sliders/about/edit'];

const AddEditAboutPage = async () => {
	const { matchAllowedRoutes, searchParams } = useServerPathname();
	const slide = await getAboutSlideById(searchParams?.slideId);
	const is404Edit = !slide && searchParams?.studioId;

	if (is404Edit || !matchAllowedRoutes(allowedRoutes)) {
		return notFound();
	}

	return <AddEditAboutUs slide={slide} />;
};

export default AddEditAboutPage;
