

import type { Timestamp } from "firebase/firestore";

export type Persona = {
  id: string;
  name: string;
  age: number;
  location: {
    state: string;
    city?: string | null;
  };
  educationStage: 'Primary (≤10)' | 'Secondary (class 11–12)' | 'Undergraduate' | 'Postgraduate' | 'Working professional' | 'Other';
  stream?: string[];
  currentCourseOrJob?: string | null;
  careerGoals: string[];
  interests: string[];
  techComfort: 'Beginner' | 'Comfortable' | 'Proficient' | 'Expert' | 'Prefer not to say';
  preferredLearningModes?: string[];
  skills?: string[];
  constraints?: string | null;
  consentToStore: boolean;
  shareAnonymously?: boolean;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
};


export type NewsArticle = {
  summary: string;
  sourceLink: string;
  tags: string[];
  confidenceScore: 'low' | 'medium' | 'high';
};

export type ChatMessage = {
  id:string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// Updated Mindmap Types per specification
export type MindmapNode = {
  id: string;
  label: string;
  type: 'stage' | 'choice' | 'goal' | 'skill' | 'resource' | 'exam' | 'note';
  metadata?: {
    [key: string]: any;
    personaPrompt?: string;
  };
};

export type MindmapEdge = {
  from: string;
  to: string;
  label: string;
};

export type MindmapData = {
  mindmap_id: string;
  persona_id: string;
  thread_id: string;
  created_at: string; // ISO8601
  title: string;
  summary: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};
