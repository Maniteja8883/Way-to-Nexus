
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
  createdAt?: any; // Ideally Firestore ServerTimestamp
  updatedAt?: any; // Ideally Firestore ServerTimestamp
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

export type MindmapNode = {
  data: {
    id: string;
    label: string;
    // position can be added if AI provides it
    position?: { x: number; y: number };
  };
};

export type MindmapEdge = {
  data: {
    id?: string;
    source: string;
    target: string;
  };
};

export type MindmapData = {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};
