export type TopicId = 'python-core' | 'python' | 'javascript' | 'html-css' | 'java' | 'cpp' | 'ml' | 'dl' | 'neural-nets';

export interface TopicInfo {
  id: TopicId;
  name: string;
  tagline: string;
  isLive: boolean;
  iconName: string;
  description: string;
  estimatedHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  upcomingModules: string[];
}

export interface Lesson {
  id: string;
  title: string;
  shortDesc: string;
  durationMinutes: number;
  level: string;
  topics: string[];
  contentMarkdown: string;
  initialCode: string;
  expectedOutput?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface CodeTemplate {
  id: string;
  name: string;
  language: 'python' | 'javascript';
  category: string;
  code: string;
}

export interface CodeFeedbackResponse {
  summary: string;
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string[];
  optimizedCode?: string;
  source?: 'gemini' | 'simulated';
}
