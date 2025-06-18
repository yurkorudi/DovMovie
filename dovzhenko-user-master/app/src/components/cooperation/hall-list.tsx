'use client';
import { useState } from 'react';
import { Mdiv } from '@/components/motion';
import { cooperation } from '@/constants/cooperation';
import { nanoid } from 'nanoid';
import ListItem from '@/components/cooperation/list-item';
import { useRouter } from 'next/navigation';
import { useLang } from '@/hooks/use-lang';

const HallList = () => {
	const [hallId, setHallId] = useState<number | null>(3);
	const [clicked, setClicked] = useState(false);
	const router = useRouter();
	const locale = useLang();

	return (
		<div className='pb-14 pt-10'>
			<div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
				{cooperation.map((item, index) => (
					<Mdiv
						className='h-full'
						key={nanoid()}
						initial={{ opacity: 1, height: 'auto' }}
						animate={{
							opacity: clicked ? 0 : 1,
							height: clicked ? 0 : 'auto',
						}}
						transition={{
							opacity: { duration: 0.5, delay: clicked ? index * 0.2 : 0 },
							height: { duration: 0.5, delay: clicked ? index * 0.6 : 0 },
						}}
						style={{
							overflow: 'hidden',
						}}
						onAnimationComplete={() => {
							if (clicked && index === cooperation.length - 1) {
								router.push(`/${locale}/cooperation/mail/${hallId}`);
							}
						}}
					>
						<ListItem
							item={item}
							onRentClick={(id) => {
								setHallId(id);
								setClicked(true);
							}}
						/>
					</Mdiv>
				))}
			</div>
		</div>
	);
};

export default HallList;
