import MovieList from '@/components/movies/movie-list';
import { getArchiveMovies, getCurrentMovies } from '@/actions/movie';

const Page = async () => {
	const currentMovies = await getCurrentMovies();
	const archiveMovies = await getArchiveMovies();

	return <MovieList movies={currentMovies} archiveMovies={archiveMovies} />;
};

export default Page;
export const revalidate = 0;
