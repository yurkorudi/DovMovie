'use client';
import LargeContainer from '@/components/containers/large-container';
import SmallInnerContainer from '@/components/containers/small-container';
import FooterNav from '@/components/footer/footer-nav';
import FooterDescription from '@/components/footer/footer-description';
import FooterUcfLogo from '@/components/footer/footer-ucf-logo';
import FooterSiteLogo from '@/components/footer/footer-site-logo';
import clsx from 'clsx';

const Footer = ({ className }: { className?: string }) => {
	return (
		<footer className={clsx(className, 'w-full border-t border-white/30 py-5')}>
			<LargeContainer>
				<SmallInnerContainer>
					<div className='flex flex-col items-center gap-y-4 2sm:flex-row 2sm:justify-between 2sm:gap-y-0'>
						<div className='flex flex-col md:flex-row md:items-center'>
							<FooterNav className='flex-col items-center gap-y-5 2sm:flex-row md:!hidden' />
							<FooterDescription className='hidden 2sm:block' />
							<FooterUcfLogo className='hidden md:block' />
						</div>
						<FooterNav className='hidden md:flex' />
						<div className='flex flex-row-reverse gap-x-2 gap-y-2 2sm:flex-col 2sm:gap-x-0'>
							<FooterSiteLogo />
							<FooterUcfLogo className='md:hidden' />
						</div>
					</div>
					<FooterDescription className='mt-4 flex justify-center 2sm:hidden' />
				</SmallInnerContainer>
			</LargeContainer>
		</footer>
	);
};

export default Footer;
