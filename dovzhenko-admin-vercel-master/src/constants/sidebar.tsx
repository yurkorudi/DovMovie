import {
	CalendarFold,
	Clapperboard,
	Contact,
	GalleryHorizontal,
	Mail,
	Users,
} from 'lucide-react';
import { ROUTER_PATHS } from '@/routes';
import { Separator } from '@/components/ui/separator';

export const sidebarNavigation = [
	{
		path: ROUTER_PATHS.MAIL,
		name: 'Повідомлення',
		icon: <Mail className='w-[16px]' />,
	},
	{
		icon: <Separator className='my-3 bg-border/30' />,
	},
	{
		path: ROUTER_PATHS.MOVIES,
		name: 'Фільми',
		icon: <Clapperboard className='w-[16px]' />,
	},
	{
		icon: <Separator className='my-3 bg-border/30' />,
	},
	{
		path: ROUTER_PATHS.SLIDERS,
		name: 'Слайдери',
		icon: <GalleryHorizontal className='w-[16px]' />,
	},
	{
		path: ROUTER_PATHS.EVENTS,
		name: 'Події',
		icon: <CalendarFold className='w-[16px]' />,
	},
	{
		path: ROUTER_PATHS.CONTACTS,
		name: 'Контакти',
		icon: <Contact className='w-[16px]' />,
	},
	{
		icon: <Separator className='my-3 bg-border/30' />,
	},
	{
		path: ROUTER_PATHS.EMPLOYEES,
		name: 'Персонал',
		icon: <Users className='w-[16px]' />,
	},
];
