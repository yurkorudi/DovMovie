import { ChangeEvent } from 'react';

export const handleImageChange = (
	e: ChangeEvent<HTMLInputElement>,
	setImagePreview: (preview: string | null) => void,
) => {
	const file = e.target.files?.[0];

	if (!file) {
		setImagePreview(null);

		return;
	}

	const reader = new FileReader();

	reader.onload = () => {
		setImagePreview(reader.result as string);
	};

	reader.readAsDataURL(file);
};
