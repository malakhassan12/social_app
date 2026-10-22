"use client";

import { Bell, MessageCircle, UserPlus } from "lucide-react";
import { useCallback, useRef } from "react";

import { cn } from "@/lib/utils";
import { useMousePosition } from "@/hooks/useMousePosition";

const ACTIVITIES = [
  {
    icon: UserPlus,
    title: "New follow request",
    detail: "Ava wants to join your circle",
    time: "just now",
    tone: "text-rose-600 bg-rose-400/15 border-rose-400/30 dark:text-rose-300 dark:bg-rose-400/10 dark:border-rose-300/25",
  },
  {
    icon: Bell,
    title: "Ava reacted to your post",
    detail: "❤️ on “Weekend in the hills”",
    time: "1m",
    tone: "text-amber-600 bg-amber-400/15 border-amber-400/30 dark:text-amber-300 dark:bg-amber-400/10 dark:border-amber-300/25",
  },
  {
    icon: MessageCircle,
    title: "Group message sent",
    detail: "“Trailhead at 7?” — 3 replies",
    time: "2m",
    tone: "text-orange-600 bg-orange-400/15 border-orange-400/30 dark:text-orange-300 dark:bg-orange-400/10 dark:border-orange-300/25",
  },
];

export default function GithubCardShiny({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) return;

    const { width, height } = overlayRef.current.getBoundingClientRect();
    overlayRef.current.style.setProperty("--x", `${x - width / 2}px`);
    overlayRef.current.style.setProperty("--y", `${y - height / 2}px`);
  }, []);

  useMousePosition(containerRef, update);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/shiny relative w-96 min-w-fit max-w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 text-[#1a1e2b] shadow-2xl shadow-black/[0.06] dark:border-white/[0.06] dark:bg-[#0f0d18] dark:text-[#f4ede4] dark:shadow-black/40",
        className,
      )}
    >
      {/* Mouse-follow shine */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute z-0 h-64 w-64 rounded-full bg-rose-400/40 opacity-0 blur-3xl transition-opacity duration-300 group-hover/shiny:opacity-40 dark:bg-white dark:opacity-0 dark:group-hover/shiny:opacity-25"
        style={{ transform: "translate(var(--x), var(--y))" }}
      />

      {/* Ambient corner glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-500/25" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-400/20" />

      {/* Subtle grid — light version */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1a1e2b 1px, transparent 1px), linear-gradient(to bottom, #1a1e2b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Subtle grid — dark version */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.06] dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Curtain stripes — light */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #1a1e2b 0px, #1a1e2b 1px, transparent 1px, transparent 64px)",
        }}
      />
      {/* Curtain stripes — dark */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.05] dark:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 64px)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          activity.log · realtime
        </div>
        <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-rose-600 backdrop-blur dark:border-rose-300/25 dark:bg-rose-300/[0.08] dark:text-rose-200/90">
          Live
        </span>
      </div>

      {/* Activity list */}
      <div className="relative z-10 mt-6 flex flex-col gap-2">
        {ACTIVITIES.map(({ icon: Icon, title, detail, time, tone }) => (
          <div
            key={title}
            className="group/item flex items-start gap-3 rounded-xl border border-black/[0.06] bg-black/[0.02] p-3 backdrop-blur-sm transition-colors hover:border-black/10 hover:bg-black/[0.04] dark:border-white/5 dark:bg-white/[0.03] dark:hover:border-white/10 dark:hover:bg-white/[0.06]"
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg border",
                tone,
              )}
            >
              <Icon className="size-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#1a1e2b] dark:text-white/95">
                {title}
              </p>
              <p className="truncate text-xs text-[#1a1e2b]/55 dark:text-white/50">
                {detail}
              </p>
            </div>

            <span className="shrink-0 text-[11px] tabular-nums text-[#1a1e2b]/40 dark:text-white/40">
              {time}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4 text-[11px] text-[#1a1e2b]/40 dark:border-white/10 dark:text-white/40">
        <span>Showing last 3 events</span>
        <span className="inline-flex items-center gap-1 text-[#1a1e2b]/60 dark:text-white/60">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
      </div>
    </div>
  );
}