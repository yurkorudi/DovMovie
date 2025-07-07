'use client';
import { TMovie } from '@/lib/types/movies';
import Image from 'next/image';
import moment, { Moment } from 'moment';
import { useMediaQuery } from 'react-responsive';
import localFont from 'next/font/local';
import clsx from 'clsx';

const TICKET_APP_URL = process.env.NEXT_PUBLIC_TICKET_APP_URL!;

const GilroyBold = localFont({
  src: '../../../public/fonts/Gilroy-Bold.woff',
});

const MovieListItem = ({
  movie,
  currentDate,
}: {
  movie: TMovie;
  currentDate: Moment;
}) => {
  const isLg = useMediaQuery({ query: '(min-width: 992px)' });

  const getCurrentShowtime = (movie: TMovie) =>
    movie.showtimes.filter((showtime) =>
      moment(showtime.dateTime).isSame(currentDate, 'day'),
    );

  const showtimes = getCurrentShowtime(movie);


  const buyUrl = `${TICKET_APP_URL}/buy?movie_id=${movie.id}`;

  return (
    <div className="flex gap-x-3">
      <a href={buyUrl} aria-label={movie.title}>
        <Image
          width={isLg ? 220 : 180}
          height={isLg ? 300 : 255}
          src={movie.poster}
          alt={movie.title}
          className={clsx({
            'min-h-[300px] min-w-[220px]': isLg,
            'min-h-[255px] min-w-[180px]': !isLg,
          })}
        />
      </a>

      <div>
        <a
          href={buyUrl}
          aria-label={movie.title}
          className={clsx(
            GilroyBold.className,
            'text-base font-bold text-white sm:text-lg lg:text-xl'
          )}
        >
          {movie.title}
        </a>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {showtimes.length ? (
            showtimes.map((showtime) => (
              <p key={showtime.id} className="font-bold text-gold">
                {moment(showtime.dateTime).format('HH:mm')}
              </p>
            ))
          ) : (
            <p className="text-white">No time to show</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieListItem;
