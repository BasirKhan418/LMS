"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { saveAs } from 'file-saver';
import { 
  Download, 
  Award, 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Medal, 
  ScrollText, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const CourseCompletionCertificate = ({name, impid, courseTitle}) => {
  const completionDate = new Date().toLocaleDateString('en-US', {});
  
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pdfSupport, setPdfSupport] = useState(true);
  const pdfContainerRef = useRef(null);
  const iframeRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    const checkPdfSupport = () => {
      const hasPdfSupport = !!window.navigator.pdfViewerEnabled || typeof window.PDFJS !== 'undefined';
      setPdfSupport(hasPdfSupport);
    };
    checkPdfSupport();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    generateCertificate();
  }, []);

  async function modifyPdf(existingPdfBytes, name, title) {
    try {
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);
      
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();
      
      const fontBytes = await fetch('/font2.ttf').then(res => res.arrayBuffer());
      const customFont = await pdfDoc.embedFont(fontBytes);
      
      const fontBytes1 = await fetch('/font4.ttf').then(res => res.arrayBuffer());
      const customFont1 = await pdfDoc.embedFont(fontBytes1);
      
      firstPage.drawText(`${name}`, {
        x: 420,
        y: height - 242,
        size: 18,
        font: customFont,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(`${title}`, {
        x: 335,
        y: height - 157,
        size: 18,
        font: customFont,
        color: rgb(0, 0, 0),
      });
      
      return await pdfDoc.save();
    } catch (err) {
      setError('Error modifying PDF: ' + err.message);
      return null;
    }
  }

  const generateCertificate = async () => {
    setIsLoading(true);
    try {
      const pdfFile = await fetch('/tr.pdf').then((res) => res.arrayBuffer());
      const pdfBytes = await modifyPdf(pdfFile, name, courseTitle);
      
      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
        
        setPdfUrl(url);
      }
    } catch (err) {
      setError('Error generating certificate: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (pdfUrl) {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const filename = `cmptr_${name.replace(/\s+/g, '_')}_${impid}.pdf`;
        saveAs(blob, filename);
      } else {
        const pdfFile = await fetch('/tr.pdf').then((res) => res.arrayBuffer());
        const pdfBytes = await modifyPdf(pdfFile, name, courseTitle);
        
        if (pdfBytes) {
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const filename = `cmptr_${name.replace(/\s+/g, '_')}_${impid}.pdf`;
          saveAs(blob, filename);
        }
      }
    } catch (err) {
      setError('Error downloading PDF: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 px-3 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <ScrollText className="h-16 w-16 sm:h-20 sm:w-20 text-blue-600" />
              <Award className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 absolute -bottom-2 -right-2" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Course Completion Certificate
          </h1>
          <p className="mt-2 sm:mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
            Congratulations on successfully completing your course!
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden mb-6 sm:mb-8 max-w-4xl mx-auto border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-2" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Achievement Unlocked</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-5 lg:mb-0">
                <div className="flex flex-wrap items-center mb-2 sm:mb-3">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Certificate for: <span className="font-semibold">{name}</span></h3>
                </div>
                <div className="flex items-center mb-2 sm:mb-3">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                  <p className="text-xs sm:text-sm text-gray-600">ID: <span className="font-medium">{impid}</span></p>
                </div>
                <div className="flex items-center mb-2 sm:mb-3">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Course: <span className="font-medium">{courseTitle}</span></p>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                  <p className="text-xs sm:text-sm text-gray-600">Completed on: <span className="font-medium">{completionDate}</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                  disabled={isDownloading || isLoading}
                >
                  {isDownloading ? (
                    <span className="flex items-center">
                      <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Downloading...
                    </span>
                  ) : (
                    <>
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Download
                    </>
                  )}
                </button>
                
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                  disabled={isLoading}
                >
                  <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Certificate Preview</h2>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button 
                onClick={zoomOut}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                disabled={zoomLevel <= 50}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
              <span className="text-xs sm:text-sm text-gray-600">{zoomLevel}%</span>
              <button 
                onClick={zoomIn}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                disabled={zoomLevel >= 200}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
              {isMobile && (
                <button
                  onClick={resetZoom}
                  className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          <div className="p-2 sm:p-4">
            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm">{error}</span>
                </div>
                <button 
                  onClick={() => setError('')}
                  className="text-red-700 hover:text-red-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            <div 
              ref={pdfContainerRef}
              className="w-full bg-gray-50 rounded-lg overflow-hidden flex justify-center"
              style={{ 
                height: isMobile ? '50vh' : '70vh', 
                minHeight: isMobile ? '300px' : '400px'
              }}
            >
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">Loading your certificate...</p>
                  </div>
                </div>
              ) : pdfUrl && pdfSupport ? (
                <div className="pdf-container w-full h-full overflow-auto">
                  <div className="w-full h-full flex items-center justify-center">
                    <iframe
                      ref={iframeRef}
                      src={`${pdfUrl}#view=FitH`}
                      className="w-full h-full"
                      title="Certificate Preview"
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'center top',
                        width: isMobile ? `${11000 / zoomLevel}%` : `${10000 / zoomLevel}%`,
                        height: isMobile ? `${11000 / zoomLevel}%` : `${10000 / zoomLevel}%`,
                      }}
                    />
                  </div>
                </div>
              ) : isMobile && !pdfSupport ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Your browser does not support PDF rendering.
                  </p>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Open certificate in a new tab
                  </a>
                  <p className="text-xs text-gray-500 mt-2">
                    You can also download the certificate using the button above.
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500">Unable to load certificate preview</p>
                </div>
              )}
            </div>
            
            {isMobile && pdfSupport && (
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  Use pinch gestures or zoom controls to adjust view
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCompletionCertificate;