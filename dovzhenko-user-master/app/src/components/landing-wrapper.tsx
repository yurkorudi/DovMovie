'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const LandingWrapper = ({ children }: PropsWithChildren) => {
	const searchParams = useSearchParams();

	useEffect(() => {
		const id = searchParams.get('scrollTo');

		if (id) {
			const target = document.getElementById(`${id}`);

			if (target) {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, []);

	return children;
};

export default LandingWrapper;
