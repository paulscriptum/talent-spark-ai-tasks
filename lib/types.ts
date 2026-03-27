export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'active' | 'completed'
  deadline: string | null
  created_at: string
  updated_at: string
  // Brand definition fields
  company_name: string | null
  industry: string | null
  target_audience: string | null
  company_values: string[] | null
  tone: string | null
  additional_info: string | null
  role: string | null
  level: 'junior' | 'middle' | 'senior' | null
  // Public sharing
  public_id: string | null
  is_public: boolean
  // Relations
  sections?: TaskSection[]
  responses?: TaskResponse[]
}

export interface TaskSection {
  id: string
  task_id: string
  title: string
  content: string | null
  type: 'requirements' | 'deliverables' | 'evaluation' | 'time' | 'note' | 'text'
  sort_order: number
  created_at: string
}

export interface TaskResponse {
  id: string
  task_id: string
  candidate_name: string
  candidate_email: string | null
  response_content: string
  submitted_at: string
  // AI Analysis fields
  overall_score: number | null
  fit_to_brand: number | null
  creativity_score: number | null
  technical_accuracy: number | null
  strengths: string[] | null
  weaknesses: string[] | null
  ai_summary: string | null
  // Relations
  attachments?: FileAttachment[]
}

export interface FileAttachment {
  id: string
  task_id: string | null
  response_id: string | null
  file_name: string
  file_size: number | null
  file_type: string | null
  storage_path: string
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  company_name: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  activeTasks: number
  completedTasks: number
  totalCandidates: number
  averageScore: number
}

export interface BrandDefinition {
  companyName: string
  industry: string
  targetAudience: string
  companyValues: string[]
  tone: string
  additionalInfo?: string
  role: string
  level: 'junior' | 'middle' | 'senior'
}

export interface AiAnalysis {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  fitToBrand: number
  creativityScore: number
  technicalAccuracy: number
  summary: string
}
