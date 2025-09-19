"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Newspaper, BrainCircuit } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const features = [
    {
      title: "AI Career Chat",
      description: "Get personalized career advice from our advanced AI.",
      href: "/chat",
      icon: MessageSquare,
      cta: "Start Chatting"
    },
    {
      title: "Manage Personas",
      description: "Create and edit your career personas for tailored guidance.",
      href: "/personas",
      icon: Users,
      cta: "View Personas"
    },
    {
      title: "Emerging Job News",
      description: "Stay updated with AI-curated news on new job roles.",
      href: "/news",
      icon: Newspaper,
      cta: "Read News"
    },
     {
      title: "Visualize Your Path",
      description: "Generate interactive mind maps from your conversations.",
      href: "/chat",
      icon: BrainCircuit,
      cta: "Generate Mind Map"
    },
  ];

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Explorer'}!
        </h1>
        <p className="text-muted-foreground font-body">
          Here's your nexus for career exploration. What would you like to do today?
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={feature.href}>
                  {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
