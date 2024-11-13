import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';

interface FilesPreviewProps {
	doc: { uri: string; fileType: string; fileName: string }[]; // Cambia los tipos si tienes una estructura diferente
	state: boolean;
}

const FilesPreview: React.FC<FilesPreviewProps> = ({ doc, state }) => {
	const [currentState, setCurrentState] = useState(state);
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
					fileType: 'png',
					fileName: 'File Viewer'
				}
			]);
			setCurrentState(true);
		}
	}, []);

	return (
		<div style={!currentState ? { display: 'none' } : { display: 'inline' }} className={styles.mainContent}>
			<button
				onClick={() => {
					setCurrentState(false);
				}}>
				X
			</button>
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
		</div>
	);
};

export default FilesPreview;
