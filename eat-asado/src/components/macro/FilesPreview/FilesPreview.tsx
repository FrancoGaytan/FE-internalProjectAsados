import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';

interface FilesPreviewProps {
	doc: { uri: string; fileType: string; fileName: string }[];
	state: boolean;
	onClose: () => void;
}

const FilesPreview: React.FC<FilesPreviewProps> = ({ doc, state, onClose }) => {
	const imageRef = useRef<HTMLImageElement>(null);
	const [imageHeight, setImageHeight] = useState<number | null>(null);
	const [currentDoc, setCurrentDoc] = useState<IDocument[]>([
		{
			uri: doc[0]?.uri || '',
			fileType: 'png',
			fileName: 'File Viewer'
		}
	]);

	useEffect(() => {
		if (doc && doc.length > 0) {
			setCurrentDoc([
				{
					uri: doc[0].uri,
					fileType: doc[0].fileType,
					fileName: doc[0].fileName
				}
			]);
		}
	}, [doc]);

	useEffect(() => {
		if (imageRef.current && imageRef.current.complete) {
			setImageHeight(imageRef.current.naturalHeight);
		}
	}, [doc]);

	return (
		<div className={styles.mainContent} style={{ height: imageHeight ? `${Math.min(imageHeight, 600)}px` : 'auto' }}>
			<button onClick={onClose} className={styles.closeButton}>
				✕
			</button>
			{doc[0].fileType === 'png' || doc[0].fileType === 'jpg' ? (
				<img
					ref={imageRef}
					src={doc[0].uri}
					alt={doc[0].fileName}
					onLoad={() => setImageHeight(imageRef.current?.naturalHeight || 300)}
					style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
				/>
			) : (
				<DocViewer
					documents={currentDoc}
					pluginRenderers={DocViewerRenderers}
					className="my-doc-viewer-style"
					theme={{
						primary: '#5296d8',
						secondary: '#ffffff',
						tertiary: '#5296d899',
						textPrimary: '#ffffff',
						textSecondary: '#5296d8',
						textTertiary: '#00000099',
						disableThemeScrollbar: false
					}}
				/>
			)}
		</div>
	);
};

export default FilesPreview;
