'use client';
import { TMovie } from '@/lib/types/movies';
import Image from 'next/image';
import { t } from '@/hooks/use-lang';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { movieApps } from '@/lib/constants/movies';
import localFont from 'next/font/local';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import dynamic from 'next/dynamic';

const GilroyBold = localFont({
  src: '../../../../public/fonts/Gilroy-Bold.woff',
});

const GilroyRegular = localFont({
  src: '../../../../public/fonts/Gilroy-Regular.woff',
});

const MovieDetails = ({ movie }: { movie: TMovie }) => {
  const isLg = useMediaQuery({ query: '(min-width: 978px)' });

  // Безпечний парсинг
  let apps: { value: string; label: string }[] = [];
  try {
    apps = JSON.parse(movie.applications || '[]');
  } catch {
    apps = [];
  }

  const getAppByName = (appName: string) => {
    return movieApps.find((app) => app.name === appName);
  };

  const buyUrl = `http://192.168.1.21:5000/buy?movie_id=${movie.id}`;

  return (
      <div className="grid gap-x-8 lg:grid-cols-[300px,calc(100%-300px)]">
        {/* Ліва колонка: постер та кнопки */}
        <div>
          {isLg ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              width={300}
              height={440}
              className="max-h-[440px] max-w-[300px]"
            />
          ) : (
            <iframe
              width="100%"
              height="315"
              src={movie.trailerLink.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}

          {isLg && (
            <div className="mt-4">
              <Link
                href={buyUrl}
                target="_blank"
                className="block w-full rounded-sm bg-gold px-4 py-2 text-center text-main transition hover:bg-gold-hover"
              >
                {t(['Купити квиток', 'Buy ticket'])}
              </Link>
              <Link
                href={movie.trailerLink}
                target="_blank"
                className="mt-2 block w-full rounded-sm border border-white px-4 py-2 text-center font-bold text-white transition hover:bg-white hover:text-main"
              >
                {t(['Трейлер', 'Trailer'])}
              </Link>
            </div>
          )}
        </div>

        {/* Права колонка: деталі фільму */}
        <div className="mt-4 text-white lg:mt-0">
          <h1 className={clsx('text-3xl font-bold', GilroyBold.className)}>
            {t([movie.title, movie.titleEng])}
          </h1>
          <ul className={clsx(GilroyRegular.className, 'mt-10 grid gap-y-3')}>
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
              <strong>{t(['Вік', 'Age'])}:</strong>
              <span className="underline">{movie.age}</span>
            </li>
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
              <strong>{t(['Жанр', 'Genre'])}:</strong>
              <span>{t([movie.genre, movie.genreEng])}</span>
            </li>
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
              <strong>{t(['Режисер', 'Filmmaker'])}:</strong>
              <span>{t([movie.filmMaker, movie.filmMakerEng])}</span>
            </li>
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
              <strong>{t(['Країна', 'Country'])}:</strong>
              <span>{t([movie.country, movie.countryEng])}</span>
            </li>
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
              <strong>{t(['Тривалість', 'Duration'])}:</strong>
              <span>{movie.duration}</span>
            </li>
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
              <strong>{t(['Ціна', 'Price'])}:</strong>
              <span>
                {movie.price} {t(['грн', 'UAH'])}
              </span>
            </li>
            {apps.length > 0 && (
              <li className="grid grid-cols-[120px_calc(100%-120px)] items-center gap-x-4">
                <strong>{t(['Застосунки', 'Application'])}:</strong>
                <p>
                  {apps.map((app) => (
                    <span key={nanoid()}>
                      {app.label} (
                      <Link
                        href={getAppByName(app.value)?.ios || ''}
                        className="text-white/80 hover:text-white"
                        target="_blank"
                      >
                        iOS
                      </Link>
                      /
                      <Link
                        href={getAppByName(app.value)?.android || ''}
                        className="text-white/80 hover:text-white"
                        target="_blank"
                      >
                        Android
                      </Link>
                      )
                    </span>
                  ))}
                </p>
              </li>
            )}
            <li className="grid grid-cols-[120px_calc(100%-120px)] items-start gap-x-4">
              <strong>{t(['Опис', 'Description'])}:</strong>
              <p>{t([movie.description, movie.descriptionEng])}</p>
            </li>
          </ul>

          {!isLg && (
            <div className="mt-8">
              <Link
                href={buyUrl}
                target="_blank"
                className="block w-full rounded-sm bg-gold px-4 py-2 text-center text-main transition hover:bg-gold-hover"
              >
                {t(['Купити квиток', 'Buy ticket'])}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default dynamic(() => Promise.resolve(MovieDetails), { ssr: false });