import { t } from '@/hooks/use-lang';
import { Forum } from 'next/font/google';
import clsx from 'clsx';

const ForumSans = Forum({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const RentButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button
			onClick={onClick}
			className={clsx(
				ForumSans.className,
				'text-[18px] uppercase leading-[20px] text-gold underline underline-offset-4 hover:text-gold-hover',
			)}
		>
			{t(['Орендувати зал', 'Rent a hall'])}
		</button>
	);
};

export default RentButton;
