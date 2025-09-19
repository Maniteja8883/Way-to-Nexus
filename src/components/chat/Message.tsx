"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const { user: authUser } = useAuth();
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-md rounded-lg px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {message.content === "Thinking..." ? (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-[bounce_1s_infinite] rounded-full bg-current delay-0" />
            <span className="h-2 w-2 animate-[bounce_1s_infinite_200ms] rounded-full bg-current delay-200" />
            <span className="h-2 w-2 animate-[bounce_1s_infinite_400ms] rounded-full bg-current delay-400" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
            <AvatarImage src={authUser?.photoURL ?? undefined} />
            <AvatarFallback>
                {authUser?.email?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
            </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
