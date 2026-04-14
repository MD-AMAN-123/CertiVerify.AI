import React from 'react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface NavbarProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ setCurrentPage, currentPage }) => {
  const { user, logout } = useData();

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2 font-bold text-xl tracking-tight">CertiVerify AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'home' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('search')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'search' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              Verify ID
            </button>
            
            {user?.role === UserRole.ADMIN && (
               <>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setCurrentPage('ai-analysis')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'ai-analysis' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-slate-700 hover:text-white'}`}
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                  AI Tools
                </button>
               </>
            )}

            {user ? (
              <div className="flex items-center ml-4 pl-4 border-l border-slate-700">
                <span className="text-sm text-slate-400 mr-3">{user.username}</span>
                <button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs uppercase font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
               <button 
                  onClick={() => setCurrentPage('login')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md text-sm font-bold shadow-md transition-colors"
                >
                  Admin Login
                </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};