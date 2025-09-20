
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
            <radialGradient id="nexusGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 0.75}} />
                <stop offset="100%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 0}} />
            </radialGradient>
        </defs>
        
        {/* Glow */}
        <circle cx="50" cy="50" r="30" fill="url(#nexusGlow)" />

        {/* Central nexus point */}
        <circle cx="50" cy="50" r="8" fill="currentColor" />

        {/* Radiating paths */}
        <path d="M50 50 L85 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M50 50 L15 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M50 50 L15 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M50 50 L85 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M50 50 L50 10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M50 50 L50 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M50 50 L10 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M50 50 L90 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}
