
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Way To Nexus Logo"
    >
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--muted-foreground))', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--foreground))', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Winding Road */}
      <path 
        d="M15 85 C 30 60, 70 60, 85 35" 
        stroke="url(#roadGradient)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M15 85 C 30 60, 70 60, 85 35" 
        stroke="hsl(var(--border))" 
        strokeWidth="1" 
        fill="none"
      />

      {/* Destination Pin */}
      <path 
        d="M85 35 A 12 12 0 1 1 85 11 A 12 12 0 0 1 85 35 Z" 
        fill="hsl(var(--primary))"
      />
      <circle cx="85" cy="23" r="4" fill="hsl(var(--primary-foreground))" />

      {/* Flag */}
      <path d="M85 11 L 85 5" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <path d="M85 5 L 95 8 L 85 11 Z" fill="hsl(140 80% 40%)" />
    </svg>
  );
}
