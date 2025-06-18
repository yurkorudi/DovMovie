import Link from 'next/link';
import initTranslations from '@/app/i18n';

const nameSpaces = ['movies'];

const MovieListBanner = async ({ locale }: { locale: string }) => {
	const { t } = await initTranslations(locale, nameSpaces);

	return (
		<div className='relative'>
			<img
				src='/static/images/multi.jpg'
				alt='big image'
				className='h-[395px] w-full rounded-sm object-cover'
			/>
			<div className='absolute left-1/2 top-5 -translate-x-1/2 transform text-center lg:top-1/2 lg:-translate-y-1/2'>
				<h2 className='text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl'>
					{t('cinemaSubtitle')}
				</h2>
			</div>
			<div className='absolute bottom-0 left-0 w-full'>
				<div className='flex flex-col items-start p-3 lg:flex-row lg:justify-between'>
					<Link
						href='https://maps.app.goo.gl/vMcWJKG1yQT4RUA78'
						target='_blank'
						className='flex items-center justify-center'
					>
						<div className='grid h-16 w-16 place-items-center rounded-full border border-white'>
							<svg width='16' height='24' xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M8 0C3.594 0 0 3.594 0 8c0 1.268.498 2.672 1.178 4.22.68 1.549 1.57 3.203 2.457 4.731a94.456 94.456 0 0 0 3.543 5.617L8 23.76l.822-1.192s1.77-2.56 3.543-5.617c.887-1.528 1.777-3.182 2.457-4.73C15.502 10.672 16 9.268 16 8c0-4.406-3.594-8-8-8zm0 2c3.326 0 6 2.674 6 6 0 .665-.377 1.977-1.01 3.416-.632 1.44-1.492 3.043-2.355 4.531-1.316 2.269-2.082 3.359-2.635 4.18-.553-.821-1.319-1.911-2.635-4.18-.863-1.488-1.723-3.092-2.355-4.531C2.377 9.976 2 8.665 2 8c0-3.326 2.674-6 6-6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'
									fill='#FFF'
									fillRule='nonzero'
								></path>
							</svg>
						</div>
						<div className='ml-3 text-white'>
							<p>{t('address')}</p>
							<p>{t('city')}</p>
						</div>
					</Link>
					<Link href='tel:+380968258360' className='mt-2 block lg:mt-0'>
						<div className='flex flex-row-reverse items-center justify-center lg:flex-row'>
							<div className='ml-3 text-white lg:ml-0 lg:mr-3'>
								<p>{t('contact-center')}</p>
							</div>
							<div className='grid h-16 w-16 place-items-center rounded-full border border-white'>
								<svg width='28' height='27' xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M6.656 0c-.523 0-1.039.188-1.468.531l-.063.031-.031.032-3.125 3.219.031.03a3.134 3.134 0 0 0-.844 3.376c.004.008-.004.023 0 .031.848 2.426 3.016 7.11 7.25 11.344 4.25 4.25 8.996 6.332 11.344 7.25h.031a3.59 3.59 0 0 0 3.469-.688L26.406 22c.828-.828.828-2.266 0-3.094l-4.062-4.062-.032-.063c-.828-.828-2.296-.828-3.125 0l-2 2a16.176 16.176 0 0 1-4.093-2.812c-1.637-1.563-2.473-3.36-2.781-4.063l2-2c.84-.84.855-2.238-.032-3.062l.031-.032-.093-.093-4-4.125-.031-.031L8.124.53A2.356 2.356 0 0 0 6.656 0zm0 2a.35.35 0 0 1 .219.094l4 4.094.094.093c-.008-.008.058.098-.063.219L8.406 9l-.469.438.22.624s1.148 3.075 3.562 5.376l.219.187C14.261 17.746 17 18.906 17 18.906l.625.282 2.969-2.97c.172-.171.14-.171.312 0L25 20.314c.172.171.172.109 0 .28l-3.063 3.063c-.46.395-.949.477-1.53.282-2.266-.891-6.669-2.825-10.595-6.75C5.856 13.23 3.79 8.742 3.032 6.563c-.153-.407-.044-1.008.312-1.313l.062-.063 3.031-3.093A.35.35 0 0 1 6.657 2z'
										fill='#FFF'
										fillRule='nonzero'
									></path>
								</svg>
							</div>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MovieListBanner;
