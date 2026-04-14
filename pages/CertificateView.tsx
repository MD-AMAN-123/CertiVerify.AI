import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { CertificateTemplate } from '../components/CertificateTemplate';
import { Download, ArrowLeft, Share2, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateViewProps {
  certId: string;
  onBack: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certId, onBack }) => {
  const { getCertificateById, config } = useData();
  const certificate = getCertificateById(certId);
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificate?.studentName}-Certificate.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h2>
          <p className="text-gray-500 mb-6">The certificate ID you requested does not exist.</p>
          <button onClick={onBack} className="text-blue-600 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="mb-8 flex justify-between items-center no-print">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Search
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
            >
              <Printer size={18} />
              Print
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="flex justify-center overflow-auto pb-12">
          <div className="shadow-2xl print:shadow-none">
            <CertificateTemplate 
              ref={certRef} 
              certificate={certificate} 
              config={config} 
            />
          </div>
        </div>

        {/* Verification Badge */}
        <div className="max-w-2xl mx-auto text-center no-print">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified Authentic Certificate
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            This certificate was digitally issued and verified by CertiVerify AI.
            ID: {certificate.id}
          </p>
        </div>
      </div>
    </div>
  );
};
