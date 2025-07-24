'use client';
import localFont from 'next/font/local';
import clsx from 'clsx';
import NavItem from '@/components/navigation/nav-item';
import { nanoid } from 'nanoid';
import { footerNavigation } from '@/constants/navigation';
import { t } from '@/hooks/use-lang';

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const FooterNav = ({ className }: { className?: string }) => {
	return (
		<ul className={clsx(className, 'flex gap-x-10')}>
			{footerNavigation.map((item) => {
				const isInternal = item.link.startsWith('#');

				return isInternal ? (
					<NavItem
					key={nanoid()}
					className={clsx(
						'group !text-xs uppercase text-white opacity-70 hover:text-gold',
						GilroyRegular.className,
					)}
					link={item.link}
					onClick={(e) => {
						e.preventDefault();
						const target = document.querySelector(item.link);
						if (target) {
						target.scrollIntoView({ behavior: 'smooth' });
						}
					}}
					>
					{t([item.text, item.key])}
					</NavItem>
				) : (
					<a
						key={nanoid()}
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						className={clsx(
							'group flex items-center justify-center text-center !text-xs uppercase text-white opacity-70 hover:text-gold',
							GilroyRegular.className,
						)}
					>
						{t([item.text, item.key])}
					</a>

				);
				})}
		</ul>
	);
};

export default FooterNav;
