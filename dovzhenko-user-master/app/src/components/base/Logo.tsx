import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
	return (
		<Link href='/'>
			<Image
				src='/static/images/logo.svg'
				alt='Logo image'
				width='98'
				height='36'
				priority
			/>
		</Link>
	);
};

export default Logo;
