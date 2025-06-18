import clsx from 'clsx';

const Divider = ({ className }: { className?: string }) => {
	return <div className={clsx(className, 'h-px bg-white/30')}></div>;
};

export default Divider;
