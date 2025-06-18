import { z } from 'zod';

export const baseImageSchema = {
	image: z
		.any()
		.transform((val) => (val ? val : null))
		.refine((value) => {
			if (!value) return true;

			// Validation for image data if provided as base64 encoded string
			if (typeof value === 'string' && value.startsWith('data:image/')) {
				// Extracting the base64 part of the image data
				const base64Data = value.split(',')[1];
				// Calculating the size of the base64 data in bytes
				const fileSizeInBytes = (base64Data.length * 3) / 4 - 2;

				// Checking if the file size exceeds 50 MB
				const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB in bytes

				if (fileSizeInBytes > maxSizeInBytes) {
					return false; // Validation fails if the file size exceeds the maximum
				}
			}

			// If it's not base64 encoded or within size limits, consider it valid
			return true;
		}, 'Ви не додали зображення або перевищенно розмір у 10 МБ'),
};
