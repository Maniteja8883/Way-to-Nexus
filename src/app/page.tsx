"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "lucide-react";
import { Hero3D } from "@/components/landing/Hero3D";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <Hero3D />
      <main className="z-10 flex flex-col items-center text-center animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
        <div className="flex items-center gap-4 mb-6">
          <Logo className="h-16 w-16 text-primary" />
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Way To Nexus
          </h1>
        </div>
        <p className="font-body max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
          Navigate your career path with confidence. AI-powered guidance, personalized insights, and a direct line to your future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="font-headline">
            <Link href="/signup">
              Get Started Free <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-headline">
            <Link href="/login">
              I have an account
            </Link>
          </Button>
        </div>
      </main>
      <footer className="z-10 absolute bottom-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Way To Nexus. All rights reserved.
      </footer>
    </div>
  );
}
