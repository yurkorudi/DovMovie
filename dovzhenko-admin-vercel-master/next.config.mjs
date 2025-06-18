/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_ORIGIN: process.env.APP_ORIGIN,

		DATABASE_URL: process.env.DATABASE_URL,
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
	async headers() {
		return [
			{
				// співставлення всіх API-маршрутів
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{
						key: 'Access-Control-Allow-Origin',
						// value: 'https://localhost:3001',
						// value: 'https://dvzh.tech',
						value: '*',
					}, // замініть це на список довірених доменів, з яких можна зробити запити
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,DELETE,PATCH,POST,PUT',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		];
	},
};

export default nextConfig;
