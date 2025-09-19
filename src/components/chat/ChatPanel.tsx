"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/components/chat/Message";
import { Send, CornerDownLeft, BrainCircuit } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { FeedbackForm } from "./FeedbackForm";

interface ChatPanelProps {
  messages: ChatMessage[];
  onNewMessage: (messages: ChatMessage[]) => Promise<void>;
  onNodeClick: (prompt: string) => void;
}

const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty."),
});
type ChatFormValues = z.infer<typeof formSchema>;

export function ChatPanel({ messages, onNewMessage, onNodeClick }: ChatPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (values: ChatFormValues) => {
    setIsLoading(true);
    form.reset();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: values.content,
      timestamp: Date.now(),
    };
    
    // Add a mock assistant "thinking" message for immediate feedback
    const assistantThinkingMessage: ChatMessage = {
      id: `assistant-thinking-${Date.now()}`,
      role: "assistant",
      content: "Thinking...",
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage, assistantThinkingMessage];
    await onNewMessage(updatedMessages);

    setIsLoading(false);
  };

  const showFeedback = messages.length > 0 && messages[messages.length-1].role === 'assistant' && messages[messages.length-1].content !== 'Thinking...';

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                <BrainCircuit className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Start the Conversation</h3>
                <p>Ask a career question to begin, and a mind map of your discussion will appear on the left.</p>
            </div>
          )}
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {showFeedback && <FeedbackForm />}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="relative flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Textarea
                      placeholder="Ask about career paths, skills, or interview prep..."
                      className="resize-none pr-20"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(handleSubmit)();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
           <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <CornerDownLeft className="h-3 w-3 mr-1" />
              <strong>Enter</strong> to send, <strong className="mx-1">Shift + Enter</strong> for a new line.
            </p>
        </Form>
      </div>
    </div>
  );
}
