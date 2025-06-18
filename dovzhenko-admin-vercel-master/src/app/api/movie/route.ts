import { getCurrentMovies } from '@/actions/movie';
import { NextResponse } from 'next/server';

export const GET = async () => {
	const data = await getCurrentMovies();
	const transformedData = data.map((movie) => {
		return {
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
			showtimes: movie.showtimes,
			applications: movie.applications,
			poster: movie.poster,
			price: movie.price,
		};
	});

	return NextResponse.json(transformedData, { status: 200 });
};

export const dynamic = 'force-dynamic';
