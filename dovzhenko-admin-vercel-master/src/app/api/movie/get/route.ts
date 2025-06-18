import { NextRequest, NextResponse } from 'next/server';
import { getMovieById } from '@/actions/movie';

export const GET = async (request: NextRequest) => {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		return NextResponse.json({ message: 'You must to pass valid id' });
	}

	const movie = await getMovieById(id);

	if (!movie) {
		return NextResponse.json({ message: 'No data found' });
	}

	const mappedData = {
		id: movie.id,
		title: movie.title,
		titleEng: movie.titleEng,
		age: movie.age,
		genre: movie.genre,
		genreEng: movie.genreEng,
		filmMaker: movie.filmMaker,
		filmMakerEng: movie.filmMakerEng,
		country: movie.country,
		countryEng: movie.countryEng,
		duration: movie.duration,
		description: movie.description,
		descriptionEng: movie.descriptionEng,
		trailerLink: movie.trailerLink,
		ticketLink: movie.ticketLink,
		applications: movie.applications,
		poster: movie.poster,
		price: movie.price,
		showtimes: movie.showtimes,
	};

	return NextResponse.json(mappedData, { status: 200 });
};
