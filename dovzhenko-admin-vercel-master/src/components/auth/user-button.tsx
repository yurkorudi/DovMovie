'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import useCurrentUser from '@/hooks/use-current-user';
import { ExitIcon } from '@radix-ui/react-icons';
import LogoutBtn from '@/components/auth/logout-btn';

const UserButton = () => {
	const user = useCurrentUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image || ''} />
					<AvatarFallback className='bg-sky-500'>
						<FaUser className='text-white' />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<LogoutBtn>
					<DropdownMenuItem>
						<ExitIcon className='mr-2 h-4 w-4' />
						Logout
					</DropdownMenuItem>
				</LogoutBtn>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
