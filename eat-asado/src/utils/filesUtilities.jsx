import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

function PreviewFiles({ file }) {
	// Estado para el documento activo
	const [activeDocument, setActiveDocument] = useState(null);

	useEffect(() => {
		// Solo ejecuta si `file` no es null y tiene una propiedad `name`
		if (file && file.name) {
			setActiveDocument({
				uri: URL.createObjectURL(file),
				fileName: file.name
			});
		}
	}, [file]);

	const handleDocumentChange = doc => {
		setActiveDocument(doc);
	};

	return (
		<div>
			{activeDocument ? (
				<DocViewer
					documents={[activeDocument]} // Solo un documento en la lista
					activeDocument={activeDocument}
					onDocumentChange={handleDocumentChange}
					pluginRenderers={DocViewerRenderers}
					style={{ height: 400, width: '100%' }}
				/>
			) : (
				<p>Cargando vista previa...</p>
			)}
		</div>
	);
}

export default PreviewFiles;
