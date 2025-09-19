import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { NewsArticle } from "@/lib/types";

interface NewsCardProps {
  article: NewsArticle;
}

const ConfidenceIndicator = ({ score }: { score: 'low' | 'medium' | 'high' }) => {
    const scoreMap = {
        high: { text: "High Confidence", icon: CheckCircle, color: "text-green-500" },
        medium: { text: "Medium Confidence", icon: AlertCircle, color: "text-yellow-500" },
        low: { text: "Low Confidence", icon: Clock, color: "text-orange-500" }
    };
    const { text, icon: Icon, color } = scoreMap[score] || scoreMap.low;
    return (
        <div className={`flex items-center text-xs font-medium ${color}`}>
            <Icon className="mr-1.5 h-4 w-4" />
            <span>{text}</span>
        </div>
    );
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
        <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-lg mb-2">{article.tags[0] || 'New Role'}</CardTitle>
                <ConfidenceIndicator score={article.confidenceScore} />
            </div>
            <CardDescription>{article.summary}</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild variant="outline" size="sm">
                <Link href={article.sourceLink} target="_blank" rel="noopener noreferrer">
                    Read Source Article
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
