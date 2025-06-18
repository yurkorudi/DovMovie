import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { put } from '@vercel/blob';

export const uploadFile = async (req: NextRequest, folder: string) => {
	try {
		const form = await req.formData();
		const file = form.get('files') as File;
		const contentType = req.headers.get('content-type') || '';

		if (!file) {
			return NextResponse.json({ error: 'No file provided' });
		}

		const uniqueName = nanoid(32);
		const fileName = `${uniqueName}.webp`;

		// Read file as buffer
		const fileBuffer = await file.arrayBuffer();

		// Transforming image to WebP format and reducing size
		const image = await sharp(fileBuffer)
			.webp({ quality: 90 }) // Adjust quality as needed
			.toBuffer();

		const blob = await put(`${folder}/${fileName}`, image, {
			contentType,
			access: 'public',
		});

		if (!blob) {
			return NextResponse.json({
				status: 500,
				errors: [
					{
						message: 'Failed to upload file.',
						blob,
					},
				],
			});
		}

		return NextResponse.json(blob);
	} catch (e) {
		console.error('Error:', e);

		return NextResponse.json({
			status: 500,
			errors: [
				{
					message: 'Failed to upload file.',
					error: e,
				},
			],
		});
	}
};
