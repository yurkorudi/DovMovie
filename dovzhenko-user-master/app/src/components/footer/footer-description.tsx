import clsx from 'clsx';
import localFont from 'next/font/local';
import { t } from '@/hooks/use-lang';

const GilroyLight = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const FooterDescription = ({ className }: { className?: string }) => {
	return (
		<div className={className}>
			<span
				className={clsx(
					GilroyLight.className,
					'text-[10px] leading-[14px] text-white',
				)}
			>
				{t([
					'Сайт створено за підтримки УКФ',
					'The website created with support by UCF',
				])}{' '}
				<br /> © {t(['Всі права захищено', 'All rights reserved'])} |{' '}
				{new Date().getFullYear()}
			</span>
		</div>
	);
};

export default FooterDescription;
