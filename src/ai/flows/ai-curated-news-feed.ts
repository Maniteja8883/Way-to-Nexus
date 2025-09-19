
'use server';

/**
 * @fileOverview An AI-curated news feed flow that summarizes new and emerging job roles.
 *
 * - aiCuratedNewsFeed - A function that returns a batch of AI-curated news articles.
 * - AICuratedNewsFeedInput - The input type for the aiCuratedNewsFeed function.
 * - AICuratedNewsFeedOutput - The return type for the aiCuratedNewsFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NewsArticleSchema = z.object({
  summary: z.string().describe('A 2-3 line AI summary of the job role.'),
  sourceLink: z.string().url().describe('A plausible, but not necessarily real, link to the source article.'),
  tags: z.array(z.string()).describe('Tags related to the job role (job role, industry, date).'),
  confidenceScore: z
    .enum(['low', 'medium', 'high'])
    .describe('Confidence score about the novelty of the job role.'),
});

const AICuratedNewsFeedInputSchema = z.object({
  queries: z.array(z.string()).describe('An array of search queries for job roles.'),
});
export type AICuratedNewsFeedInput = z.infer<typeof AICuratedNewsFeedInputSchema>;

const AICuratedNewsFeedOutputSchema = z.object({
  articles: z.array(NewsArticleSchema),
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

  For each of the following search queries, generate a brief summary of a corresponding job role from a trusted-sounding source.
  For each, provide a plausible (but not necessarily real) source link, relevant tags, and a confidence score about the role's novelty.
  Return all of them as a list of articles.

  Search Queries:
  {{#each queries}}
  - {{{this}}}
  {{/each}}
  `,
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
