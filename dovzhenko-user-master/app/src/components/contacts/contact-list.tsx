import ContactItem from '@/components/contacts/contact-item';
import backgroundImage from 'app/public/static/images/back_sits.svg';
import Link from 'next/link';
import ContactInstagramIcon from '@/components/contacts/contact-instagram-icon';
import ContactFbIcon from '@/components/contacts/contact-fb-icon';
import Footer from '@/components/footer/footer';
import React from 'react';
import initTranslations from '@/app/i18n';
import TranslationsProvider from '@/providers/TranslatorProvider';
import { TContact } from '@/lib/types/contacts';

const nameSpaces = ['common'];

const ContactList = async ({
	locale,
	contacts,
}: {
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
			<a id='contacts'></a>
			<div
				className='flex flex-col items-center gap-y-[47px]  pt-20'
				style={{
					backgroundImage: `url(${backgroundImage.src})`,
				}}
			>
				<ContactItem
					title={t('contact-address')}
					text={contacts.address}
					textEng={contacts.addressEng}
					animationDelay={0.2}
				/>
				<ContactItem
					title={t('contact-schedule')}
					text={contacts.schedule}
					textEng={contacts.scheduleEng}
					animationDelay={0.4}
				/>
				<ContactItem
					title={t('contact-phone')}
					text={contacts.phone}
					textEng={contacts.phone}
					animationDelay={0.6}
				/>
				<ContactItem
					title={t('contact-email')}
					text={contacts.email}
					textEng={contacts.email}
					animationDelay={0.8}
				/>
				<div className='flex gap-x-5'>
					<Link
						href='https://www.instagram.com/lviv_dovzhenko_centre/'
						target='_blank'
						className='group'
						aria-label='Link to instagram'
					>
						<ContactInstagramIcon />
					</Link>
					<Link
						href='https://www.facebook.com/lvivdovzhenkocentre/'
						target='_blank'
						className='group'
						aria-label='Link to facebook'
					>
						<ContactFbIcon />
					</Link>
				</div>
				<Footer />
			</div>
		</TranslationsProvider>
	);
};

export default ContactList;
