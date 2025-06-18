import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
	const form = await req.formData();
	const name = form.get('name');
	const phone = form.get('phone');
	const text = form.get('text');
	const type = form.get('type');

	if (!name || !phone || !text || !type) {
		console.log('Missing name, phone or text');

		return NextResponse.json('Missing name, phone or text', { status: 400 });
	}

	if (
		typeof name !== 'string' ||
		typeof phone !== 'string' ||
		typeof type !== 'string' ||
		typeof text !== 'string'
	) {
		console.log('Invalid input type for name, phone, or text');

		return NextResponse.json(
			{ error: 'Invalid input type for name, phone, or text' },
			{ status: 400 },
		);
	}

	await db.message.create({
		data: {
			name,
			phone,
			type: Number(type),
			message: text,
		},
	});

	return NextResponse.json(
		{ message: 'Message created successfully' },
		{ status: 201 },
	);
};
