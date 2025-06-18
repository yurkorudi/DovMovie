import { usePathname } from 'next/navigation';

const useEditMode = () => {
	const pathname = usePathname();
	const isEditMode = pathname.includes('edit');

	return isEditMode;
};

export default useEditMode;
