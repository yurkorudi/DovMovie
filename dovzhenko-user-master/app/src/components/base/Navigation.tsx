import BurgerAnimated from '@/components/burger/BurgerAnimated';
import NavList from '@/components/navigation/nav-list';
import { TLocale } from '@/lib/types/locales';

const Navigation = ({ locale }: TLocale) => {
	return (
		<>
			<BurgerAnimated />
			<NavList locale={locale} />
		</>
	);
};

export default Navigation;
