export const createUrlSearchParams = (data: Record<string, any>) => {
	const searchParams = new URLSearchParams();
	Object.entries(data).forEach(([key, value]) => {
		if (typeof value === 'object') {
			if (value?.name) {
				searchParams.append(key, value.name);
			}

			if (key === 'startTime') {
				searchParams.append(key, value);
			}

			return;
		}

		searchParams.append(key, value);
	});

	return searchParams.toString();
};

export const parseSearchParams = (search: string) => {
	const searchParams = new URLSearchParams(search);
	const data: Record<string, any> = {};
	searchParams.forEach((value, key) => {
		data[key] = value;
	});

	return data;
};
