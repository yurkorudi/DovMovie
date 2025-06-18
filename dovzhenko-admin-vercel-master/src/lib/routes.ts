import { headers } from 'next/headers';

type TProps = {
	matchAllowedRoutes: (routes: string[]) => boolean;
	pathname: string | null;
	searchParams: any;
};

export const useServerPathname = (): TProps => {
	const header = headers();
	const pathname = header.get('x-url');
	const searchParams = header.get('x-search');

	const convertSearchParams = (searchParams: string) => {
		const searchParamsArray = searchParams.split('?')[1].split('&');
		const searchParamsObject = searchParamsArray.reduce(
			(acc, curr) => {
				const [key, value] = curr.split('=');
				acc[key] = value;

				return acc;
			},
			{} as { [key: string]: string },
		);

		return searchParamsObject;
	};

	const matchAllowedRoutes = (routes: string[]) => routes.includes(pathname!);

	return {
		matchAllowedRoutes,
		pathname,
		searchParams: (searchParams && convertSearchParams(searchParams)) || null,
	};
};
