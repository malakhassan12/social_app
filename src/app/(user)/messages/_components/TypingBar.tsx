"use client";

import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";

export default function TypingBar({
  conversationId,
}: {
  conversationId: string;
}) {
  const typingUsers = useTypingIndicator(conversationId);

  if (typingUsers.size === 0) return null;

  const users = Array.from(typingUsers.values());
  const count = users.length;

  const label =
    count === 1
      ? `${users[0].accountName} is typing`
      : count === 2
      ? `${users[0].accountName} and ${users[1].accountName} are typing`
      : `${users[0].accountName} and ${count - 1} others are typing`;

  return (
    <div
      className="
        relative flex items-center
        px-3 sm:px-4
        py-2
        animate-in fade-in slide-in-from-bottom-2 duration-300
      "
    >
      {/* Bubble */}
      <div
        className="
          relative flex items-center gap-2.5
          rounded-full
          bg-linear-to-r
            from-green-50 to-emerald-50
            dark:from-green-950/40 dark:to-emerald-950/30
          border border-green-100 dark:border-green-900/50
          pl-1.5 pr-3.5 py-1
          shadow-sm shadow-green-500/5
          backdrop-blur-sm
          max-w-[85%] sm:max-w-md
        "
      >
        {/* Avatar stack */}
        <div className="flex -space-x-2.5 shrink-0">
          {users.slice(0, 3).map((user, idx) => (
            <div
              key={user.accountId}
              className="
                relative
                ring-2 ring-white dark:ring-gray-900
                rounded-full
                transition-transform duration-200
                hover:scale-110 hover:z-10
                animate-in zoom-in-50 duration-300
              "
              style={{
                animationDelay: `${idx * 60}ms`,
                zIndex: users.length - idx,
              }}
            >
              <ProfileAvatar
                name={user.accountName}
                image={user.accountImage}
              />
            </div>
          ))}

          {/* +N indicator */}
          {count > 3 && (
            <div
              className="
                h-7 w-7 sm:h-8 sm:w-8
                rounded-full
                bg-green-500 text-white
                text-[10px] sm:text-xs font-bold
                flex items-center justify-center
                ring-2 ring-white dark:ring-gray-900
                shrink-0
                animate-in zoom-in-50 duration-300
              "
              style={{ animationDelay: "180ms" }}
            >
              +{count - 3}
            </div>
          )}
        </div>

        {/* Text + dots */}
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className="
              text-[11px] sm:text-xs
              font-medium
              text-green-700 dark:text-green-300
              truncate
              select-none
            "
          >
            {label}
          </p>

          {/* Animated dots */}
          <span className="flex items-center gap-0.5 shrink-0">
            <span
              className="
                h-1 w-1 sm:h-1.5 sm:w-1.5
                rounded-full
                bg-green-500 dark:bg-green-400
                animate-bounce
              "
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <span
              className="
                h-1 w-1 sm:h-1.5 sm:w-1.5
                rounded-full
                bg-green-500 dark:bg-green-400
                animate-bounce
              "
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <span
              className="
                h-1 w-1 sm:h-1.5 sm:w-1.5
                rounded-full
                bg-green-500 dark:bg-green-400
                animate-bounce
              "
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}