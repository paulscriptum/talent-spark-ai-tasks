import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  FieldValue,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase'; // Import from our new firebase config and auth
import { Task, BrandDefinition, TaskResponse, AiAnalysis, DashboardStats, TaskSection, FileAttachment } from '../types';

// Local storage key for tasks
// const TASKS_STORAGE_KEY = 'assessment_tasks';

// Load tasks from localStorage or use empty array if not found
// let tasks: Task[] = loadTasks();

// Function to load tasks from localStorage
// function loadTasks(): Task[] {
//   if (typeof window === 'undefined') return [];
//   
//   try {
//     const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
//     return storedTasks ? JSON.parse(storedTasks) : [];
//   } catch (error) {
//     console.error('Error loading tasks from localStorage:', error);
//     return [];
//   }
// }

// Function to save tasks to localStorage
// function saveTasks() {
//   if (typeof window === 'undefined') return;
//   
//   try {
//     localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
//   } catch (error) {
//     console.error('Error saving tasks to localStorage:', error);
//   }
// }

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Helper function to make API calls to OpenAI
const callOpenAI = async (messages: Array<{ role: string, content: string }>) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not found. Make sure VITE_OPENAI_API_KEY is set in your .env file and the app is rebuilt.');
    throw new Error('OpenAI API key not configured');
  } else {
    console.log('OpenAI API Key loaded. Starts with:', apiKey.substring(0, 5), 'Ends with:', apiKey.substring(apiKey.length - 4));
  }
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        response_format: { "type": "json_object" }
      })
    });

    const responseText = await response.text();
    console.log('Raw response from OpenAI API:', responseText);
    console.log('Response status:', response.status);

    if (!response.ok) {
        console.error('OpenAI API Error: Status was not OK.', { status: response.status });
        throw new Error(`API Error: ${response.status}. Body: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid JSON structure from OpenAI:', data);
        throw new Error('Invalid response structure from OpenAI.');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error in callOpenAI function:', error);
    throw error;
  }
};

// Helper function to upload BRAND LOGOS to Firebase Storage
const uploadBrandAttachments = async (attachments: FileAttachment[]): Promise<FileAttachment[]> => {
  const uploadPromises = attachments.map(async (attachment) => {
    const response = await fetch(attachment.dataUrl);
    const blob = await response.blob();
    // Use a path specific to brand assets, including the "submissions" folder to match security rules
    const storageRef = ref(storage, `brand_logos/submissions/${attachment.name}_${Date.now()}`);
    
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      ...attachment,
      dataUrl: downloadURL,
    };
  });

  return Promise.all(uploadPromises);
};

// Helper function to upload files to Firebase Storage
const uploadAttachments = async (attachments: FileAttachment[], taskId: string): Promise<FileAttachment[]> => {
  const uploadPromises = attachments.map(async (attachment) => {
    // We need to convert dataUrl back to a Blob to upload
    const response = await fetch(attachment.dataUrl);
    const blob = await response.blob();
    const storageRef = ref(storage, `tasks/${taskId}/submissions/${attachment.name}_${Date.now()}`);
    
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Return a new object with the downloadURL, keeping other info
    return {
      ...attachment,
      dataUrl: downloadURL, // Replace dataUrl with the permanent download URL
    };
  });

  return Promise.all(uploadPromises);
};

// Helper function to analyze image content using vision capabilities
const analyzeImageContent = async (attachment: FileAttachment): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image in the context of a job assessment submission. Describe what you see, including any text, diagrams, charts, screenshots, or other relevant content. Focus on whether this appears to be substantial work (like mockups, designs, analysis) or just random screenshots.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: attachment.dataUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Vision API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

// Helper function to extract content from attachments
const extractFileContent = async (attachments: FileAttachment[]): Promise<string> => {
  const contentAnalysis: string[] = [];
  
  for (const attachment of attachments) {
    const extension = attachment.name.toLowerCase().split('.').pop() || '';
    const sizeKB = Math.round(attachment.size / 1024);
    const sizeMB = Math.round(attachment.size / (1024 * 1024) * 10) / 10;
    
    try {
      // Handle text files
      if (['txt', 'md', 'csv'].includes(extension)) {
        const textContent = atob(attachment.dataUrl.split(',')[1] || attachment.dataUrl);
        contentAnalysis.push(`
FILE: ${attachment.name} (${sizeMB}MB)
TYPE: Text Document
CONTENT:
${textContent.substring(0, 2000)}${textContent.length > 2000 ? '... (truncated)' : ''}
---`);
      }
      
      // Handle images with vision analysis
      else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
        // For images, we'll analyze them using vision capabilities
        try {
          const imageAnalysis = await analyzeImageContent(attachment);
          contentAnalysis.push(`
FILE: ${attachment.name} (${sizeMB}MB)
TYPE: Image
VISUAL ANALYSIS:
${imageAnalysis}
---`);
        } catch (error) {
          contentAnalysis.push(`
FILE: ${attachment.name} (${sizeMB}MB)
TYPE: Image
NOTE: Image present but could not be analyzed (${error.message})
---`);
        }
      }
      
      // Handle other files with metadata analysis
      else {
        let fileType = 'Unknown';
        let analysisNote = '';
        
        if (['ppt', 'pptx', 'key'].includes(extension)) {
          fileType = 'Presentation';
          analysisNote = 'PowerPoint/Keynote presentation - likely contains slides, charts, and comprehensive content';
        } else if (['pdf'].includes(extension)) {
          fileType = 'PDF Document';
          analysisNote = 'PDF document - likely contains formatted text, images, and structured content';
        } else if (['doc', 'docx'].includes(extension)) {
          fileType = 'Word Document';
          analysisNote = 'Microsoft Word document - likely contains formatted text and structured content';
        } else if (['xlsx', 'xls'].includes(extension)) {
          fileType = 'Spreadsheet';
          analysisNote = 'Excel spreadsheet - likely contains data, calculations, and analysis';
        } else if (['zip', 'rar', '7z'].includes(extension)) {
          fileType = 'Archive';
          analysisNote = 'Compressed archive - likely contains multiple files and comprehensive submission';
        }
        
        contentAnalysis.push(`
FILE: ${attachment.name} (${sizeMB}MB)
TYPE: ${fileType}
SIZE ANALYSIS: ${sizeMB > 1 ? 'Substantial file size indicates comprehensive content' : 
                sizeMB > 0.1 ? 'Moderate file size indicates some content' : 
                'Small file size - may be minimal content'}
CONTENT ANALYSIS: ${analysisNote}
---`);
      }
    } catch (error) {
      contentAnalysis.push(`
FILE: ${attachment.name} (${sizeMB}MB)
ERROR: Could not analyze file content - ${error.message}
---`);
    }
  }
  
  return contentAnalysis.join('\n');
};

// API service functions
export const taskService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const tasks = tasksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));
    
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const activeTasks = tasks.length - completedTasks;
    
    const totalResponses = tasks.reduce((acc, task) => acc + (task.responses?.length || 0), 0);
    
    let totalScore = 0;
    let scoreCount = 0;
   
    tasks.forEach(task => {
     (task.responses || []).forEach(response => {
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
      totalCandidates: totalResponses,
      averageScore,
    };
  },

  getAllTasks: async (): Promise<Task[]> => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in, returning empty array for tasks.");
      return [];
    }

    const tasksCol = collection(db, 'tasks');
    const q = query(tasksCol, where("userId", "==", user.uid), orderBy('createdAt', 'desc'));
    const tasksSnapshot = await getDocs(q);
    const tasks = tasksSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
        deadline: (data.deadline as Timestamp)?.toDate().toISOString(),
      } as Task;
    });
    return tasks;
  },

  getTaskById: async (id: string): Promise<Task | undefined> => {
    if (!id) return undefined;
    const taskDocRef = doc(db, 'tasks', id);
    const taskSnap = await getDoc(taskDocRef);

    if (!taskSnap.exists()) {
      return undefined;
    }
    
    const data = taskSnap.data();
    return {
      ...data,
      id: taskSnap.id,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      deadline: (data.deadline as Timestamp)?.toDate().toISOString(),
    } as Task;
  },

  getTaskByIdForCandidate: async (id: string): Promise<Task | undefined> => {
    const task = await taskService.getTaskById(id);
    if (!task) return undefined;
    
    return {
      ...task,
      responses: []
    };
  },

  generateTask: async (brandDefinition: BrandDefinition): Promise<Task> => {
    
    // Step 1: Handle file attachments FIRST.
    // Create a deep copy to modify, ensuring the original object is untouched.
    const brandDefinitionForFirestore = JSON.parse(JSON.stringify(brandDefinition));

    // Check for attachments and upload them.
    if (brandDefinition.attachments && brandDefinition.attachments.length > 0) {
      console.log('Found brand attachments, uploading to Firebase Storage...');
      // The attachments property on the original brandDefinition contains the File object.
      const uploadedAttachments = await uploadBrandAttachments(brandDefinition.attachments);
      // Replace the attachments on our copy with the versions that have storage URLs.
      brandDefinitionForFirestore.attachments = uploadedAttachments;
      console.log('Brand attachments uploaded successfully.');
    }

    const messages = [
      { 
        role: 'system', 
        content: 'You are an expert in creating realistic technical assessment tasks. Generate a task as a single JSON object. The JSON object should have keys: "title", "description", and "sections". "sections" should be an array of objects, each with "title", "content", and "type". The types should be "requirements", "deliverables", "evaluation", and "note".' 
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
      console.log("Attempting to generate task with AI...");
      let aiResponse = await callOpenAI(messages);
      console.log("AI Response received:", aiResponse);
      
// Clean the response to remove markdown code block formatting
    if (aiResponse.startsWith('```json')) {
      aiResponse = aiResponse.substring(7);
      if (aiResponse.endsWith('```')) {
        aiResponse = aiResponse.slice(0, -3);
      }
    }
    aiResponse = aiResponse.trim();
      
      const parsedResponse = JSON.parse(aiResponse);
      console.log("Parsed AI Response:", parsedResponse);
      
      const hasNoteSection = parsedResponse.sections?.some((s: any) => s.type === 'note');
      if (!hasNoteSection) {
        if (!parsedResponse.sections) parsedResponse.sections = [];
        parsedResponse.sections.push({
          title: "Additional Notes", 
          content: "Place additional notes here.", 
          type: "note"
        });
      }

      console.log('--- DEBUG: BrandDefinition before Firestore ---');
      console.log(JSON.stringify(brandDefinition, null, 2));
      console.log('--- END DEBUG ---');

      const newTaskData = {
        ...parsedResponse,
        status: 'active',
        createdAt: serverTimestamp(),
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        brandDefinition: brandDefinitionForFirestore,
        responses: [],
        userId: auth.currentUser?.uid || 'anonymous',
      };
      
      const docRef = await addDoc(collection(db, "tasks"), newTaskData);
      
      return {
        ...newTaskData,
        id: docRef.id,
        createdAt: new Date().toISOString(),
        deadline: newTaskData.deadline.toISOString(),
      } as Task;

    } catch (error) {
      console.error('Error in generateTask function:', error);
      if (error.message.includes('nested')) {
        console.error('--- DEBUG: Invalid brandDefinition object that caused the error ---');
        console.error(JSON.stringify(brandDefinition, (key, value) => {
          // This is a replacer function to safely log File objects
          if (value instanceof File) {
              return {
                  name: value.name,
                  size: value.size,
                  type: value.type,
                  note: "This File object is likely causing the Firestore error."
              };
          }
          return value;
        }, 2));
      }
      console.error('Error generating task:', error);
      throw new Error('Failed to generate task with AI.');
    }
  },

  submitResponse: async (taskId: string, response: Omit<TaskResponse, 'id' | 'submittedAt' | 'aiAnalysis'>): Promise<TaskResponse> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    const taskSnap = await getDoc(taskDocRef);
    if (!taskSnap.exists()) throw new Error("Task not found");

    const uploadedAttachments = response.attachments 
      ? await uploadAttachments(response.attachments, taskId)
      : [];
    
    const newResponseData = {
      ...response,
      attachments: uploadedAttachments,
      id: `response-${Date.now()}`,
      submittedAt: serverTimestamp(),
    };

    const aiAnalysis = await taskService.analyzeResponse(taskId, { 
      ...newResponseData,
      submittedAt: new Date().toISOString() // Use a temporary date for analysis
    } as TaskResponse);
    
    const finalResponse = {
      ...newResponseData,
      aiAnalysis,
    };
    
    const existingResponses = taskSnap.data().responses || [];
    await updateDoc(taskDocRef, {
      responses: [...existingResponses, finalResponse]
    });
    
    // For the return value, we convert the FieldValue to a string
    return {
      ...finalResponse,
      submittedAt: new Date().toISOString(),
    } as unknown as TaskResponse;
  },
  
  updateTaskSection: async (taskId: string, sectionId: string, content: string): Promise<void> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    const taskSnap = await getDoc(taskDocRef);
    if (!taskSnap.exists()) return;

    const task = taskSnap.data() as Task;
    const updatedSections = (task.sections || []).map(section => 
      section.id === sectionId ? { ...section, content } : section
    );

    await updateDoc(taskDocRef, { sections: updatedSections });
  },
  
  updateTaskDescription: async (taskId: string, description: string): Promise<void> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, { description });
  },
  
  markTaskComplete: async (taskId: string): Promise<void> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, { status: 'completed' });
  },

  markTaskUncomplete: async (taskId:string): Promise<void> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, { status: 'active' });
  },
  
  // This function is tricky. It's updating the brand definition, which is a nested object.
  // Firestore requires using dot notation for this.
  updateTaskAttachments: async (taskId: string, attachments: FileAttachment[]): Promise<void> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    // Assuming attachments are part of brandDefinition
    await updateDoc(taskDocRef, { 'brandDefinition.attachments': attachments });
  },
  
  analyzeResponse: async (taskId: string, response: TaskResponse): Promise<AiAnalysis> => {
    const task = await taskService.getTaskById(taskId);
    if (!task) throw new Error("Task not found");
    
    // Calculate word count and attachment metrics
    const wordCount = response.responseContent.trim().split(/\s+/).length;
    const attachments = response.attachments || [];
    const hasAttachments = attachments.length > 0;
    
    // Analyze attachment types and sizes
    const attachmentAnalysis = attachments.map(att => {
      const sizeKB = Math.round(att.size / 1024);
      const sizeMB = Math.round(att.size / (1024 * 1024) * 10) / 10;
      const extension = att.name.toLowerCase().split('.').pop() || '';
      
      let fileType = 'document';
      let importance = 'medium';
      
      // Categorize file types by importance for assessment
      if (['ppt', 'pptx', 'key'].includes(extension)) {
        fileType = 'presentation';
        importance = 'high'; // Presentations are usually comprehensive
      } else if (['pdf'].includes(extension)) {
        fileType = 'document';
        importance = 'high'; // PDFs often contain detailed content
      } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        fileType = 'document';
        importance = 'high';
      } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].includes(extension)) {
        fileType = 'image';
        importance = 'low'; // Images alone are less comprehensive
      } else if (['zip', 'rar', '7z'].includes(extension)) {
        fileType = 'archive';
        importance = 'high'; // Archives likely contain multiple files
      } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
        fileType = 'spreadsheet';
        importance = 'medium';
      }
      
      return {
        name: att.name,
        type: fileType,
        importance,
        extension,
        sizeKB,
        sizeMB,
        isSubstantial: att.size > 100000 // Files over 100KB are considered substantial
      };
    });
    
    const hasSubstantialFiles = attachmentAnalysis.some(att => att.isSubstantial);
    const hasPresentations = attachmentAnalysis.some(att => att.type === 'presentation');
    const hasDocuments = attachmentAnalysis.some(att => att.type === 'document');
    const hasHighImportanceFiles = attachmentAnalysis.some(att => att.importance === 'high');
    
    // Extract actual file content for analysis
    let fileContentAnalysis = '';
    try {
      if (hasAttachments) {
        fileContentAnalysis = await extractFileContent(attachments);
      }
    } catch (error) {
      console.error('Error extracting file content:', error);
      fileContentAnalysis = `Error analyzing file contents: ${error.message}`;
    }
    
    // Create detailed attachment summary for AI
    const attachmentSummary = attachments.length > 0 ? 
      attachmentAnalysis.map(att => 
        `- ${att.name} (${att.type}, ${att.sizeMB}MB, ${att.importance} importance)`
      ).join('\n') : 'No attachments provided';
    
    // Prepare comprehensive prompt for response analysis
    const messages = [
      { 
        role: 'system', 
        content: `You are a STRICT and THOROUGH expert evaluator for candidate assessment tasks. You must analyze BOTH the text response AND any attached files comprehensively, including their actual content.

SCORING GUIDELINES (BE STRICT BUT FAIR):
- 90-100: Exceptional, comprehensive, professional, exceeds expectations significantly
- 80-89: Very good, meets all requirements with strong execution and creativity
- 70-79: Good, meets most requirements adequately with some strengths
- 60-69: Acceptable, meets basic requirements but lacks depth or quality
- 50-59: Below average, misses several requirements or shows poor execution
- 40-49: Poor, significant gaps, minimal effort, unprofessional
- 30-39: Very poor, major deficiencies, inappropriate responses
- 20-29: Extremely poor, completely off-topic or nonsensical
- 10-19: Unacceptable, shows no understanding or effort
- 0-9: No submission or completely irrelevant

CRITICAL EVALUATION CRITERIA:
1. COMPLETENESS: Does it fully address ALL requirements (text + files combined)?
2. QUALITY: Is the content professional, well-structured, and detailed?
3. RELEVANCE: Is it specifically relevant to the task and company context?
4. EFFORT: Does it show genuine effort and thought?
5. PROFESSIONALISM: Is it presented professionally with proper formatting?
6. BRAND ALIGNMENT: Does it align with company values and communication tone?
7. TECHNICAL ACCURACY: For technical tasks, is the information accurate?
8. CREATIVITY: Does it show original thinking and innovation?

ATTACHMENT EVALUATION RULES:
- PRESENTATIONS (.ppt, .pptx): High value - analyze file size and content depth
- DOCUMENTS (.pdf, .doc, .docx): High value - analyze actual content when available
- TEXT FILES (.txt, .md): Analyze actual text content provided
- IMAGES: Analyze visual content and relevance to task
- ARCHIVES (.zip, .rar): High value - multiple files/comprehensive submission
- SPREADSHEETS (.xlsx, .csv): Medium value - analyze data/analysis work when available

FILE SIZE CONSIDERATIONS:
- Files > 1MB: Likely substantial content
- Files > 100KB: Moderate content
- Files < 50KB: Minimal content (likely screenshots)

IMPORTANT: A short text response with substantial files (presentations, documents) should be scored much higher than text-only responses. The TOTAL submission (text + files) should be evaluated as a complete package. Analyze the actual file content when provided.

RED FLAGS (AUTOMATIC LOW SCORES):
- Single sentence AND no substantial files
- Generic responses that could apply to any company (regardless of attachments)
- Random or irrelevant attachments/screenshots with no explanatory text
- Copy-paste or template responses
- Completely off-topic content
- Unprofessional language or presentation
- No evidence of understanding the specific requirements

Format your response as JSON: {"overallScore": number(0-100), "strengths": ["strength1", "strength2", "strength3"], "weaknesses": ["weakness1", "weakness2", "weakness3"], "fitToBrand": number(0-100), "creativityScore": number(0-100), "technicalAccuracy": number(0-100), "summary": "Detailed summary explaining the score, including file content analysis"}` 
      },
      {
        role: 'user',
        content: `
ASSESSMENT TASK CONTEXT:
Task Title: ${task.title}
Task Description: ${task.description}

COMPANY INFORMATION:
Company: ${task.brandDefinition.companyName}
Industry: ${task.brandDefinition.industry}
Target Audience: ${task.brandDefinition.targetAudience}
Company Values: ${task.brandDefinition.companyValues.join(', ')}
Communication Tone: ${task.brandDefinition.tone}
${task.brandDefinition.role ? `Target Role: ${task.brandDefinition.role}` : ''}
${task.brandDefinition.level ? `Experience Level: ${task.brandDefinition.level}` : ''}

SPECIFIC REQUIREMENTS:
${task.sections?.filter(s => s.type === 'requirements').map(s => s.content).join('\n\n') || 'No specific requirements provided'}

EXPECTED DELIVERABLES:
${task.sections?.filter(s => s.type === 'deliverables').map(s => s.content).join('\n\n') || 'No specific deliverables provided'}

EVALUATION CRITERIA:
${task.sections?.filter(s => s.type === 'evaluation').map(s => s.content).join('\n\n') || 'Standard professional assessment criteria apply'}

CANDIDATE SUBMISSION TO EVALUATE:

TEXT RESPONSE:
Response Length: ${wordCount} words
Response Content: "${response.responseContent}"

ATTACHED FILES OVERVIEW:
Total Files: ${attachments.length}
${attachmentSummary}

FILE ANALYSIS:
- Has Presentations: ${hasPresentations ? 'Yes' : 'No'}
- Has Documents: ${hasDocuments ? 'Yes' : 'No'}
- Has Substantial Files (>100KB): ${hasSubstantialFiles ? 'Yes' : 'No'}
- Has High-Value Files: ${hasHighImportanceFiles ? 'Yes' : 'No'}

DETAILED FILE CONTENT ANALYSIS:
${fileContentAnalysis || 'No files to analyze'}

COMPREHENSIVE EVALUATION REQUIRED:
Analyze this candidate submission as a COMPLETE PACKAGE (text + files + actual file content). Consider:

1. Does the TOTAL submission (text + files) show genuine effort and understanding?
2. Are the files relevant and substantial, or just random screenshots?
3. If text is brief but files are comprehensive (presentations, documents), score accordingly
4. Is the submission specifically tailored to this company and role?
5. Does it address the actual requirements and deliverables?
6. Is the overall presentation professional?
7. What does the actual file content reveal about the candidate's work quality?

IMPORTANT: Do not penalize for brief text if substantial, relevant files are provided. A short explanation with a comprehensive presentation or document can be excellent work. Use the actual file content analysis to make informed judgments.`
      }
    ];

    try {
      const aiResponse = await callOpenAI(messages);
      const analysis = JSON.parse(aiResponse);
      
      // Adjust scoring based on file analysis - be more lenient with word count if good files are provided
      if (wordCount < 20 && !hasHighImportanceFiles) {
        // Only penalize for short text if there are no substantial files
        analysis.overallScore = Math.min(analysis.overallScore, 25);
        analysis.weaknesses.unshift("Response is extremely brief with no substantial supporting files");
        analysis.summary = `Very short response (${wordCount} words) with inadequate file support. ` + analysis.summary;
      } else if (wordCount < 20 && hasHighImportanceFiles) {
        // Don't penalize as much if there are good files
        analysis.summary = `Brief text response (${wordCount} words) but includes ${attachments.length} file(s) for evaluation. ` + analysis.summary;
      }
      
      // Ensure scores are realistic and consistent
      analysis.overallScore = Math.max(0, Math.min(100, analysis.overallScore));
      analysis.fitToBrand = Math.max(0, Math.min(100, analysis.fitToBrand));
      analysis.creativityScore = Math.max(0, Math.min(100, analysis.creativityScore));
      analysis.technicalAccuracy = Math.max(0, Math.min(100, analysis.technicalAccuracy));
      
      return {
        overallScore: analysis.overallScore,
        strengths: analysis.strengths || ['Submission was provided'],
        weaknesses: analysis.weaknesses || ['Significant improvements needed across all areas'],
        fitToBrand: analysis.fitToBrand,
        creativityScore: analysis.creativityScore,
        technicalAccuracy: analysis.technicalAccuracy,
        summary: analysis.summary || 'Response requires substantial improvement to meet professional standards.'
      };
    } catch (error) {
      console.error('Error analyzing response:', error);
      
      // Improved fallback scores that consider attachments
      let fallbackScore = 15; // Very low default
      let fallbackSummary = 'Unable to properly analyze response due to technical error.';
      
      // Better fallback scoring based on both text and files
      if (hasHighImportanceFiles && wordCount > 5) {
        fallbackScore = 45; // Much better if substantial files are provided
        fallbackSummary = `Response includes ${attachments.length} file(s) but could not be fully analyzed due to technical error.`;
      } else if (wordCount > 100) {
        fallbackScore = 35; // Still low, but slightly better for longer responses
        fallbackSummary = 'Response has adequate length but could not be fully analyzed due to technical error.';
      } else if (wordCount < 10 && !hasAttachments) {
        fallbackScore = 5; // Extremely low for very short responses with no files
        fallbackSummary = 'Response is too brief with no supporting files to demonstrate understanding or effort.';
      }
      
      return {
        overallScore: fallbackScore,
        strengths: hasSubstantialFiles ? ['Files provided for review', 'Response was submitted'] : 
                  wordCount > 50 ? ['Response was provided', 'Adequate length'] : ['Response was provided'],
        weaknesses: [
          'Could not be fully analyzed due to technical error',
          'Requires comprehensive review and improvement',
          wordCount < 20 && !hasAttachments ? 'Response is too brief with no supporting materials' : 'Needs more detailed analysis'
        ],
        fitToBrand: Math.max(10, fallbackScore - 5),
        creativityScore: Math.max(10, fallbackScore - 10),
        technicalAccuracy: Math.max(10, fallbackScore - 5),
        summary: fallbackSummary
      };
    }
  },

  generateSectionContentWithAI: async (taskId: string, sectionId: string): Promise<TaskSection | null> => {
    const task = await taskService.getTaskById(taskId);
    if (!task || !task.brandDefinition || !task.sections) {
      console.error('Task, brand definition, or sections not found for AI generation.');
      return null;
    }

    const section = task.sections.find(s => s.id === sectionId);
    if (!section) {
      console.error('Section not found for AI generation.');
      return null;
    }

    const sectionTypeUserFriendly = section.type.charAt(0).toUpperCase() + section.type.slice(1);

    const messages = [
      {
        role: 'system',
        content: `You are an expert in creating content for technical assessment tasks. Given the brand information and a specific section type (e.g., Requirements, Deliverables, Evaluation Criteria, Note), generate concise and relevant content for that section. Only return the text content for the section, not any titles or JSON structure.`
      },
      {
        role: 'user',
        content: `Generate the content for the "${sectionTypeUserFriendly}" section of an assessment task. 
        The task is for a company with the following details:
        Company Name: ${task.brandDefinition.companyName}
        Industry: ${task.brandDefinition.industry}
        Target Audience: ${task.brandDefinition.targetAudience}
        Company Values: ${task.brandDefinition.companyValues.join(', ')}
        Communication Tone: ${task.brandDefinition.tone}
        ${task.brandDefinition.additionalInfo ? `Additional Information: ${task.brandDefinition.additionalInfo}` : ''}
        Task Title: ${task.title}
        Task Description: ${task.description}

        Focus on creating specific and actionable content for the "${sectionTypeUserFriendly}" section. For example, if generating Requirements, list specific technical or functional requirements. If generating Deliverables, list the expected outputs.`
      }
    ];

    try {
      const aiResponse = await callOpenAI(messages);
      const newContent = aiResponse.trim();

      // Update the specific section in Firestore
      const updatedSections = task.sections.map(s => 
        s.id === sectionId ? { ...s, content: newContent } : s
      );
      
      await updateDoc(doc(db, 'tasks', taskId), { sections: updatedSections });
      
      const updatedSection = updatedSections.find(s => s.id === sectionId);
      return updatedSection || null;

    } catch (error) {
      console.error(`Error generating content for section ${sectionId}:`, error);
      throw error;
    }
  },

  updateTask: async (taskId: string, updatedData: Partial<Task>): Promise<Task> => {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, updatedData);
    
    const updatedTaskSnap = await getDoc(taskDocRef);
    if (!updatedTaskSnap.exists()) {
      throw new Error("Failed to retrieve updated task");
    }

    const taskData = updatedTaskSnap.data();
    return {
      id: updatedTaskSnap.id,
      ...taskData,
      createdAt: (taskData.createdAt as Timestamp).toDate().toISOString(),
      deadline: (taskData.deadline as Timestamp).toDate().toISOString(),
    } as Task;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    // ... existing code ...
  },
};
