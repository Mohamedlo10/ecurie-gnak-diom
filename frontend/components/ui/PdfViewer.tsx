import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  return (
    <a 
    href={pdfUrl}
     target="_blank"
    rel="noopener noreferrer"
    className="w-3/4 max-h-48 border rounded-xl hover:opacity-70 border-gray-300">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer fileUrl={pdfUrl} />
      </Worker>
  {/*     <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 block text-center"
      >
        Ouvrir en plein écran
      </a> */}
    </a>
  );
};

export default PdfViewer;
