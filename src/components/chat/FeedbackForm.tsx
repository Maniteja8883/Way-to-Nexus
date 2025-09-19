"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedbackForm() {
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex justify-center my-4">
        <p className="text-sm text-muted-foreground italic">Thank you for your feedback!</p>
      </div>
    );
  }

  const handleFeedback = (type: 'good' | 'bad') => {
    setFeedback(type);
    // In a real app, you would send this to a server
    console.log("Feedback submitted:", type);
    setSubmitted(true);
  };

  return (
    <div className="flex justify-center items-center gap-4 my-4">
      <p className="text-sm text-muted-foreground">Was this response helpful?</p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFeedback('good')}
          className={cn(
            "hover:bg-green-100 dark:hover:bg-green-900/50",
            feedback === 'good' && "bg-green-100 dark:bg-green-900/50"
          )}
        >
          <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFeedback('bad')}
          className={cn(
            "hover:bg-red-100 dark:hover:bg-red-900/50",
            feedback === 'bad' && "bg-red-100 dark:bg-red-900/50"
          )}
        >
          <ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-500" />
        </Button>
      </div>
    </div>
  );
}
