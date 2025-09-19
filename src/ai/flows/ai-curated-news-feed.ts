'use server';

/**
 * @fileOverview An AI-curated news feed flow that summarizes new and emerging job roles.
 *
 * - aiCuratedNewsFeed - A function that returns AI-curated news feed.
 * - AICuratedNewsFeedInput - The input type for the aiCuratedNewsFeed function.
 * - AICuratedNewsFeedOutput - The return type for the aiCuratedNewsFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICuratedNewsFeedInputSchema = z.object({
  query: z.string().describe('The search query for job roles.'),
});
export type AICuratedNewsFeedInput = z.infer<typeof AICuratedNewsFeedInputSchema>;

const AICuratedNewsFeedOutputSchema = z.object({
  summary: z.string().describe('A 2-3 line AI summary of the job role.'),
  sourceLink: z.string().url().describe('Link to the source article.'),
  tags: z.array(z.string()).describe('Tags related to the job role (job role, industry, date).'),
  confidenceScore: z
    .enum(['low', 'medium', 'high'])
    .describe('Confidence score about the novelty of the job role.'),
});
export type AICuratedNewsFeedOutput = z.infer<typeof AICuratedNewsFeedOutputSchema>;

export async function aiCuratedNewsFeed(input: AICuratedNewsFeedInput): Promise<AICuratedNewsFeedOutput> {
  return aiCuratedNewsFeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCuratedNewsFeedPrompt',
  input: {schema: AICuratedNewsFeedInputSchema},
  output: {schema: AICuratedNewsFeedOutputSchema},
  prompt: `You are an AI assistant that curates a news feed of new and emerging job roles.

  Given the following search query, summarize a job role from a trusted source, provide a link to the source, and include tags related to the job role.
  Also, include a confidence score about the novelty of the job role.

  Search Query: {{{query}}}

  Output:
  Summary: [2-3 line AI summary]
  Source Link: [URL]
  Tags: [job role, industry, date]
  Confidence Score: [low/medium/high]`,
});

const aiCuratedNewsFeedFlow = ai.defineFlow(
  {
    name: 'aiCuratedNewsFeedFlow',
    inputSchema: AICuratedNewsFeedInputSchema,
    outputSchema: AICuratedNewsFeedOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
