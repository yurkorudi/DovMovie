import { useEffect, useState } from 'react';

const useSkeletonState = (data: any[] | null | undefined) => {
	const [state, setState] = useState(false);

	useEffect(() => {
		if (!data?.length) setState(true);
		else setState(false);
		const timer = setTimeout(() => {
			setState(false);
		}, 15000);

		return () => clearTimeout(timer);
	}, [data]);

	return state;
};

export default useSkeletonState;
