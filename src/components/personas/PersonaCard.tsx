"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowRight } from "lucide-react";
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
      <CardHeader className="flex-row items-center gap-4 pb-4">
        <Image
          src={placeholderImage.imageUrl}
          alt={placeholderImage.description}
          data-ai-hint={placeholderImage.imageHint}
          width={80}
          height={80}
          className="rounded-full border-4 border-secondary"
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{persona.name}</CardTitle>
          <CardDescription>{persona.occupation}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{persona.industry}</Badge>
            <Badge variant="secondary">{persona.age} years old</Badge>
        </div>
        <div>
            <p className="text-sm font-semibold text-foreground mb-1">Goals:</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{persona.goals}</p>
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
