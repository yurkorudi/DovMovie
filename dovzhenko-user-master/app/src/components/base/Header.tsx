import Logo from '@/components/base/Logo';
import Navigation from '@/components/base/Navigation';
import LargeContainer from '@/components/containers/large-container';
import { TLocale } from '@/lib/types/locales';

const Header = ({ locale }: TLocale) => {
	return (
		<header className='sticky top-0 z-50 flex h-[70px] items-center justify-center bg-main'>
			<LargeContainer>
				<div className='flex items-center justify-between'>
					<Logo />
					<Navigation locale={locale} />
				</div>
			</LargeContainer>
		</header>
	);
};

export default Header;
