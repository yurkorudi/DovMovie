import { RotatingLines } from 'react-loader-spinner';
import * as React from 'react';
import { Button } from '@/components/ui/button';

const ButtonLoader = ({ disabled, children, type }: any) => {
	return (
		<Button type={type} disabled={disabled}>
			{children}
			{disabled ? (
				<span className='ml-2 inline-block'>
					<RotatingLines
						visible={true}
						width='25'
						strokeColor='#fff'
						strokeWidth='2'
						animationDuration='0.75'
						ariaLabel='rotating-lines-loading'
					/>
				</span>
			) : null}
		</Button>
	);
};

export default ButtonLoader;
