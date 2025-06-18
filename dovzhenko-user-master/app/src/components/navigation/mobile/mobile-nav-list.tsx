import { mobileNavigation } from '@/constants/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { nanoid } from 'nanoid';
import NavItem from '@/components/navigation/nav-item';
import { useTranslation } from 'react-i18next';
import MobileNavFooter from '@/components/navigation/mobile/mobile-nav-footer';
import React from 'react';

const MobileNavList = () => {
	const { t } = useTranslation();

	return (
		<div className='flex h-[calc(100dvh-70px)] flex-col justify-between pt-[100px]'>
			<div className='flex items-center justify-center'>
				<ul className='flex flex-col items-center'>
					{mobileNavigation.map((item, index) => {
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
								disableAnimation
							>
								{t(item.key)}
							</NavItem>
						);
					})}
				</ul>
			</div>
			<MobileNavFooter />
		</div>
	);
};

export default MobileNavList;
