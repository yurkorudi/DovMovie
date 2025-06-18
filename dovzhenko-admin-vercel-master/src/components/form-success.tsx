import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSuccessProps {
	message?: string;
	className?: string;
}

const FormSuccess = ({ message, className }: FormSuccessProps) => {
	if (!message) return null;

	return (
		<div
			className={cn(
				'flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500',
				className,
			)}
		>
			<CheckCircle className='h-4 w-4' />
			<p>{message}</p>
		</div>
	);
};

export default FormSuccess;
