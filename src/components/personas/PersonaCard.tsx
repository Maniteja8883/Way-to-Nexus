
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowRight, MapPin, GraduationCap, Sparkles, Target, Briefcase, Lightbulb, UserCheck } from "lucide-react";
import type { Persona } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface PersonaCardProps {
  persona: Persona;
  index: number;
}

export function PersonaCard({ persona, index }: PersonaCardProps) {
  const placeholderImage = PlaceHolderImages[index % PlaceHolderImages.length];

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:shadow-primary/20">
      <CardHeader className="relative pb-4">
        <Image
          src={placeholderImage.imageUrl.replace('/100/100', '/400/200')}
          alt={placeholderImage.description}
          data-ai-hint={placeholderImage.imageHint}
          width={400}
          height={200}
          className="aspect-[2/1] w-full rounded-t-lg object-cover"
        />
        <div className="absolute bottom-0 left-4 translate-y-1/2">
             <div className="w-24 h-24 rounded-full border-4 border-card bg-card p-1">
                <Image
                    src={placeholderImage.imageUrl}
                    alt={placeholderImage.description}
                    data-ai-hint={placeholderImage.imageHint}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                />
            </div>
        </div>
         <Button variant="ghost" size="icon" className="absolute top-2 right-2 shrink-0 bg-background/50 hover:bg-background">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit Persona</span>
        </Button>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 pt-14">
        <div className="space-y-1">
            <CardTitle className="font-headline text-xl">{persona.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5"/> {persona.location.city ? `${persona.location.city}, ` : ''}{persona.location.state}
            </CardDescription>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{persona.educationStage}{persona.currentCourseOrJob && `: `}<strong>{persona.currentCourseOrJob}</strong>{persona.stream && persona.stream.length > 0 && ` (${persona.stream.join(', ')})`}</span>
            </div>
             <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span><strong>{persona.techComfort}</strong> with technology</span>
            </div>
        </div>

        {persona.interests && persona.interests.length > 0 && (
          <div>
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary"/>Interests:</p>
              <div className="flex flex-wrap gap-1">
                  {persona.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">{interest}</Badge>
                  ))}
              </div>
          </div>
        )}
        
        {persona.skills && persona.skills.length > 0 && (
          <div>
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><UserCheck className="h-4 w-4 text-primary"/>Skills:</p>
              <div className="flex flex-wrap gap-1">
                  {persona.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
              </div>
          </div>
        )}

        <div>
            <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-primary"/>Goals:</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{persona.careerGoals.join(', ')}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
            <Link href="/chat">
                Explore with this Persona <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
