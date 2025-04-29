
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt: string;
  deadline?: string;
  brandDefinition: BrandDefinition;
  responses: TaskResponse[];
}

export interface BrandDefinition {
  companyName: string;
  industry: string;
  targetAudience: string;
  companyValues: string[];
  tone: string;
  additionalInfo?: string;
}

export interface TaskResponse {
  id: string;
  candidateName: string;
  responseContent: string;
  submittedAt: string;
  aiAnalysis?: AiAnalysis;
}

export interface AiAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  fitToBrand: number;
  creativityScore: number;
  technicalAccuracy: number;
  summary: string;
}

export interface DashboardStats {
  activeTasks: number;
  completedTasks: number;
  totalCandidates: number;
  averageScore: number;
}
