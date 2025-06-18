import { TAboutUs } from '@/lib/types/about-us';
import React from 'react';
import TeamCarousel from '@/components/about-us/team-carousel';
import DividerLine from '@/components/DividerLine';
import localFont from 'next/font/local';
import clsx from 'clsx';
import LargeContainer from '@/components/containers/large-container';
import SmallInnerContainer from '@/components/containers/small-container';
import AboutUsDescription from '@/components/about-us/about-us-description';
import Image from 'next/image';
import MainImage from '@/images/main.webp';
import ContactList from '@/components/contacts/contact-list';
import initTranslations from '@/app/i18n';
import TranslationsProvider from '@/providers/TranslatorProvider';
import { Mdiv } from '@/components/motion';
import { bottomAnimation } from '@/constants/animations';
import { TContact } from '@/lib/types/contacts';

const GilroyBold = localFont({
	src: '../../../public/fonts/Gilroy-Bold.woff',
});

const subtitle = (className?: string) => (
	<div className={clsx(GilroyBold.className, 'text-white', className)}>
		<p className='text-[20px] leading-6'>Lviv Dovzhenko Centre</p>
		<p className='text-[20px] leading-6'>(Центр Довженка)</p>
	</div>
);

const nameSpaces = ['common'];

const AboutUs = async ({
	slides,
	locale,
	contacts,
}: {
	slides: TAboutUs[];
	locale: string;
	contacts: TContact;
}) => {
	const { t, resources } = await initTranslations(locale, nameSpaces);

	return (
		<TranslationsProvider
			namespaces={nameSpaces}
			resources={resources}
			locale={locale}
		>
			<a id='aboutUs'></a>
			<div className='main-bg'>
				<DividerLine
					title={t('about-us')}
					subtitle={subtitle('hidden  md:block')}
					parentClassName='pt-20'
					containerClassName='lg:pl-[95px]'
				/>
				<LargeContainer>
					<SmallInnerContainer>
						{subtitle('md:hidden mt-4')}
						<div className='flex flex-col-reverse gap-x-4 md:flex-row lg:pl-[95px]'>
							<div className='mt-[70px] min-w-0 md:w-2/5 lg:w-3/5'>
								<TeamCarousel slides={slides} />
							</div>
							<AboutUsDescription
								title={t('about-us-description-title')}
								description={t('about-us-description')}
							/>
						</div>
						<Mdiv
							initial='hidden'
							whileInView='visible'
							viewport={{ amount: 0.1, once: true }}
							variants={bottomAnimation(0.8, 200)}
							className='relative mt-14 md:hidden'
						>
							<Image
								src={MainImage}
								alt='mian image'
								width={445}
								height={250}
								className='mt-[33px] max-h-[300px] w-full object-cover'
							/>
						</Mdiv>
					</SmallInnerContainer>
				</LargeContainer>
				<ContactList locale={locale} contacts={contacts} />
			</div>
		</TranslationsProvider>
	);
};

export default AboutUs;
