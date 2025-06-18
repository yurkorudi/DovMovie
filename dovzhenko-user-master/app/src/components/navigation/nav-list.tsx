import NavItem from '@/components/navigation/nav-item';
import { nanoid } from 'nanoid';
import { navigation } from '@/constants/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import initTranslations from '@/app/i18n';
import TranslationsProvider from '@/providers/TranslatorProvider';
import { TLocale } from '@/lib/types/locales';

const nameSpaces = ['common'];

const NavList = async ({ locale }: TLocale) => {
	const { t, resources } = await initTranslations(locale, nameSpaces);

	return (
		<TranslationsProvider
			locale={locale}
			resources={resources}
			namespaces={nameSpaces}
		>
			<ul className='hidden items-center text-white md:flex'>
				{navigation.map((item, index) => {
					return index === 0 ? (
						<LanguageSwitcher
							key={nanoid()}
							parentClassName={item.parentClassName}
							className={item.className}
						/>
					) : (
						<NavItem
							key={nanoid()}
							className={item.className}
							link={item.link}
							parentClassName={item.parentClassName}
						>
							{t(item.key)}
						</NavItem>
					);
				})}
			</ul>
		</TranslationsProvider>
	);
};

export default NavList;
