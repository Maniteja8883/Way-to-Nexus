
"use client";

import { useState } from "react";
import { PersonaCard } from "@/components/personas/PersonaCard";
import { CreatePersonaForm } from "@/components/personas/CreatePersonaForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import type { Persona } from "@/lib/types";

const samplePersonas: Persona[] = [
  { 
    id: '1', 
    name: 'Aarav Sharma', 
    age: 21, 
    location: { city: 'Bengaluru', state: 'Karnataka' },
    educationStage: 'Undergraduate',
    stream: 'Computer Science Engineering',
    techComfort: 'Advanced',
    interests: ['Artificial Intelligence', 'Cloud Computing', 'Startups'],
    goals: 'Secure a software engineering role at a top product-based company and eventually launch my own tech startup.' 
  },
  { 
    id: '2', 
    name: 'Priya Singh', 
    age: 17, 
    location: { city: 'Mumbai', state: 'Maharashtra' },
    educationStage: 'High School',
    stream: 'Commerce',
    techComfort: 'Intermediate',
    interests: ['Finance', 'Marketing', 'Photography'],
    goals: 'Get into a top B-school for a BBA in Finance and explore a career in investment banking.'
  },
  { 
    id: '3', 
    name: 'Rohan Joshi', 
    age: 26, 
    location: { city: 'Pune', state: 'Maharashtra' },
    educationStage: 'Professional',
    stream: 'Marketing',
    techComfort: 'Intermediate',
    interests: ['Digital Marketing', 'Content Creation', 'UX/UI Design'],
    goals: 'Transition from a traditional marketing role to a UX designer position within the next two years.'
  },
];


export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>(samplePersonas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addPersona = (newPersonaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = {
      ...newPersonaData,
      id: (personas.length + 1).toString(),
    };
    setPersonas([...personas, newPersona]);
    setIsDialogOpen(false);
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
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Create New Persona</DialogTitle>
            </DialogHeader>
            <CreatePersonaForm onPersonaCreate={addPersona} />
          </DialogContent>
        </Dialog>
      </div>
      
      {personas.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona, index) => (
            <PersonaCard key={persona.id} persona={persona} index={index} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <h3 className="text-xl font-semibold tracking-tight">No Personas Yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">Click "New Persona" to get started.</p>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Persona
                </Button>
            </DialogTrigger>
        </div>
      )}
    </div>
  );
}
