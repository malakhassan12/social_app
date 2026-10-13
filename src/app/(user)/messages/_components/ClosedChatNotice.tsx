
// =====================================================
// ClosedChatNotice.tsx
// =====================================================

import { Lock } from "lucide-react";
import { FC } from "react";

type Props = {
  /** Optional: show a different message to admins who closed it */
  isAdmin?: boolean;
};

const ClosedChatNotice: FC<Props> = ({ isAdmin = false }) => {
  return (
    <div className="p-2">
      <div
        className="
          flex items-center justify-center gap-2.5
          rounded-lg border border-dashed border-border/70
          bg-muted/30 px-4 py-3
          dark:bg-muted/10
        "
      >
        <span
          className="
            flex size-7 shrink-0 items-center justify-center
            rounded-md bg-muted text-muted-foreground
          "
        >
          <Lock className="size-3.5" />
        </span>

        <p className="text-xs text-muted-foreground">
          {isAdmin
            ? "You closed this chat. Reopen it to send messages."
            : "This chat has been closed by an admin."}
        </p>
      </div>
    </div>
  );
};

export default ClosedChatNotice;