import AddEditMovie from '@/components/movies/add-edit-movie';
import { useServerPathname } from '@/lib/routes';
import { notFound } from 'next/navigation';
import { ROUTER_PATHS } from '@/routes';
import { getMovieById } from '@/actions/movie';

const allowedRoutes = [ROUTER_PATHS.EDIT_MOVIE, ROUTER_PATHS.CREATE_MOVIE];

const Page = async () => {
	const { matchAllowedRoutes, searchParams } = useServerPathname();
	const movie = await getMovieById(searchParams?.movieId);

	if (!matchAllowedRoutes(allowedRoutes)) {
		return notFound();
	}

	return <AddEditMovie movie={movie} movieId={searchParams?.movieId} />;
};

export default Page;
