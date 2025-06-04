export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt: string;
  deadline?: string;
  brandDefinition: BrandDefinition;
  responses: TaskResponse[];
  sections?: TaskSection[];
}

export interface TaskSection {
  id: string;
  title: string;
  content: string;
  type: 'requirements' | 'deliverables' | 'evaluation' | 'time' | 'note' | 'text';
}

export interface BrandDefinition {
  companyName: string;
  industry: string;
  targetAudience: string;
  companyValues: string[];
  tone: string;
  additionalInfo?: string;
  role: string;
  level: 'junior' | 'middle' | 'senior';
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 encoded file data for localStorage
}

export interface TaskResponse {
  id: string;
  candidateName: string;
  responseContent: string;
  submittedAt: string;
  aiAnalysis?: AiAnalysis;
  attachments?: FileAttachment[];
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
