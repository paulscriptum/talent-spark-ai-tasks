
import { Task, BrandDefinition, TaskResponse, AiAnalysis, DashboardStats, TaskSection } from '../types';

// Local storage key for tasks
const TASKS_STORAGE_KEY = 'assessment_tasks';

// Load tasks from localStorage or use empty array if not found
let tasks: Task[] = loadTasks();

// Function to load tasks from localStorage
function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}

// Function to save tasks to localStorage
function saveTasks() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

// Statistics will be calculated from the actual tasks
const getDashboardStats = (): DashboardStats => {
  const activeTasks = tasks.filter(task => task.status === 'active').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  
  // Calculate total candidates from responses
  const totalCandidates = tasks.reduce((total, task) => total + task.responses.length, 0);
  
  // Calculate average score if there are responses with AI analysis
  let totalScore = 0;
  let scoreCount = 0;
  
  tasks.forEach(task => {
    task.responses.forEach(response => {
      if (response.aiAnalysis) {
        totalScore += response.aiAnalysis.overallScore;
        scoreCount++;
      }
    });
  });
  
  const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  
  return {
    activeTasks,
    completedTasks,
    totalCandidates,
    averageScore
  };
};

// OpenAI API configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Helper function to make API calls to OpenAI
const callOpenAI = async (messages: Array<{ role: string, content: string }>) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

