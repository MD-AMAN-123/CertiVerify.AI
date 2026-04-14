import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login } = useData();
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === UserRole.ADMIN) {
      if (username === 'admin' && password === 'admin') {
        login(UserRole.ADMIN);
        onLoginSuccess();
      } else {
        setError('Invalid admin credentials. Try admin/admin');
      }
    } else {
      // For students, we just simulate login for now
      if (username) {
        login(UserRole.STUDENT, username); // treating username as email for simplicity
        onLoginSuccess();
      } else {
        setError('Please enter your email');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-blue-100 mt-2">Sign in to access your dashboard</p>
        </div>

        <div className="p-8">
          <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === UserRole.ADMIN ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole(UserRole.ADMIN)}
            >
              Admin
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === UserRole.STUDENT ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole(UserRole.STUDENT)}
            >
              Student
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === UserRole.ADMIN ? 'Username' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={role === UserRole.ADMIN ? "text" : "email"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={role === UserRole.ADMIN ? "admin" : "student@example.com"}
                />
              </div>
            </div>

            {role === UserRole.ADMIN && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          {role === UserRole.ADMIN && (
            <p className="mt-4 text-center text-xs text-gray-400">
              Demo Credentials: admin / admin
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
