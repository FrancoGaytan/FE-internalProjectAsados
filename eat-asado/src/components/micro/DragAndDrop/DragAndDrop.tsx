import { Dispatch, ReactElement, SetStateAction, useEffect, useRef } from 'react';
import { UserProfileInterface } from '../../../pages';

interface IDragAndDrop {
	children: ReactElement;
	setState: Function;
}

const DragAndDrop = (props: IDragAndDrop) => {
	const dropRef = useRef<HTMLDivElement>(null);

	const onUpload = (files: FileList) => {
		props.setState(files[0]);
	};

	useEffect(() => {
		dropRef.current?.addEventListener('dragover', handleDragOver);
		dropRef.current?.addEventListener('drop', handleDrop);

		return () => {
			dropRef.current?.removeEventListener('dragover', handleDragOver);
			dropRef.current?.removeEventListener('drop', handleDrop);
		};
	}, []);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const dataTransfer = e.dataTransfer as DataTransfer;

		const files = dataTransfer.files;
		if (files && files.length) {
			onUpload(files);
		}
	};

	return <div ref={dropRef}>{props.children}</div>;
};

export default DragAndDrop;
