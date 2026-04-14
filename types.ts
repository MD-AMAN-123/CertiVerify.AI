export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface Certificate {
  id: string;
  studentName: string;
  domain: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  grade?: string;
  description?: string;
}

export type ThemeColor = 'amber' | 'blue' | 'emerald' | 'rose' | 'indigo';

export interface AppConfig {
  logoUrl?: string;
  theme: ThemeColor;
}

export interface User {
  username: string;
  role: UserRole;
}

export interface GeminiResponse {
  text: string;
  confidence?: number;
  extractedData?: Partial<Certificate>;
}

export enum ThinkingLevel {
  LOW = 0,
  HIGH = 16000 // Mapping high thinking level to a high token budget
}