import { aiCuratedNewsFeed } from "@/ai/flows/ai-curated-news-feed";
import { NewsCard } from "@/components/news/NewsCard";
import type { NewsArticle } from "@/lib/types";
import { Rss } from "lucide-react";

async function getNewsData() {
    const jobQueries = ["AI Prompt Engineer", "Data Storyteller", "Chief Metaverse Officer", "AI Ethicist"];
    
    try {
        const result = await aiCuratedNewsFeed({ queries: jobQueries });
        return result.articles as NewsArticle[];
    } catch(error) {
        console.error("Failed to fetch news feed:", error);
        // In a real app, you might want to return cached data or a specific error state.
        return [];
    }
}


export default async function NewsPage() {
    const newsArticles = await getNewsData();

    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Curated News Feed</h1>
                <p className="text-muted-foreground font-body">Your daily brief on emerging job roles, powered by AI.</p>
            </div>
            {newsArticles.length > 0 ? (
                <div className="grid gap-8">
                    {newsArticles.map((article, index) => (
                        <NewsCard key={index} article={article} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
                    <Rss className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold tracking-tight">Could Not Load News</h3>
                    <p className="text-muted-foreground mt-2">There was an issue fetching the latest news. Please try again later.</p>
                </div>
            )}
        </div>
    );
}

export const revalidate = 43200; // Cache news for 12 hours
