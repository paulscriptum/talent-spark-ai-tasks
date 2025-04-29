
import { Task, BrandDefinition, TaskResponse, AiAnalysis, DashboardStats } from '../types';

// Mock data - this would be replaced by actual API calls in a real application
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Marketing Campaign Design',
    description: 'Create a comprehensive marketing campaign for our new product launch aimed at increasing brand awareness and driving initial sales.',
    status: 'active',
    createdAt: '2025-04-25T10:30:00Z',
    deadline: '2025-05-10T23:59:59Z',
    brandDefinition: {
      companyName: 'EcoTech Solutions',
      industry: 'Sustainable Technology',
      targetAudience: 'Environment-conscious consumers, 25-45 years old',
      companyValues: ['Sustainability', 'Innovation', 'Transparency'],
      tone: 'Professional but approachable',
    },
    responses: [
      {
        id: '101',
        candidateName: 'Alex Johnson',
        responseContent: 'The proposed marketing campaign focuses on highlighting the eco-friendly aspects of the product through social media storytelling and partnerships with environmental influencers...',
        submittedAt: '2025-04-27T14:20:00Z',
        aiAnalysis: {
          overallScore: 85,
          strengths: ['Strong alignment with brand values', 'Creative approach to storytelling', 'Well-defined target audience segmentation'],
          weaknesses: ['Limited focus on technical specifications', 'Could improve on ROI projections'],
          fitToBrand: 90,
          creativityScore: 85,
          technicalAccuracy: 75,
          summary: 'This response demonstrates a strong understanding of brand values and target audience, with creative approaches to campaign execution. Some improvement needed in technical aspects and ROI forecasting.',
        }
      },
      {
        id: '102',
        candidateName: 'Sam Rivera',
        responseContent: 'I recommend a multi-channel approach that emphasizes the innovation behind the product while educating consumers about its environmental benefits...',
        submittedAt: '2025-04-28T09:15:00Z',
        aiAnalysis: {
          overallScore: 78,
          strengths: ['Good technical understanding of the product', 'Comprehensive channel strategy'],
          weaknesses: ['Could better align with company values', 'Message lacks emotional appeal'],
          fitToBrand: 75,
          creativityScore: 70,
          technicalAccuracy: 90,
          summary: 'A technically sound proposal with good channel diversity but could improve on emotional connection and alignment with brand values.',
        }
      }
    ]
  },
  {
    id: '2',
    title: 'UX Design Challenge',
    description: 'Design a user-friendly interface for our mobile application that aligns with our brand identity while solving key user pain points.',
    status: 'active',
    createdAt: '2025-04-22T15:45:00Z',
    deadline: '2025-05-05T23:59:59Z',
    brandDefinition: {
      companyName: 'Simplify',
      industry: 'Productivity Software',
      targetAudience: 'Busy professionals, remote workers',
      companyValues: ['Simplicity', 'Efficiency', 'User-centered'],
      tone: 'Friendly and minimalist',
    },
    responses: []
  }
];

const mockDashboardStats: DashboardStats = {
  activeTasks: 2,
  completedTasks: 5,
  totalCandidates: 12,
  averageScore: 82
};

// In a real app, this would be API calls to a backend server
export const taskService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return mockDashboardStats;
  },

  getAllTasks: async (): Promise<Task[]> => {
    return mockTasks;
  },

  getTaskById: async (id: string): Promise<Task | undefined> => {
    return mockTasks.find(task => task.id === id);
  },

  generateTask: async (brandDefinition: BrandDefinition): Promise<Task> => {
    // This would call the backend which would use ChatGPT API
    // For now, we'll return a mock response
    
    const newTask: Task = {
      id: `${Date.now()}`, // Use actual UUID in production
      title: `${brandDefinition.companyName} Task`,
      description: `This task was generated for ${brandDefinition.companyName} in the ${brandDefinition.industry} industry, targeting ${brandDefinition.targetAudience}. The task would be written with a ${brandDefinition.tone} tone and would reflect the values of ${brandDefinition.companyValues.join(', ')}.`,
      status: 'active',
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
      brandDefinition,
      responses: []
    };
    
    mockTasks.unshift(newTask);
    return newTask;
  },

  analyzeResponse: async (taskId: string, response: TaskResponse): Promise<AiAnalysis> => {
    // This would call the backend which would use ChatGPT API
    // For now, we'll return a mock analysis
    
    const mockAnalysis: AiAnalysis = {
      overallScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      strengths: ['Strong understanding of requirements', 'Creative approach'],
      weaknesses: ['Could improve on specificity', 'Some alignment issues with brand values'],
      fitToBrand: Math.floor(Math.random() * 30) + 70,
      creativityScore: Math.floor(Math.random() * 30) + 70,
      technicalAccuracy: Math.floor(Math.random() * 30) + 70,
      summary: `This response demonstrates decent understanding of the task and brand values. There are some creative elements, but improvements could be made in specific areas.`
    };
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const responseWithAnalysis = { ...response, aiAnalysis: mockAnalysis };
      mockTasks[taskIndex].responses.push(responseWithAnalysis);
      return mockAnalysis;
    }
    
    return mockAnalysis;
  }
};
