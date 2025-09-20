
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
        <linearGradient id="roadGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--muted-foreground))', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--foreground))', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Winding Road with perspective, centered */}
      <path 
        d="M 40 95 C 20 70, 80 70, 62 45 L 58 45 C 75 70, 35 70, 60 95 Z" 
        fill="url(#roadGradient)"
      />
       <path 
        d="M 40 95 C 20 70, 80 70, 62 45" 
        stroke="hsl(var(--border))" 
        strokeWidth="0.5" 
        fill="none"
      />
       <path 
        d="M 60 95 C 35 70, 75 70, 58 45" 
        stroke="hsl(var(--border))" 
        strokeWidth="0.5" 
        fill="none"
      />

      {/* Destination Pin, centered */}
      <path 
        d="M60 45 A 12 12 0 1 1 60 21 A 12 12 0 0 1 60 45 Z" 
        fill="hsl(var(--primary))"
      />
      <circle cx="60" cy="33" r="4" fill="hsl(var(--primary-foreground))" />

      {/* Flag */}
      <path d="M60 21 L 60 15" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      <path d="M60 15 L 70 18 L 60 21 Z" fill="hsl(140 80% 40%)" />
    </svg>
  );
}
