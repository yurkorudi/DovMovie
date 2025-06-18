'use client';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import 'react18-json-view/src/dark.css';

const JsonViewer = ({ json }: any) => {
	return (
		<div className='mx-auto mt-5 w-[60%] bg-black/85 p-5 shadow-inner'>
			<JsonView dark src={json} />
		</div>
	);
};

export default JsonViewer;
