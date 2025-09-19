import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Link href="/" aria-label="Back to homepage">
                <Logo className="h-20 w-20 text-primary" />
            </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
