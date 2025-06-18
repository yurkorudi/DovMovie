import Link from 'next/link';
import Image from 'next/image';
import ucfLogo from '@/images/ucf.svg';
import clsx from 'clsx';

const FooterUcfLogo = ({ className }: { className?: string }) => {
	return (
		<div className={clsx(className, 'mx-2.5')}>
			<Link href='https://ucf.in.ua/' target='_blank'>
				<Image src={ucfLogo} alt='ucf logo' />
			</Link>
		</div>
	);
};

export default FooterUcfLogo;
