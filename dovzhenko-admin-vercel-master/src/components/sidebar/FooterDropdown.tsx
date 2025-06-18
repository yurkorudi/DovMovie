import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CircleHelp, LogOut, Settings } from 'lucide-react';
import LogoutBtn from '@/components/auth/logout-btn';
import useCurrentUser from '@/hooks/use-current-user';
import Link from 'next/link';
import { ROUTER_PATHS } from '@/routes';

const FooterDropdown = () => {
	const user = useCurrentUser();
	// const { setTheme, theme } = useTheme();
	// const isLight = theme === 'light';
	//
	// const toggleTheme = () => {
	// 	setTheme(theme === 'dark' ? 'light' : 'dark');
	// };

	return (
		<div className='px-2'>
			<DropdownMenu>
				<DropdownMenuTrigger className='flex w-full items-center gap-2 rounded-sm px-4 py-1 text-white hover:bg-link hover:text-link-hover focus-visible:outline-0 [&>svg]:hover:text-link-hover'>
					<Settings width={15} height={15} className='text-svg' />
					Налаштування
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-[220px]'>
					<DropdownMenuLabel>Привіт, {user?.name}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{/*<Link href={ROUTER_PATHS.SETTINGS} className='block w-full'>*/}
					{/*	<DropdownMenuItem className='cursor-pointer'>*/}
					{/*		<Settings*/}
					{/*			width={15}*/}
					{/*			height={15}*/}
					{/*			className='me-2 text-link-hover'*/}
					{/*		/>*/}
					{/*		Акаунт*/}
					{/*	</DropdownMenuItem>*/}
					{/*</Link>*/}
					{/*<DropdownMenuItem className='cursor-pointer' onClick={toggleTheme}>*/}
					{/*	<Moon width={15} height={15} className='me-2 text-link-hover' />*/}
					{/*	Увімкнути {isLight ? 'темний режим' : 'світлий режим'}*/}
					{/*</DropdownMenuItem>*/}
					<Link href={ROUTER_PATHS.HELP} className='block w-full'>
						<DropdownMenuItem className='cursor-pointer'>
							<CircleHelp
								width={15}
								height={15}
								className='me-2 text-link-hover'
							/>
							Допомога
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='w-full cursor-pointer'>
						<LogOut width={15} height={15} className='me-2 text-link-hover' />
						<LogoutBtn className='w-full'>Вийти</LogoutBtn>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default FooterDropdown;
