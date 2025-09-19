
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
    location: { state: 'Karnataka', city: 'Bengaluru' },
    educationStage: 'Undergraduate',
    currentCourseOrJob: 'B.Tech CSE',
    careerGoals: ['Software Engineer', 'Startup Founder'],
    interests: ['Artificial Intelligence', 'Cloud Computing', 'Startups'],
    techComfort: 'Proficient',
    skills: ['Python', 'React', 'Node.js'],
    constraints: 'Looking for remote internships.',
    consentToStore: true,
  },
  {
    id: '2',
    name: 'Priya Singh',
    age: 17,
    location: { state: 'Maharashtra', city: 'Mumbai' },
    educationStage: 'Secondary (class 11–12)',
    stream: ['Commerce', 'Economics', 'Maths'],
    careerGoals: ['Investment Banking'],
    interests: ['Finance', 'Marketing', 'Photography'],
    techComfort: 'Comfortable',
    preferredLearningModes: ['Online courses', 'Mentorship'],
    consentToStore: true,
  },
  {
    id: '3',
    name: 'Rohan Joshi',
    age: 26,
    location: { state: 'Maharashtra', city: 'Pune' },
    educationStage: 'Working professional',
    currentCourseOrJob: 'Marketing Associate',
    careerGoals: ['UX Designer'],
    interests: ['Digital Marketing', 'Content Creation', 'UX/UI Design'],
    techComfort: 'Comfortable',
    skills: ['SEO', 'Content Writing'],
    constraints: 'Cannot relocate for the next 2 years.',
    shareAnonymously: true,
    consentToStore: true,
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
          <DialogContent className="sm:max-w-3xl">
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
