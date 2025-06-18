import { getOrigin } from '@/lib/utils';

export const uploadFile = async (
	formData: FormData,
	endpoint: string,
	folder: string,
) => {
	const url = `${getOrigin()}${endpoint}`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: formData,
			headers: {
				'X-Upload-Folder': folder,
			},
		});
		const data = await response.json();

		return data;
	} catch (error) {
		console.log('error', error);

		return { errors: [error] };
	}
};
