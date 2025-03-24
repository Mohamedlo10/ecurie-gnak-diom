interface PdfViewerProps {
	pdfUrl: string;
}
function PdfViewer({ pdfUrl }: PdfViewerProps) {
	return (
		<iframe
			src={pdfUrl}
			style={{ width: "100%", height: "350px" }}
			title="PDF Viewer"
		/>
	);
} 

export default PdfViewer;
