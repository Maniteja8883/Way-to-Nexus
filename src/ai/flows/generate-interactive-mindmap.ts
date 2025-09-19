
'use server';
/**
 * @fileOverview An AI agent that generates interactive mind maps representing chat threads.
 *
 * - generateInteractiveMindmap - A function that generates the mind map.
 * - GenerateInteractiveMindmapInput - The input type for the generateInteractiveMindmap function.
 * - GenerateInteractiveMindmapOutput - The return type for the generateInteractiveMindmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInteractiveMindmapInputSchema = z.object({
  chatThread: z
    .string()
    .describe('The complete chat thread as a single string, including user persona details.'),
});
export type GenerateInteractiveMindmapInput = z.infer<
  typeof GenerateInteractiveMindmapInputSchema
>;

const MindmapNodeSchema = z.object({
  id: z.string().describe("A unique identifier for the node (e.g., 'n1', 'n2')."),
  label: z.string().describe('The text to display for the node.'),
  type: z
    .enum(['stage', 'choice', 'goal', 'skill', 'resource', 'exam', 'note'])
    .describe('The type of the node, which determines its appearance.'),
  metadata: z
    .record(z.any())
    .optional()
    .describe('An object for storing any extra data, like notes or persona-specific prompts.'),
});

const MindmapEdgeSchema = z.object({
  from: z.string().describe('The ID of the source node.'),
  to: z.string().describe('The ID of the target node.'),
  label: z.string().describe('The text to display on the edge connecting the nodes.'),
});

const MindmapDataSchema = z.object({
  mindmap_id: z.string().describe('A unique ID for the mindmap.'),
  persona_id: z.string().describe('The ID of the persona used for generation.'),
  thread_id: z.string().describe('The ID of the chat thread.'),
  created_at: z.string().datetime().describe('The ISO 8601 timestamp of when the mindmap was created.'),
  title: z.string().describe('A concise title for the mindmap.'),
  summary: z.string().describe('A 2-3 line human-readable summary of the mindmap content.'),
  nodes: z.array(MindmapNodeSchema),
  edges: z.array(MindmapEdgeSchema),
});

const GenerateInteractiveMindmapOutputSchema = z.object({
  mindmap: MindmapDataSchema.optional(),
  fallback: z
    .boolean()
    .optional()
    .describe('Indicates if the fallback demo mindmap was used.'),
  error: z
    .string()
    .optional()
    .describe('An error message if generation failed completely.'),
});

export type GenerateInteractiveMindmapOutput = z.infer<
  typeof GenerateInteractiveMindmapOutputSchema
>;

// This is the fallback demo mindmap to be used if Gemini fails.
const fallbackDemoMindmap: z.infer<typeof MindmapDataSchema> = {
  mindmap_id: 'demo-cse-aiml-001',
  persona_id: 'demo-persona',
  thread_id: 'demo-thread',
  created_at: '2025-09-19T00:00:00Z',
  title: 'Computer Science Engineering → AIML (Demo)',
  summary:
    'A practical roadmap from 10th → MPC → B.Tech AIML → careers in Machine Learning, Data Science, Research, and MLE.',
  nodes: [
    {id: 'n1', label: '10th Class (Board)', type: 'stage', metadata: {note: 'Choose science stream with Mathematics for engineering path.'}},
    {id: 'n2', label: 'Stream Options after 10th', type: 'choice', metadata: {options: ['MPC', 'BPC', 'MEC', 'CEC']}},
    {id: 'n3', label: 'Intermediate - MPC (11-12)', type: 'stage', metadata: {subjects: ['Maths', 'Physics', 'Chemistry']}},
    {id: 'n4', label: 'Engineering (B.Tech)', type: 'stage', metadata: {notes: 'Apply to institutes via JEE/State CET; choose CSE/AIML specialization.'}},
    {id: 'n5', label: 'Core AIML Courses', type: 'skill', metadata: {skills: ['Programming (Python)', 'DSA', 'Linear Algebra', 'Probability', 'ML']}},
    {id: 'n6', label: 'Specializations', type: 'choice', metadata: {options: ['NLP', 'Computer Vision', 'Robotics', 'MLOps', 'Research']}},
    {id: 'n7', label: 'Internships & Projects', type: 'resource', metadata: {examples: ['Kaggle projects', 'Open-source contributions', 'Research assistant roles']}},
    {id: 'n8', label: 'Advanced Degrees / Research', type: 'goal', metadata: {paths: ['M.Tech/PhD', 'Industry Research']}},
    {id: 'n9', label: 'Job Roles', type: 'choice', metadata: {options: ['ML Engineer', 'Data Scientist', 'Research Scientist', 'MLOps Engineer', 'AI Product Manager']}}
  ],
  edges: [
    {from: 'n1', to: 'n2', label: 'leads to'},
    {from: 'n2', to: 'n3', label: 'choose'},
    {from: 'n3', to: 'n4', label: 'apply for'},
    {from: 'n4', to: 'n5', label: 'take'},
    {from: 'n5', to: 'n6', label: 'specialize in'},
    {from: 'n5', to: 'n7', label: 'practice with'},
    {from: 'n6', to: 'n8', label: 'pursue'},
    {from: 'n7', to: 'n9', label: 'leads to'}
  ]
};

const createMindmapTool = ai.defineTool(
    {
        name: 'create_mindmap',
        description: 'Creates a structured JSON mindmap for a career path.',
        inputSchema: MindmapDataSchema,
        outputSchema: z.void(),
    },
    async (input) => {
        // This tool's purpose is to enforce the schema on the model.
        // The actual data is handled directly from the model's structured output.
    }
);


const mindmapPrompt = ai.definePrompt({
    name: 'generateInteractiveMindmapPrompt',
    system: `You are Way to Nexus — produce one JSON mindmap matching the provided schema. Localize advice to India. Use persona fields (age, educationStage, state) to tailor steps. Use the create_mindmap tool to structure your response.`,
    input: { schema: GenerateInteractiveMindmapInputSchema },
    output: { schema: MindmapDataSchema },
    tools: [createMindmapTool],
});


const generateInteractiveMindmapFlow = ai.defineFlow(
  {
    name: 'generateInteractiveMindmapFlow',
    inputSchema: GenerateInteractiveMindmapInputSchema,
    outputSchema: GenerateInteractiveMindmapOutputSchema,
  },
  async (input, streamingCallback) => {
    const maxRetries = 2;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const { output } = await mindmapPrompt(input);
        
        if (output) {
            // Validate the output against the Zod schema
            const validation = MindmapDataSchema.safeParse(output);
            if (validation.success) {
              return { mindmap: validation.data, fallback: false };
            } else {
              console.warn(`Mindmap validation failed (attempt ${i + 1}):`, validation.error);
              if (i === maxRetries) {
                 throw new Error(`Validation failed after ${maxRetries + 1} attempts.`);
              }
            }
        } else {
            throw new Error('No structured output from model.');
        }

      } catch (error) {
        console.error(`Error generating mindmap (attempt ${i + 1}):`, error);
        if (i === maxRetries) {
          console.error('Max retries reached. Using fallback mindmap.');
          return {
            mindmap: fallbackDemoMindmap,
            fallback: true,
            error: 'Failed to generate a custom mindmap. Displaying a demo instead.',
          };
        }
      }
    }
    // Should not be reached, but as a final fallback.
    return { mindmap: fallbackDemoMindmap, fallback: true };
  }
);


export async function generateInteractiveMindmap(
  input: GenerateInteractiveMindmapInput
): Promise<GenerateInteractiveMindmapOutput> {
  return generateInteractiveMindmapFlow(input);
}
