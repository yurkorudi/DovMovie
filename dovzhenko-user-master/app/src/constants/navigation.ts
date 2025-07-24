export enum ENavLinks {
	Events = '#events',
	Studios = '#studios',
	About = '#aboutUs',
	Contacts = '#contacts',
	Cooperation = '/cooperation',
	Movies = '/movies',
}

export const navigation = [
	{
		text: 'EN',
		key: 'en',
		link: '#',
		parentClassName: 'mr-[60px]',
		className:
			'cursor-pointer text-xs uppercase transition duration-300 hover:text-gold',
	},
	{
		text: 'Фільми',
		key: 'movies',
		link: ENavLinks.Movies,
		className: 'group text-xs uppercase hover:text-gold ',
		parentClassName: 'mr-[40px]',
	},
	{
		text: 'Події',
		key: 'events',
		link: ENavLinks.Events,
		className: 'group text-xs uppercase hover:text-gold ',
		parentClassName: 'mr-[40px]',
	},
	{
		text: 'СТУДІЇ',
		key: 'studios',
		link: ENavLinks.Studios,
		className: 'group text-xs uppercase hover:text-gold',
		parentClassName: 'mr-[40px]',
	},
	{
		text: 'ПРО НАС',
		key: 'about',
		link: ENavLinks.About,
		className: 'group text-xs uppercase hover:text-gold',
		parentClassName: 'mr-[40px]',
	},
	{
		text: 'КОНТАКТИ',
		key: 'contacts',
		link: ENavLinks.Contacts,
		className: 'group text-xs uppercase hover:text-gold',
		parentClassName: 'mr-[60px]',
	},
	{
		text: 'СПІВПРАЦЯ',
		key: 'cooperation',
		link: ENavLinks.Cooperation,
		className:
			'cursor-pointer text-xs uppercase text-gold underline transition duration-300 hover:text-gold-hover',
		parentClassName: '',
	},
] as const;

export const mobileNavigation = [
	{
		text: 'EN',
		key: 'en',
		link: '#',
		parentClassName: 'mb-[60px]',
		className: 'cursor-pointer text-xs uppercase text-white text-base ',
	},
	{
		text: 'Фільми',
		key: 'movies',
		link: ENavLinks.Movies,
		className: 'text-xs uppercase text-white/70 text-base',
		parentClassName: 'mb-[30px]',
	},
	{
		text: 'Події',
		key: 'events',
		link: '#events',
		className: 'text-xs uppercase text-white/70 text-base',
		parentClassName: 'mb-[30px]',
	},
	{
		text: 'СТУДІЇ',
		key: 'studios',
		link: '#studios',
		className: 'text-xs uppercase text-white/70 text-base',
		parentClassName: 'mb-[30px]',
	},
	{
		text: 'ПРО НАС',
		key: 'about',
		link: '#aboutUs',
		className: 'text-xs uppercase text-white/70 text-base',
		parentClassName: 'mb-[30px]',
	},
	{
		text: 'КОНТАКТИ',
		key: 'contacts',
		link: '#contacts',
		className: 'text-xs uppercase text-white/70 text-base',
		parentClassName: 'mb-[30px]',
	},
	{
		text: 'СПІВПРАЦЯ',
		key: 'cooperation',
		link: '/cooperation',
		className: 'cursor-pointer text-xs uppercase text-gold underline text-base',
		parentClassName: '',
	},
] as const;

export const footerNavigation = [
	{
		text: 'Події',
		key: 'Events',
		link: '#events',
	},
	{
		text: 'СТУДІЇ',
		key: 'Studios',
		link: '#studios',
	},
	{
		text: 'ПРО НАС',
		key: 'About us',
		link: '#aboutUs',
	},
	{
		text: 'КОНТАКТИ',
		key: 'Contacts',
		link: '#contacts',
	},
	{
		text: 'НАША ПОЛІТИКА',
		key: 'our politics',
		link: 'http://127.0.0.1:5000/political/',
	},
] as const;
