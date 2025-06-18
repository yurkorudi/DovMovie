import { NextRequest } from 'next/server';
import { uploadFile } from '@/lib/uploads';

export async function POST(request: NextRequest) {
	const folder = request.headers.get('X-Upload-Folder') || 'any';
	// const uniqueName = nanoid(32);
	//
	// const form = await request.formData();
	// const file = form.get('files') as File;
	// const extension = file.name.split('.').pop();
	// const fileName = `${uniqueName}.${extension}`;
	//
	// const blob = await put(`${folder}/${fileName}`, file, {
	// 	access: 'public',
	// });
	//
	// return NextResponse.json(blob, { status: 201 });

	return await uploadFile(request, folder!);
}
