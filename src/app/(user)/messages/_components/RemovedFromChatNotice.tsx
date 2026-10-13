// components/chat/RemovedFromChatNotice.tsx
"use client";

import { UserMinus } from "lucide-react";

type Props = {
  nameRemoved: string;
  className?: string;
};

const RemovedFromChatNotice = ({ nameRemoved, className }: Props) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-2 p-6 text-center ${className ?? ""}`}
    >
      <UserMinus className="h-8 w-8 text-muted-foreground" aria-hidden />

      <p className="text-sm font-medium text-foreground">
        <span className="font-semibold">{nameRemoved}</span>, you were removed
        from this conversation
      </p>

      <p className="text-xs text-muted-foreground">
        You can no longer send or receive messages here.
      </p>
    </div>
  );
};

export default RemovedFromChatNotice;