import React, { PropsWithChildren } from 'react';

const LargeContainer = ({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) => {
	return (
		<div
			className={`large-container mx-auto w-full px-[30px] sm:px-[60px] 2xl:max-w-[calc(1920px-260px)] 2xl:px-0 ${className ? className : ''}`}
		>
			{children}
		</div>
	);
};

export default LargeContainer;
