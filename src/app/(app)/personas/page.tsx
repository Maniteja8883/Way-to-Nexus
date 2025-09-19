
"use client";

import { useState, useEffect } from "react";
import { PersonaCard } from "@/components/personas/PersonaCard";
import { CreatePersonaForm } from "@/components/personas/CreatePersonaForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import type { Persona } from "@/lib/types";
import { addPersonaToFirestore, getPersonasFromFirestore } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function PersonasPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPersonas = async () => {
      try {
        const fetchedPersonas = await getPersonasFromFirestore();
        setPersonas(fetchedPersonas);
      } catch (error) {
        console.error("Failed to fetch personas:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your personas. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonas();
  }, [user, toast]);

  const addPersona = async (newPersonaData: Omit<Persona, 'id'>) => {
    setIsSubmitting(true);
    try {
      const newPersonaId = await addPersonaToFirestore(newPersonaData);
      const newPersona: Persona = {
        ...newPersonaData,
        id: newPersonaId,
        // The timestamps will be set by the server, so we can use a client-side estimate for immediate UI update
        createdAt: new Date(), 
        updatedAt: new Date(),
      };
      setPersonas(prev => [newPersona, ...prev]);
      toast({
        title: "Success!",
        description: "Your new persona has been created.",
      });
      setIsDialogOpen(false);
    } catch (error) {
       console.error("Failed to create persona:", error);
        toast({
          variant: "destructive",
          title: "Creation Failed",
          description: "Could not save your persona. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-semibold tracking-tight">Loading Personas...</h3>
            <p className="text-muted-foreground mt-2">Fetching your saved profiles.</p>
        </div>
      );
    }

    if (personas.length > 0) {
      return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona, index) => (
            <PersonaCard key={persona.id} persona={persona} index={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
          <h3 className="text-xl font-semibold tracking-tight">No Personas Yet</h3>
          <p className="text-muted-foreground mt-2 mb-4">Click "New Persona" to get started.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Persona
          </Button>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Your Personas</h1>
            <p className="text-muted-foreground font-body">Create and manage different career profiles to get tailored advice.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Persona
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Create New Persona</DialogTitle>
            </DialogHeader>
            <CreatePersonaForm onPersonaCreate={addPersona} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>
      
      {renderContent()}
    </div>
  );
}
