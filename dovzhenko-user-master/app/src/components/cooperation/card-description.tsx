import localFont from 'next/font/local';
import clsx from 'clsx';

const Gilroy = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const CardDescription = ({ text }: { text: string }) => {
	return (
		<p
			className={clsx(
				Gilroy.className,
				'my-4 flex flex-shrink-0 flex-grow text-[14px] leading-[19px] text-white ',
			)}
		>
			{text}
		</p>
	);
};

export default CardDescription;
