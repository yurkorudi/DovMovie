import CapacityImageSvg from '@/images/capacity.svg';
import Image from 'next/image';
import localFont from 'next/font/local';
import clsx from 'clsx';
import { Forum } from 'next/font/google';

const Gilroy = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const forum = Forum({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const CardTitle = ({
	title,
	capacity,
}: {
	title: string;
	capacity: number;
}) => {
	return (
		<div className='flex w-full items-center justify-between'>
			<h2
				className={clsx(
					forum.className,
					'text-[32px] leading-[35px] text-white',
				)}
			>
				{title}
			</h2>
			<p className={clsx(Gilroy.className, 'flex gap-x-2 text-white')}>
				{capacity} <Image src={CapacityImageSvg} alt='ucf logo' />
			</p>
		</div>
	);
};

export default CardTitle;
