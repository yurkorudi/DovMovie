import { EDeleteMode } from '@/lib/types/common';

export const isProduction = process.env.NODE_ENV === 'production';

export const defineDeleteMode = (
	mode: EDeleteMode,
	callback: () => void,
	secondCallback: () => void,
) => (mode === EDeleteMode.ONE ? callback : secondCallback);
