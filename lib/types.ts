export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  category: 'development' | 'design' | 'writing' | 'analysis' | 'research' | 'other'
  difficulty: 'junior' | 'middle' | 'senior' | 'lead'
  status: 'draft' | 'published' | 'archived'
  estimated_time: string | null
  created_at: string
  updated_at: string
  // Relations
  task_sections?: TaskSection[]
  task_responses?: TaskResponse[]
}

export interface TaskSection {
  id: string
  task_id: string
  title: string
  content: string
  order_index: number
  created_at: string
}

export interface TaskResponse {
  id: string
  task_id: string
  candidate_name: string
  candidate_email: string
  content: string
  status: 'submitted' | 'reviewed' | 'rejected'
  score: number | null
  evaluation: Record<string, unknown> | null
  created_at: string
  updated_at: string
  // Relations
  file_attachments?: FileAttachment[]
}

export interface FileAttachment {
  id: string
  response_id: string
  file_name: string
  file_url: string
  file_size: number | null
  file_type: string | null
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalTasks: number
  publishedTasks: number
  totalResponses: number
}

export interface GeneratedTaskOutput {
  title: string
  description: string
  category: string
  difficulty: string
  estimatedTime: string
  sections: {
    title: string
    content: string
    orderIndex: number
  }[]
}

export interface EvaluationOutput {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  detailedFeedback: string
  recommendations: string[]
  skillAssessment: {
    technicalSkills: number | null
    problemSolving: number | null
    codeQuality: number | null
    communication: number | null
    creativity: number | null
  }
}
