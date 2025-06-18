import { TMovie } from '@/lib/types/movies';
import initTranslations from '@/app/i18n';
import backgroundImage from 'app/public/static/images/event_back.webp';
import DividerLine from '@/components/DividerLine';
import clsx from 'clsx';
import SmallInnerContainer from '@/components/containers/small-container';
import LargeContainer from '@/components/containers/large-container';
import MovieItem from '@/components/movies/homepage/movie-item';
import { nanoid } from 'nanoid';

const nameSpaces = ['movies'];

const MovieList = async ({
	movies,
	locale,
}: {
	movies: TMovie[];
	locale: string;
}) => {
	const { t } = await initTranslations(locale, nameSpaces);

	return (
		<div
			className='relative py-20'
			style={{
				background: `url(${backgroundImage.src}) 0 0 / cover no-repeat #291666`,
				backgroundBlendMode: 'luminosity',
			}}
		>
			<DividerLine
				className='absolute top-[140px] -mt-2.5'
				title={t('title')}
				link={'/movies'}
			/>
			<LargeContainer>
				<SmallInnerContainer>
					<div
						className={clsx(
							'mt-[50px] grid grid-cols-1 place-items-center gap-[30px] md:grid-cols-2 lg:grid-cols-3',
						)}
					>
						{movies.slice(0, 9).map((movie, index) => (
							<MovieItem key={nanoid()} index={index} movie={movie} />
						))}
					</div>
				</SmallInnerContainer>
			</LargeContainer>
		</div>
	);
};

export default MovieList;
