import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentSearch } from './pages/StudentSearch';
import { CertificateView } from './pages/CertificateView';
import { AIVerification } from './pages/AIVerification';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onLoginSuccess={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <AdminDashboard />;
      case 'search':
        return <StudentSearch onFound={(id) => { setSelectedCertId(id); setCurrentPage('view-cert'); }} />;
      case 'view-cert':
        return selectedCertId ? <CertificateView certId={selectedCertId} onBack={() => setCurrentPage('search')} /> : <Home onNavigate={setCurrentPage} />;
      case 'ai-analysis':
        return <AIVerification />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;