import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { UserRole, Certificate, Student } from '../types';
import { Upload, FileText, Users, Settings, Plus, Trash2, Download, Search, CheckCircle, AlertCircle, Loader2, Award } from 'lucide-react';
import * as XLSX from 'xlsx';
import { cleanStudentData } from '../services/geminiService';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { user, certificates, students, addCertificate, bulkAddCertificates, addStudent, bulkAddStudents, deleteCertificate, config, updateConfig } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'certificates' | 'settings'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Certificates Issued', value: certificates.length, icon: Award, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Pending Verifications', value: '0', icon: AlertCircle, color: 'bg-amber-100 text-amber-600' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Clean data with Gemini
      const cleanedData = await cleanStudentData(jsonData);

      // Map to Student interface
      const newStudents: Student[] = cleanedData.map((row: any, index: number) => ({
        id: row.id || `STU-${Date.now()}-${index}`,
        name: row.name || row.StudentName || "Unknown",
        email: row.email || row.Email || "",
        course: row.course || row.Course || "General",
        completionDate: row.completionDate || row.CompletionDate || new Date().toISOString().split('T')[0],
        grade: row.grade || row.Grade
      }));

      bulkAddStudents(newStudents);
      setUploadStatus({ type: 'success', message: `Successfully imported ${newStudents.length} students.` });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({ type: 'error', message: "Failed to process file. Please ensure it's a valid Excel/CSV." });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateCertificateForStudent = (student: Student) => {
    const newCert: Certificate = {
      id: `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      studentName: student.name,
      studentEmail: student.email,
      domain: student.course,
      startDate: "2024-01-01", // Placeholder logic
      endDate: student.completionDate,
      issueDate: new Date().toISOString().split('T')[0],
      grade: student.grade
    };
    addCertificate(newCert);
  };

  const generateAllCertificates = () => {
    const newCerts = students
      .filter(s => !certificates.some(c => c.studentName === s.name && c.domain === s.course)) // Avoid duplicates
      .map(student => ({
        id: `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000) + Math.floor(Math.random() * 100)}`,
        studentName: student.name,
        studentEmail: student.email,
        domain: student.course,
        startDate: "2024-01-01",
        endDate: student.completionDate,
        issueDate: new Date().toISOString().split('T')[0],
        grade: student.grade
      }));
    
    bulkAddCertificates(newCerts);
    alert(`Generated ${newCerts.length} new certificates.`);
  };

  if (user?.role !== UserRole.ADMIN) {
    return <div className="p-8 text-center text-red-500">Access Denied. Admin only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage students, certificates, and system settings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'students' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'certificates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Certificates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Settings
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Actions</h3>
                <div className="flex gap-4">
                  <button onClick={() => setActiveTab('students')} className="bg-white text-blue-600 px-4 py-2 rounded-md shadow-sm border border-blue-200 hover:bg-blue-50 font-medium flex items-center gap-2">
                    <Users size={18} /> Manage Students
                  </button>
                  <button onClick={() => setActiveTab('certificates')} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 font-medium flex items-center gap-2">
                    <Award size={18} /> Issue Certificates
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Certificates</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {certificates.slice(-5).reverse().map((cert) => (
                        <tr key={cert.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.domain}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.issueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Student Management</h3>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    {isUploading ? 'Processing...' : 'Import CSV/Excel'}
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={18} /> Add Student
                  </button>
                </div>
              </div>

              {uploadStatus && (
                <div className={`mb-4 p-4 rounded-md ${uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {uploadStatus.message}
                </div>
              )}

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.completionDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => generateCertificateForStudent(student)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Generate Cert
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No students found. Import data to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Issued Certificates</h3>
                <button 
                  onClick={generateAllCertificates}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Award size={18} /> Generate All Pending
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {cert.id}
                      </div>
                      <button 
                        onClick={() => deleteCertificate(cert.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900">{cert.studentName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{cert.domain}</p>
                    <div className="text-xs text-gray-500 flex justify-between mt-4 pt-4 border-t border-gray-100">
                      <span>Issued: {cert.issueDate}</span>
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={12} /> Valid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">System Settings</h3>
              
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Certificate Theme Color</h4>
                <div className="flex gap-4">
                  {['amber', 'blue', 'emerald', 'rose', 'indigo'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateConfig({ theme: color as any })}
                      className={`w-12 h-12 rounded-full border-2 ${config.theme === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-transparent'} flex items-center justify-center`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-${color}-500`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Data Management</h4>
                <p className="text-sm text-gray-500 mb-4">Clear all local data. This cannot be undone.</p>
                <button 
                  onClick={() => {
                    if(confirm("Are you sure? This will wipe all data.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="text-red-600 border border-red-200 bg-white px-4 py-2 rounded hover:bg-red-50 text-sm font-medium"
                >
                  Reset System Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon component removed as we are using lucide-react
