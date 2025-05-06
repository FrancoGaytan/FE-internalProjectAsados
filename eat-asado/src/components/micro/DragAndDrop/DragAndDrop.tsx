import { JSX, useEffect, useRef } from 'react';

interface IDragAndDrop {
	children: JSX.Element;
	setState: Function;
}

export default function DragAndDrop(props: IDragAndDrop) {
	const dropRef = useRef<HTMLDivElement>(null);

	function onUpload(files: FileList) {
		props.setState(files[0]);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();

		const dataTransfer = e.dataTransfer as DataTransfer;

		const files = dataTransfer.files;
		if (files?.length) {
			onUpload(files);
		}
	}

	useEffect(() => {
		dropRef.current?.addEventListener('dragover', handleDragOver);
		dropRef.current?.addEventListener('drop', handleDrop);

		return () => {
			dropRef.current?.removeEventListener('dragover', handleDragOver);

			// eslint-disable-next-line react-hooks/exhaustive-deps
			dropRef.current?.removeEventListener('drop', handleDrop);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div ref={dropRef}>{props.children}</div>;
}
