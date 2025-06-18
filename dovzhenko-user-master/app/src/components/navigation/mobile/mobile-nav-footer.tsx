import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import instagram from 'app/public/static/images/insta.png';
import facebook from 'app/public/static/images/fe_facebook.png';
import { facebookLink, instagramLink } from '@/constants/links';

const MobileNavFooter = () => {
	return (
		<div className='flex justify-center border-t border-white/15 py-10'>
			<div className='flex items-center gap-x-3'>
				<Link href={instagramLink} target='_blank'>
					<Image src={instagram} alt='instagram image' width={24} height={24} />
				</Link>
				<Link href={facebookLink} target='_blank'>
					<Image src={facebook} alt='facebook image' width={24} height={24} />
				</Link>
			</div>
		</div>
	);
};

export default MobileNavFooter;