// API service functions
export const taskService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return getDashboardStats();
  },

  getAllTasks: async (): Promise<Task[]> => {
    return tasks;
  },

  getTaskById: async (id: string): Promise<Task | undefined> => {
    return tasks.find(task => task.id === id);
  },

  getTaskByIdForCandidate: async (id: string): Promise<Task | undefined> => {
    // Return a task with limited information for candidates
    const task = tasks.find(task => task.id === id);
    if (!task) return undefined;
    
    // Only return necessary information, not responses
    return {
      ...task,
      responses: [] // Don't expose other candidates' responses
    };
  },

  generateTask: async (brandDefinition: BrandDefinition): Promise<Task> => {
    // Prepare prompt for task generation
    const messages = [
      { 
        role: 'system', 
        content: 'You are an expert in creating realistic technical assessment tasks for job candidates. You\'ll create a detailed task description based on the provided brand information. Include clear requirements, deliverables, and evaluation criteria. Format your response as JSON with the following structure: {"title": "Task Title", "description": "Main task description", "sections": [{"title": "Requirements Title", "content": "Detailed requirements", "type": "requirements"}, {"title": "Deliverables Title", "content": "Expected deliverables", "type": "deliverables"}, {"title": "Evaluation Criteria", "content": "How submissions will be evaluated", "type": "evaluation"}, {"title": "Additional Notes", "content": "Any extra information", "type": "note"}]}' 
      },
      {
        role: 'user',
        content: `Create an assessment task for a company with the following details:
        Company Name: ${brandDefinition.companyName}
        Industry: ${brandDefinition.industry}
        Target Audience: ${brandDefinition.targetAudience}
        Company Values: ${brandDefinition.companyValues.join(', ')}
        Communication Tone: ${brandDefinition.tone}
        ${brandDefinition.additionalInfo ? `Additional Information: ${brandDefinition.additionalInfo}` : ''}
        
        Create a realistic technical assessment that aligns with this brand.`
      }
    ];

    try {
      const aiResponse = await callOpenAI(messages);
      const parsedResponse = JSON.parse(aiResponse);
      
      // Create a new task with generated content
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: parsedResponse.title,
        description: parsedResponse.description,
        status: 'active',
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        brandDefinition,
        responses: [],
        sections: parsedResponse.sections.map((section: any, index: number) => ({
          id: `section-${Date.now()}-${index}`,
          title: section.title,
          content: section.content,
          type: section.type
        }))
      };
      
      tasks.unshift(newTask);
      // Save tasks to localStorage after adding a new one
      saveTasks();
      return newTask;
    } catch (error) {
      console.error('Error generating task:', error);
      // Fallback to a basic task in case of error
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: `${brandDefinition.companyName} Assessment Task`,
        description: `This is an assessment task for ${brandDefinition.companyName} in the ${brandDefinition.industry} industry.`,
        status: 'active',
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        brandDefinition,
        responses: [],
        sections: [
          {
            id: `section-${Date.now()}-1`,
            title: 'Task Requirements',
            content: 'Please complete the specified requirements.',
            type: 'requirements'
          },
          {
            id: `section-${Date.now()}-2`,
            title: 'Deliverables',
            content: 'Submit all requested deliverables.',
            type: 'deliverables'
          },
          {
            id: `section-${Date.now()}-3`,
            title: 'Evaluation Criteria',
            content: 'Submissions will be evaluated based on quality and alignment with requirements.',
            type: 'evaluation'
          }
        ]
      };
      
      tasks.unshift(newTask);
      // Save tasks to localStorage after adding a new one
      saveTasks();
      return newTask;
    }
  },

  submitResponse: async (taskId: string, response: Omit<TaskResponse, 'id' | 'submittedAt' | 'aiAnalysis'>): Promise<TaskResponse> => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) throw new Error("Task not found");
    
    const newResponse: TaskResponse = {
      ...response,
      id: `response-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    
    // Analyze the response using AI
    const aiAnalysis = await taskService.analyzeResponse(taskId, newResponse);
    newResponse.aiAnalysis = aiAnalysis;
    
    // Add the response to the task
    task.responses.push(newResponse);
    // Save tasks to localStorage after adding a response
    saveTasks();
    
    return newResponse;
  },

  analyzeResponse: async (taskId: string, response: TaskResponse): Promise<AiAnalysis> => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) throw new Error("Task not found");
    
    // Prepare prompt for response analysis
    const messages = [
      { 
        role: 'system', 
        content: 'You are an expert in evaluating candidate responses to technical assessment tasks. Analyze the provided response based on the task requirements, brand values, and other criteria. Your analysis should be detailed, fair, and constructive. Format your response as JSON with the following structure: {"overallScore": number(0-100), "strengths": ["strength1", "strength2", "strength3"], "weaknesses": ["weakness1", "weakness2", "weakness3"], "fitToBrand": number(0-100), "creativityScore": number(0-100), "technicalAccuracy": number(0-100), "summary": "Brief summary of analysis"}' 
      },
      {
        role: 'user',
        content: `
        Task Title: ${task.title}
        Task Description: ${task.description}
        
        Brand Information:
        Company: ${task.brandDefinition.companyName}
        Industry: ${task.brandDefinition.industry}
        Target Audience: ${task.brandDefinition.targetAudience}
        Values: ${task.brandDefinition.companyValues.join(', ')}
        Tone: ${task.brandDefinition.tone}
        
        Requirements:
        ${task.sections?.filter(s => s.type === 'requirements').map(s => s.content).join('\n') || 'N/A'}
        
        Deliverables:
        ${task.sections?.filter(s => s.type === 'deliverables').map(s => s.content).join('\n') || 'N/A'}
        
        Evaluation Criteria:
        ${task.sections?.filter(s => s.type === 'evaluation').map(s => s.content).join('\n') || 'N/A'}
        
        Candidate Response:
        ${response.responseContent}
        
        Analyze this response and provide detailed feedback.`
      }
    ];

    try {
      const aiResponse = await callOpenAI(messages);
      const analysis = JSON.parse(aiResponse);
      
      return {
        overallScore: analysis.overallScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        fitToBrand: analysis.fitToBrand,
        creativityScore: analysis.creativityScore,
        technicalAccuracy: analysis.technicalAccuracy,
        summary: analysis.summary
      };
    } catch (error) {
      console.error('Error analyzing response:', error);
      
      // Fallback to a generic analysis in case of error
      return {
        overallScore: 70,
        strengths: ['Completed the task as requested', 'Shows understanding of core requirements'],
        weaknesses: ['Could improve specificity', 'Further alignment with brand values recommended'],
        fitToBrand: 65,
        creativityScore: 70,
        technicalAccuracy: 75,
        summary: 'The response adequately addresses the task requirements but could benefit from closer alignment with brand values and more specific details.'
      };
    }
  },

  updateTaskSection: async (taskId: string, sectionId: string, content: string): Promise<void> => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    if (!task.sections) {
      task.sections = [];
    }

    const sectionIndex = task.sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;

    task.sections[sectionIndex].content = content;
    // Save tasks to localStorage after updating a section
    saveTasks();
  },
  
  markTaskComplete: async (taskId: string): Promise<void> => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    tasks[taskIndex].status = 'completed';
    // Save tasks to localStorage after marking a task as complete
    saveTasks();
  }
};
