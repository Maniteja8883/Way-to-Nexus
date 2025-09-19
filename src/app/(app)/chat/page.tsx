"use client";

import { useState } from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Mindmap } from '@/components/chat/Mindmap';
import type { ChatMessage, MindmapData } from '@/lib/types';
import { generateInteractiveMindmap } from '@/ai/flows/generate-interactive-mindmap';
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
    setMessages(newMessages);
    setIsMindmapLoading(true);
    setMindmapError(null);

    const chatThread = newMessages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    try {
      const result = await generateInteractiveMindmap({ chatThread });
      if(result.fallbackMessage) {
          setMindmapError(result.fallbackMessage);
      }
      if (result.mindmapJson) {
        const parsedData = JSON.parse(result.mindmapJson);
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
