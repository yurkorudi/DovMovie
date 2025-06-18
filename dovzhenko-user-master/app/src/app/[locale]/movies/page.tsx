import MovieList from '@/components/movies/movie-list';
import { TLocale } from '@/lib/types/locales';
import { getCurrentMovies } from '@/actions';
import MoviePageWrapper from '@/components/movies/movie-page-wrapper';

const Page = async ({ params: { locale } }: { params: TLocale }) => {
	const movies = await getCurrentMovies();

	return (
		<MoviePageWrapper>
			<MovieList locale={locale} movies={movies} />
		</MoviePageWrapper>
	);
};

export default Page;
