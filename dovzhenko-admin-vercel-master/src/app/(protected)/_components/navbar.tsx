'use client';
import Burger from '@/components/navbar/Burger';

const Navbar = () => {
	return (
		<div className='flex items-center justify-between p-5'>
			<div className='flex h-[60px] w-full flex-col justify-center rounded-md bg-secondary p-3 shadow-md'>
				<Burger />
				{/*<UserButton />*/}
			</div>
		</div>
	);
};

export default Navbar;
