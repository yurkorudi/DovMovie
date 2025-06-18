import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		screens: {
			sm: '480px',
			'2sm': '580px',
			md: '768px',
			lg: '978px',
			xl: '1200px',
			'1xl': '1536px',
			'2xl': '1920px',
		},
		extend: {
			colors: {
				main: {
					DEFAULT: 'hsl(var(--background))',
					gradient: 'linear-gradient(var(--background-gradient))',
					'70': 'rgba(34, 17, 89, .7)',
					'60': 'hsla(var(--background-60))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					light: 'hsl(var(--secondary-light))',
				},
				gold: {
					DEFAULT: 'hsl(var(--navigation))',
					hover: 'hsl(var(--navigation-hover))',
					'70': 'rgba(255, 237, 178, 0.7)',
				},
				event: {
					DEFAULT: 'hsl(var(--event-hover))',
				},
				cooperation: {
					DEFAULT: 'rgba(var(--cooperation))',
				},
			},
		},
	},
	plugins: [],
};
export default config;
