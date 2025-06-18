import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

const SmallInnerContainer = ({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) => {
	return (
		<div className={clsx(className, 'small-container mx-auto max-w-[1110px]')}>
			{children}
		</div>
	);
};

export default SmallInnerContainer;
