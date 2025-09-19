
export type Persona = {
  id: string;
  name: string;
  age: number;
  location: {
    city: string;
    state: string;
  };
  educationStage: 'High School' | 'Undergraduate' | 'Postgraduate' | 'Professional';
  stream: string; // e.g., "Science", "Commerce", "Arts", "Engineering"
  techComfort: 'Beginner' | 'Intermediate' | 'Advanced';
  interests: string[];
  goals: string;
};


export type NewsArticle = {
  summary: string;
  sourceLink: string;
  tags: string[];
  confidenceScore: 'low' | 'medium' | 'high';
};

export type ChatMessage = {
  id: string;
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
