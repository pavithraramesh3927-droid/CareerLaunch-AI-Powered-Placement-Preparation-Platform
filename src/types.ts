/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  readinessScore: number;
  plan: 'free' | 'pro';
  createdAt: string;
}

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    score: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    tech: string;
    description: string;
  }>;
  skills: string[];
  certifications: string[];
}

export interface Resume {
  id?: string;
  userId: string;
  content: ResumeData;
  atsScore?: number;
  gapAnalysis?: string[];
  feedback?: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  id?: string;
  userId: string;
  topic: string;
  score: number;
  total: number;
  questions: Array<{
    id: string;
    userAnswer: number;
    isCorrect: boolean;
  }>;
  timestamp: string;
}

export interface InterviewMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

export interface InterviewSession {
  id?: string;
  userId: string;
  type: 'Technical' | 'HR' | 'Mixed';
  transcript: InterviewMessage[];
  score?: number;
  feedback?: {
    accuracy: number;
    communication: number;
    confidence: number;
    general: string;
    modelAnswers: Array<{ q: string; a: string }>;
  };
  createdAt: string;
}

export interface GDSession {
  id?: string;
  userId: string;
  topic: string;
  transcript: Array<{ speaker: string; text: string }>;
  score?: number;
  feedback?: {
    argumentation: number;
    leadership: number;
    communication: number;
    summary: string;
  };
  createdAt: string;
}

export interface CompanyTracking {
  id?: string;
  name: string;
  status: 'Exploring' | 'Applying' | 'Interviewing' | 'Offered' | 'Rejected';
  notes: string;
  checklist: Array<{ task: string; done: boolean }>;
}
