import React, { forwardRef } from 'react';
import { Certificate, AppConfig } from '../types';
import { Award, CheckCircle } from 'lucide-react';

interface CertificateTemplateProps {
  certificate: Certificate;
  config: AppConfig;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ certificate, config }, ref) => {
    const getThemeColor = (color: string) => {
      switch (color) {
        case 'blue': return 'border-blue-600 text-blue-600';
        case 'emerald': return 'border-emerald-600 text-emerald-600';
        case 'rose': return 'border-rose-600 text-rose-600';
        case 'indigo': return 'border-indigo-600 text-indigo-600';
        default: return 'border-amber-600 text-amber-600';
      }
    };

    const getBgColor = (color: string) => {
      switch (color) {
        case 'blue': return 'bg-blue-50';
        case 'emerald': return 'bg-emerald-50';
        case 'rose': return 'bg-rose-50';
        case 'indigo': return 'bg-indigo-50';
        default: return 'bg-amber-50';
      }
    };

    const themeClass = getThemeColor(config.theme);
    const bgClass = getBgColor(config.theme);

    return (
      <div 
        ref={ref} 
        className={`w-[800px] h-[600px] p-8 mx-auto bg-white shadow-2xl relative overflow-hidden print:shadow-none`}
        style={{ fontFamily: "'Playfair Display', serif" }} // Using a serif font for elegance
      >
        {/* Border Design */}
        <div className={`w-full h-full border-[16px] ${themeClass} relative p-8 flex flex-col items-center justify-between`}>
          
          {/* Corner Ornaments */}
          <div className={`absolute top-0 left-0 w-24 h-24 border-r-4 border-b-4 ${themeClass} opacity-20 transform rotate-180`}></div>
          <div className={`absolute top-0 right-0 w-24 h-24 border-l-4 border-b-4 ${themeClass} opacity-20 transform rotate-180`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 border-r-4 border-t-4 ${themeClass} opacity-20 transform rotate-180`}></div>
          <div className={`absolute bottom-0 right-0 w-24 h-24 border-l-4 border-t-4 ${themeClass} opacity-20 transform rotate-180`}></div>

          {/* Header */}
          <div className="text-center mt-8">
            <div className="flex justify-center mb-4">
              <Award className={`w-16 h-16 ${themeClass.split(' ')[1]}`} />
            </div>
            <h1 className={`text-5xl font-bold uppercase tracking-widest ${themeClass.split(' ')[1]}`}>
              Certificate
            </h1>
            <h2 className="text-2xl font-light uppercase tracking-widest mt-2 text-gray-600">
              of Completion
            </h2>
          </div>

          {/* Content */}
          <div className="text-center flex-grow flex flex-col justify-center w-full max-w-2xl">
            <p className="text-lg text-gray-500 italic mb-2">This is to certify that</p>
            <h3 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2 mx-12">
              {certificate.studentName}
            </h3>
            <p className="text-lg text-gray-500 italic mb-2">has successfully completed the course</p>
            <h4 className={`text-3xl font-semibold ${themeClass.split(' ')[1]} mb-6`}>
              {certificate.domain}
            </h4>
            
            <div className="flex justify-center gap-8 text-gray-600 mb-6">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-400">Start Date</span>
                <span className="font-medium">{certificate.startDate}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-400">End Date</span>
                <span className="font-medium">{certificate.endDate}</span>
              </div>
            </div>

            {certificate.description && (
              <p className="text-gray-600 italic max-w-lg mx-auto text-sm">
                "{certificate.description}"
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="w-full flex justify-between items-end mt-8 px-12">
            <div className="text-center">
              <div className="w-40 border-b border-gray-400 mb-2"></div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Instructor Signature</p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full border-4 ${themeClass} flex items-center justify-center mb-2 opacity-80`}>
                <Award className={`w-10 h-10 ${themeClass.split(' ')[1]}`} />
              </div>
              <p className="text-xs text-gray-400">ID: {certificate.id}</p>
              <p className="text-xs text-gray-400">Issued: {certificate.issueDate}</p>
            </div>

            <div className="text-center">
              <div className="w-40 border-b border-gray-400 mb-2"></div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Director Signature</p>
            </div>
          </div>

        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';
