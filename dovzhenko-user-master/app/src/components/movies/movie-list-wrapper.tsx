'use client';

import { useEffect, useState } from 'react';
import { TMovie } from '@/lib/types/movies';
import moment, { Moment } from 'moment/moment';
import MovieListCalendar from '@/components/movies/movie-list-calendar';
import MovieListItem from '@/components/movies/movie-list-item';
import { nanoid } from 'nanoid';
import { t } from '@/hooks/use-lang';

const MovieListWrapper = ({
	locale,
	movies,
}: {
	locale: string;
	movies: TMovie[];
}) => {
	const [movieList, setMovieList] = useState<TMovie[]>([]);
	const [currentDate, setCurrentDate] = useState<Moment>(moment());

	const getMovieListByDate = (date: Moment) => {
		if (!movies || !Array.isArray(movies)) return [];

		return movies.filter((movie) =>
			movie.showtimes.some((showtime) =>
			moment(showtime.dateTime).isSame(date, 'day')
			)
		);
		};

	useEffect(() => {
		setMovieList(getMovieListByDate(moment()));
	}, []);

	return (
		<>
			<MovieListCalendar
				locale={locale}
				onDateChange={(date) => {
					setMovieList(getMovieListByDate(date));
					setCurrentDate(date);
				}}
			/>
			<div className='my-4'>
				{movieList.length ? (
					<div className='grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
						{movieList.map((movie) => (
							<MovieListItem
								movie={movie}
								key={nanoid()}
								currentDate={currentDate}
							/>
						))}
					</div>
				) : (
					<div className='grid place-items-center'>
						<p className='text-lg text-white/60'>
							{t(['Немає фільмів на цю дату', 'No movies on this date'])}
						</p>
					</div>
				)}
			</div>
		</>
	);
};

export default MovieListWrapper;
