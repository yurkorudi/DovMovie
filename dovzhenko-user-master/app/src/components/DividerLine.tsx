import clsx from 'clsx';
import { Forum } from 'next/font/google';
import LargeContainer from './containers/large-container';
import SmallInnerContainer from './containers/small-container';
import { ReactNode } from 'react';
import { Mdiv, Mh2 } from '@/components/motion';
import {
	leftAnimation,
	rightAnimation,
	widthAnimation,
} from '@/constants/animations';
import Link from 'next/link';

const forum = Forum({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const DividerLine = ({
	parentClassName,
	className,
	title,
	subtitle,
	containerClassName,
	link,
}: {
	className?: string;
	parentClassName?: string;
	containerClassName?: string;
	title?: string;
	subtitle?: string | ReactNode;
	link?: string;
}) => {
	return (
		<div className={parentClassName}>
			<LargeContainer>
				<SmallInnerContainer>
					<div className={clsx(containerClassName, 'flex gap-x-2')}>
						{title && (
							<Mh2
								initial='hidden'
								whileInView='visible'
								viewport={{ amount: 0.1, once: true }}
								variants={leftAnimation(0.2)}
								className={clsx(
									forum.className,
									'text-nowrap text-[60px] uppercase leading-[60px] text-gold',
									{
										'w-2/5 lg:w-3/5': subtitle,
									},
								)}
							>
								{link ? <Link href={link}>{title}</Link> : title}
							</Mh2>
						)}
						<Mdiv
							initial='hidden'
							whileInView='visible'
							viewport={{ amount: 0.1, once: true }}
							variants={rightAnimation(0)}
						>
							{subtitle && subtitle}
						</Mdiv>
					</div>
				</SmallInnerContainer>
			</LargeContainer>
			<Mdiv
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.9, once: true }}
				variants={widthAnimation()}
				className={clsx('h-px w-full bg-white/15', className, {
					'mt-[-10px]': title?.length,
				})}
			/>
		</div>
	);
};

export default DividerLine;
