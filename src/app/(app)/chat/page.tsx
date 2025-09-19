"use client";

import { useState } from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Mindmap } from '@/components/chat/Mindmap';
import type { ChatMessage, MindmapData } from '@/lib/types';
import { generateInteractiveMindmap } from '@/ai/flows/generate-interactive-mindmap';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [mindmapError, setMindmapError] = useState<string | null>(null);
  const [isMindmapLoading, setIsMindmapLoading] = useState(false);
  const [isMindmapVisible, setIsMindmapVisible] = useState(true);

  const handleNewMessage = async (newMessages: ChatMessage[]) => {
    // Optimistically update messages with user's new message and a thinking indicator
    setMessages(newMessages);
  
    const chatThread = newMessages.map(m => `${m.role}: ${m.content}`).join('\n');
  
    // Fork the process: one for quick text response, one for mind map generation
    const textResponsePromise = generateChatResponse({ chatThread });
    const mindmapPromise = generateInteractiveMindmap({ chatThread });
  
    // Handle text response first for better UX
    try {
      const textResult = await textResponsePromise;
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: textResult.response,
        timestamp: Date.now(),
      };
      // Replace the "Thinking..." message with the actual response
      setMessages(prevMessages => [...prevMessages.slice(0, -1), assistantMessage]);
    } catch (error) {
      console.error("Failed to generate chat response:", error);
      const errorMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prevMessages => [...prevMessages.slice(0, -1), errorMessage]);
    }
  
    // Handle mind map generation in the background
    setIsMindmapLoading(true);
    setMindmapError(null);
    try {
      const mindmapResult = await mindmapPromise;
      if (mindmapResult.fallbackMessage) {
        setMindmapError(mindmapResult.fallbackMessage);
      }
      if (mindmapResult.mindmapJson) {
        const parsedData = JSON.parse(mindmapResult.mindmapJson);
        setMindmapData(parsedData);
      }
    } catch (error) {
      console.error("Failed to generate or parse mindmap:", error);
      setMindmapError("Failed to generate mind map. The AI returned an unexpected format.");
      setMindmapData(null);
    } finally {
      setIsMindmapLoading(false);
    }
  };

  const handleNodeClick = (prompt: string) => {
    // This function will be passed to Mindmap and then to ChatPanel
    // For now, we just log it. The implementation will be in ChatPanel.
    console.log("Node clicked, prompt to send:", prompt);
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.14)-2*theme(spacing.6))] flex flex-col">
       <div className="mb-4 flex items-center justify-between">
         <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">AI Career Chat</h1>
          <p className="text-muted-foreground font-body">Your space to explore and visualize career paths.</p>
         </div>
         <Button variant="outline" size="sm" onClick={() => setIsMindmapVisible(!isMindmapVisible)} className="hidden lg:flex">
          {isMindmapVisible ? <PanelLeftClose className="mr-2 h-4 w-4"/> : <PanelRightClose className="mr-2 h-4 w-4"/>}
          {isMindmapVisible ? 'Hide' : 'Show'} Mind Map
        </Button>
      </div>

       <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
         {isMindmapVisible && (
          <>
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full p-4">
                <Mindmap data={mindmapData} error={mindmapError} isLoading={isMindmapLoading} onNodeClick={handleNodeClick} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
         )}
        <ResizablePanel defaultSize={65} minSize={30}>
           <ChatPanel
              messages={messages}
              onNewMessage={handleNewMessage}
              onNodeClick={handleNodeClick}
            />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
