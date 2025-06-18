import MovieListBanner from '@/components/movies/movie-list-banner';
import MovieListApps from '@/components/movies/movie-list-apps';
import { TMovie } from '@/lib/types/movies';
import MovieListWrapper from '@/components/movies/movie-list-wrapper';

const MovieList = ({
	locale,
	movies,
}: {
	locale: string;
	movies: TMovie[];
}) => {
	return (
		<div className='grid gap-y-4'>
			<MovieListBanner locale={locale} />
			<MovieListApps locale={locale} />
			<MovieListWrapper locale={locale} movies={movies} />
		</div>
	);
};

export default MovieList;
