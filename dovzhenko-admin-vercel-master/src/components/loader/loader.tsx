import { cn } from '@/lib/utils';

const Loader = ({
	isPending = true,
	visibleDefault = true,
	className,
}: {
	isPending?: boolean;
	visibleDefault?: boolean;
	className?: string;
}) => {
	return (
		<div
			className={cn('flex justify-center', className, {
				hidden: !isPending && visibleDefault,
			})}
		>
			<div className={'relative h-16 w-16'}>
				<div className='cssload-loader'>
					<div className='cssload-inner cssload-one'></div>
					<div className='cssload-inner cssload-two'></div>
					<div className='cssload-inner cssload-three'></div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
