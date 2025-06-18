import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/images/logo.svg';

const FooterSiteLogo = () => {
	return (
		<div>
			<Link href='/'>
				<Image src={Logo} alt='logo' />
			</Link>
		</div>
	);
};

export default FooterSiteLogo;
