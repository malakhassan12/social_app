
import { MessageSquare, Sparkles } from "lucide-react";

export default function DefaultConversation() {
  return (
    <div
      className="
        relative flex flex-col items-center justify-center
        gap-5 px-6 py-10 text-center
        m-auto
        select-none
        animate-in fade-in zoom-in-95 duration-500
      "
    >
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          flex items-center justify-center
        "
      >
        <div
          className="
            h-40 w-40 sm:h-52 sm:w-52
            rounded-full
            bg-linear-to-br from-green-400/20 via-emerald-400/10 to-transparent
            blur-3xl
            animate-pulse
          "
          style={{ animationDuration: "4s" }}
        />
      </div>

      {/* Icon cluster */}
      <div className="relative">
        {/* Outer ring pulse */}
        <span
          aria-hidden
          className="
            absolute inset-0 rounded-full
            bg-green-400/20
            animate-ping
          "
          style={{ animationDuration: "2.5s" }}
        />

        {/* Main icon */}
        <div
          className="
            relative flex h-16 w-16 sm:h-20 sm:w-20
            items-center justify-center
            rounded-2xl
            bg-linear-to-br from-green-400 to-emerald-500
            shadow-lg shadow-green-500/30
            ring-4 ring-white/60 dark:ring-gray-900/60
            backdrop-blur-sm
            transition-transform duration-300
            hover:scale-105 hover:rotate-3
          "
        >
          <MessageSquare
            className="
              h-7 w-7 sm:h-9 sm:w-9
              text-white
              drop-shadow-sm
            "
            strokeWidth={2.2}
          />
        </div>

        {/* Sparkle accent */}
        <Sparkles
          className="
            absolute -top-2 -right-2
            h-5 w-5
            text-emerald-400
            animate-pulse
          "
          style={{ animationDuration: "2s" }}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-1.5 max-w-xs">
        <h3
          className="
            text-lg sm:text-xl
            font-semibold
            tracking-tight
            bg-linear-to-r from-gray-900 to-gray-700
              dark:from-white dark:to-gray-300
            bg-clip-text text-transparent
          "
        >
          Pick a conversation
        </h3>

        <p
          className="
            text-sm sm:text-[15px]
            leading-relaxed
            text-gray-500 dark:text-gray-400
          "
        >
          Select a chat from the sidebar to start messaging
        </p>
      </div>

      {/* Subtle hint pill */}
      <div
        className="
          mt-1
          inline-flex items-center gap-1.5
          rounded-full
          border border-gray-200/80 dark:border-gray-800
          bg-gray-50/80 dark:bg-gray-900/60
          px-3 py-1
          text-[11px] sm:text-xs
          font-medium
          text-gray-500 dark:text-gray-400
          backdrop-blur-sm
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        Ready when you are
      </div>
    </div>
  );
}