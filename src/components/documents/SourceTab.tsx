// components/documents/SourceTab.jsx
"use client";
import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import SourceNotification from '@/components/notifications/SourceNotification';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const HighlightOverlay = ({ boundingBox, scale = 1 }) => {
  const { x, y, width, height } = boundingBox;
  
  return (
    <div
      className="absolute bg-green-200 opacity-40 pointer-events-none"
      style={{
        left: x * scale,
        top: y * scale,
        width: width * scale,
        height: height * scale,
      }}
    />
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SourceTab = ({
  selectedItem,
  activeReferenceIndex,
  onClearSelection,
  onPreviousReference,
  onNextReference,
  documents
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  
  // Initialize PDF.js worker
  useEffect(() => {
    const setPdfWorker = async () => {
      const pdfjs = await import('pdfjs-dist/build/pdf');
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    };
    setPdfWorker();
  }, []);

  const currentReference = selectedItem?.references?.[activeReferenceIndex];
  const currentDocument = currentReference 
    ? documents?.find(doc => doc.id === currentReference.doc_id)
    : null;

  // Get highlights for current page
  const getHighlightsForPage = (pageNum) => {
    if (!selectedItem?.references) return [];
    
    // Get all references for the current document
    const documentRefs = selectedItem.references.filter(ref => 
      ref.doc_id === currentDocument?.id
    );

    // Get all bounding boxes for the current page
    const highlights = [];
    documentRefs.forEach(ref => {
      if (ref.page === pageNum && Array.isArray(ref.boundingBoxes)) {
        highlights.push(...ref.boundingBoxes);
      }
    });

    return highlights;
  };

  // Load PDF file
  useEffect(() => {
    const loadPdf = async () => {
      if (!currentDocument?.url) {
        setError('No PDF URL provided');
        setIsLoading(false);
        return;
      }

      try {
        const pdfUrl = currentDocument.url.startsWith('http') 
          ? currentDocument.url 
          : currentDocument.url;

        if (!currentDocument.url.startsWith('http')) {
          const response = await fetch(pdfUrl);
          if (!response.ok) throw new Error('Failed to load PDF');
          const blob = await response.blob();
          setPdfFile(blob);
        } else {
          setPdfFile(pdfUrl);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(`Error loading PDF: ${err.message}`);
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [currentDocument]);

  useEffect(() => {
    if (currentReference?.page) {
      setPageNumber(currentReference.page);
    } else {
      setPageNumber(1);
    }
    setIsLoading(true);
  }, [currentReference]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Error loading PDF document');
    setIsLoading(false);
  };

  const onPageLoadSuccess = (page) => {
    const { width, height } = page.getViewport({ scale: 1 });
    setPdfDimensions({ width, height });
  };

  useEffect(() => {
    const container = document.getElementById('pdf-container');
    if (container && pdfDimensions.width) {
      const newScale = (container.offsetWidth - 48) / pdfDimensions.width;
      setScale(newScale);
    }
  }, [pdfDimensions.width]);

  if (!selectedItem) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        Select an item to view source document
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        No document found for this reference
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="flex-grow overflow-auto p-6" id="pdf-container">
        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="relative">
            {isLoading && <LoadingSpinner />}
            {pdfFile && (
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<LoadingSpinner />}
                className="max-w-full"
              >
                <Page
                  pageNumber={pageNumber}
                  onLoadSuccess={onPageLoadSuccess}
                  onRenderError={() => setError('Error rendering page')}
                  loading={<LoadingSpinner />}
                  scale={scale}
                  className="shadow-lg"
                >
                  {/* Only show highlights for the current page */}
                  {getHighlightsForPage(pageNumber).map((box, index) => (
                    <HighlightOverlay
                      key={index}
                      boundingBox={box}
                      scale={scale}
                    />
                  ))}
                </Page>
              </Document>
            )}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 border-t bg-white">
        <div className="flex items-center justify-center gap-4 p-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1 || isLoading}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 
                     text-green-800 border-green-800 hover:bg-green-50"
          >
            Previous Page
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
            disabled={pageNumber >= numPages || isLoading}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50
                     text-green-800 border-green-800 hover:bg-green-50"
          >
            Next Page
          </button>
        </div>

        <div className="p-4">
          {selectedItem && selectedItem.references?.length > 0 && (
            <SourceNotification
              message={`Reference ${activeReferenceIndex + 1} of ${selectedItem.references.length}`}
              onClose={onClearSelection}
              onPrevious={onPreviousReference}
              onNext={onNextReference}
              showNavigation={selectedItem.references.length > 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceTab;