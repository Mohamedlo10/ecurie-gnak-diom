interface PdfViewerProps {
	pdfUrl: string;
}
function PdfViewer({ pdfUrl }: PdfViewerProps) {
	return (
		<iframe
			src={pdfUrl}
			style={{ width: "90%", height: "280px" }}
			title="PDF Viewer"
		/>
	);
} 

export default PdfViewer;
