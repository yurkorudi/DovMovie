import React from 'react';
import { nanoid } from 'nanoid';

const Annotations = ({ annotations }: { annotations: string[] }) => {
	return (
		<div className='flex flex-col'>
			{annotations.map((annotation, index) => (
				<div key={nanoid()} className='flex text-xs text-slate-400'>
					<span className='mr-2 inline-block text-sm'>
						{new Array(index + 1).fill(index + 1).map(() => (
							<span key={nanoid()}>*</span>
						))}
					</span>
					<span>{annotation}</span>
				</div>
			))}
		</div>
	);
};

export default Annotations;
