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
    .describe('The complete chat thread as a single string.'),
});
export type GenerateInteractiveMindmapInput = z.infer<
  typeof GenerateInteractiveMindmapInputSchema
>;

const GenerateInteractiveMindmapOutputSchema = z.object({
  mindmapJson: z
    .string()
    .describe(
      'A JSON string representing the mind map, with nodes and edges for the chat thread.'
    ),
  fallbackMessage: z
    .string()
    .optional()
    .describe(
      'A fallback message to display if mindmap generation fails, with pre-baked sample mindmap in demo mode.'
    ),
});
export type GenerateInteractiveMindmapOutput = z.infer<
  typeof GenerateInteractiveMindmapOutputSchema
>;

export async function generateInteractiveMindmap(
  input: GenerateInteractiveMindmapInput
): Promise<GenerateInteractiveMindmapOutput> {
  return generateInteractiveMindmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInteractiveMindmapPrompt',
  input: {schema: GenerateInteractiveMindmapInputSchema},
  output: {schema: GenerateInteractiveMindmapOutputSchema},
  prompt: `You are an AI expert in career advice, and will summarize the chat thread into an interactive mind map.  The mindmap should contain nodes representing key concepts, and edges representing relationships between concepts.  The mindmap should be returned as a JSON string.

Chat Thread: {{{chatThread}}}

Ensure that the mindmapJson output is valid JSON. If the mindmap cannot be generated for any reason, return a fallback message.`,
});

const generateInteractiveMindmapFlow = ai.defineFlow(
  {
    name: 'generateInteractiveMindmapFlow',
    inputSchema: GenerateInteractiveMindmapInputSchema,
    outputSchema: GenerateInteractiveMindmapOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error generating mindmap:', error);
      return {
        mindmapJson: JSON.stringify({
          nodes: [
            {data: {id: 'fallback', label: 'Fallback Mindmap'}},
            {data: {id: 'node1', label: 'Node 1'}},
            {data: {id: 'node2', label: 'Node 2'}},
          ],
          edges: [
            {data: {source: 'fallback', target: 'node1'}},
            {data: {source: 'fallback', target: 'node2'}},
          ],
        }),
        fallbackMessage: 'Failed to generate mindmap. Displaying fallback mindmap.',
      };
    }
  }
);
