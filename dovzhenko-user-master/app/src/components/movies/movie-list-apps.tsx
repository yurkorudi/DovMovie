import initTranslations from '@/app/i18n';
import { movieApps } from '@/lib/constants/movies';
import Link from 'next/link';
import { nanoid } from 'nanoid';

const nameSpaces = ['movies'];

const MovieListApps = async ({ locale }: { locale: string }) => {
	const { t } = await initTranslations(locale, nameSpaces);

	return (
		<div className='flex flex-col rounded-sm bg-main p-4'>
			<p className='mb-2 mr-2 text-center text-white/50'>{t('app-list')}: </p>
			<ul className='flex flex-wrap justify-between gap-2'>
				{movieApps.map((app) => (
					<li key={nanoid()} className='text-white/80'>
						{app.name}(
						<Link
							href={app.android}
							target='_blank'
							className='hover:text-white'
						>
							Android
						</Link>
						/
						<Link href={app.ios} target='_blank' className='hover:text-white'>
							iOS
						</Link>
						)
					</li>
				))}
			</ul>
		</div>
	);
};

export default MovieListApps;
