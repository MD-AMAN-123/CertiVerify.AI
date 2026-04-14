import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certificate, User, UserRole, AppConfig, Student } from '../types';

interface DataContextType {
  user: User | null;
  certificates: Certificate[];
  students: Student[];
  config: AppConfig;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  addCertificate: (cert: Certificate) => void;
  bulkAddCertificates: (certs: Certificate[]) => void;
  addStudent: (student: Student) => void;
  bulkAddStudents: (students: Student[]) => void;
  getCertificateById: (id: string) => Certificate | undefined;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  deleteCertificate: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_CERTS: Certificate[] = [
  {
    id: "CERT-2024-001",
    studentName: "Alex Johnson",
    studentEmail: "alex@example.com",
    domain: "Full Stack Development",
    startDate: "2024-01-10",
    endDate: "2024-04-10",
    issueDate: "2024-04-15",
    description: "Demonstrated exceptional skills in React and Node.js."
  },
  {
    id: "CERT-2024-002",
    studentName: "Samantha Smith",
    studentEmail: "sam@example.com",
    domain: "Data Science",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    issueDate: "2024-05-05",
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('app_certificates');
    return saved ? JSON.parse(saved) : MOCK_CERTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('app_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('app_config');
    return saved ? JSON.parse(saved) : { theme: 'amber', logoUrl: undefined };
  });

  // Persist state changes to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('app_user', JSON.stringify(user));
    else localStorage.removeItem('app_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('app_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('app_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('app_config', JSON.stringify(config));
  }, [config]);

  const login = (role: UserRole, email?: string) => {
    const newUser = { 
      username: role === UserRole.ADMIN ? 'Admin User' : (email ? email.split('@')[0] : 'Student Guest'), 
      role,
      email 
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const addCertificate = (cert: Certificate) => {
    setCertificates(prev => [...prev, cert]);
  };

  const bulkAddCertificates = (certs: Certificate[]) => {
    setCertificates(prev => {
      // Filter out duplicates based on ID
      const newCerts = certs.filter(c => !prev.some(p => p.id === c.id));
      return [...prev, ...newCerts];
    });
  };

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const bulkAddStudents = (newStudents: Student[]) => {
    setStudents(prev => [...prev, ...newStudents]);
  };

  const getCertificateById = (id: string) => {
    return certificates.find(c => c.id.toLowerCase() === id.toLowerCase());
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <DataContext.Provider value={{ 
      user, 
      certificates, 
      students, 
      config, 
      login, 
      logout, 
      addCertificate, 
      bulkAddCertificates, 
      addStudent,
      bulkAddStudents,
      getCertificateById, 
      updateConfig,
      deleteCertificate
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
