import MoviePageWrapper from '@/components/movies/movie-page-wrapper';
import MovieDetails from '@/components/movies/details/movie-details';
import { redirect } from 'next/navigation';
import { getMovieById } from '@/actions';

const Page = async ({ params }: { params: { id: string } }) => {
	const { id } = params;

	if (!id) {
		redirect('/movies');
	}

	const movie = await getMovieById(id);

	return (
		<MoviePageWrapper>
			<MovieDetails movie={movie} />
		</MoviePageWrapper>
	);
};

export default Page;
