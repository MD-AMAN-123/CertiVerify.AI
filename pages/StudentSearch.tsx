import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, ShieldCheck, Clock } from 'lucide-react';

interface StudentSearchProps {
  onFound: (id: string) => void;
}

export const StudentSearch: React.FC<StudentSearchProps> = ({ onFound }) => {
  const { getCertificateById } = useData();
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const cert = getCertificateById(searchId.trim());
    if (cert) {
      onFound(cert.id);
    } else {
      setError('Certificate not found. Please check the ID and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Verify Certificate</h1>
        <p className="text-slate-500 mb-8 text-lg">
          Enter the unique Certificate ID provided on the document to verify its authenticity and view details.
        </p>
        
        <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-8">
          <input
            type="text"
            value={searchId}
            onChange={(e) => { setSearchId(e.target.value); setError(''); }}
            className="w-full pl-6 pr-32 py-4 rounded-full border-2 border-slate-200 shadow-sm text-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors"
            placeholder="e.g., CERT-2024-001"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-full transition-colors flex items-center"
          >
            Verify
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-left max-w-lg mx-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <ShieldCheck className="text-green-500 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-700">Secure Verification</h4>
              <p className="text-sm text-slate-500 mt-1">Data matches our encrypted records.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <Clock className="text-blue-500 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-700">Instant Results</h4>
              <p className="text-sm text-slate-500 mt-1">Real-time retrieval from database.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
