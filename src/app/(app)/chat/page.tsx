
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Mindmap } from '@/components/chat/Mindmap';
import type { ChatMessage, MindmapData, Persona } from '@/lib/types';
import { generateInteractiveMindmap } from '@/ai/flows/generate-interactive-mindmap';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { PanelLeftClose, PanelRightClose, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getPersonaFromFirestore } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

function ChatPageContents() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const personaId = searchParams.get('personaId');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [mindmapError, setMindmapError] = useState<string | null>(null);
  const [isMindmapLoading, setIsMindmapLoading] = useState(false);
  const [isMindmapVisible, setIsMindmapVisible] = useState(true);
  const [isDemoMindmap, setIsDemoMindmap] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isPersonaLoading, setIsPersonaLoading] = useState(true);

  useEffect(() => {
    async function loadPersona() {
      if (!personaId) {
        setIsPersonaLoading(false);
        return;
      };

      try {
        const fetchedPersona = await getPersonaFromFirestore(personaId);
        setPersona(fetchedPersona);
        if (fetchedPersona) {
           toast({
            title: `Persona Loaded: ${fetchedPersona.name}`,
            description: "Your conversation will now be tailored to this persona.",
          });
        } else {
            toast({
              variant: "destructive",
              title: "Persona Not Found",
              description: "Could not load the selected persona. Continuing without one.",
            });
        }
      } catch (error) {
        console.error("Failed to fetch persona:", error);
         toast({
          variant: "destructive",
          title: "Error Loading Persona",
          description: "There was a problem fetching your persona. Please try again.",
        });
      } finally {
        setIsPersonaLoading(false);
      }
    }
    loadPersona();
  }, [personaId, toast]);

  const handleNewMessage = async (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
  
    const personaContext = persona ? `\n\n--- Persona Context ---\n${JSON.stringify(persona, null, 2)}` : "";
    const chatThread = newMessages.map(m => `${m.role}: ${m.content}`).join('\n') + personaContext;
  
    const textResponsePromise = generateChatResponse({ chatThread });
    const mindmapPromise = generateInteractiveMindmap({ chatThread });
  
    try {
      const textResult = await textResponsePromise;
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: textResult.response,
        timestamp: Date.now(),
      };
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
  
    setIsMindmapLoading(true);
    setMindmapError(null);
    setIsDemoMindmap(false);
    try {
      const mindmapResult = await mindmapPromise;

      if (mindmapResult.error) {
        setMindmapError(mindmapResult.error);
      }
      if (mindmapResult.fallback) {
        setIsDemoMindmap(true);
      }
      if (mindmapResult.mindmap) {
        setMindmapData(mindmapResult.mindmap);
      } else if (!mindmapResult.error) {
         setMindmapError("The AI returned an unexpected format for the mind map.");
      }
    } catch (error) {
      console.error("Failed to generate or parse mindmap:", error);
      setMindmapError("Failed to generate mind map. An unexpected error occurred.");
      setMindmapData(null);
    } finally {
      setIsMindmapLoading(false);
    }
  };

  const handleNodeClick = (prompt: string) => {
    console.log("Node click will trigger a new message via ChatPanel:", prompt);
  };

  if (isPersonaLoading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.14)-2*theme(spacing.6))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Persona...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.14)-2*theme(spacing.6))] flex flex-col">
       <div className="mb-4 flex items-center justify-between">
         <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            AI Career Chat {persona ? <span className="text-primary/80">&middot; {persona.name}</span> : ""}
          </h1>
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
                <Mindmap data={mindmapData} error={mindmapError} isLoading={isMindmapLoading} isDemo={isDemoMindmap} onNodeClick={handleNodeClick} />
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

export default function ChatPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    }>
      <ChatPageContents />
    </Suspense>
  );
}
