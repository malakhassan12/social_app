import type React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Starting gradient color. */
  fromColor?: string;
  /** Middle gradient color. */
  viaColor?: string;
  /** Ending gradient color. */
  toColor?: string;
  /** Optional inner background class — defaults to card bg. */
  innerClassName?: string;
  /** Optional outer corner radius — must match inner. */
  radius?: "2xl" | "3xl" | "4xl";
  /** Inner glow intensity (0-100). */
  glowOpacity?: number;
}

const RADIUS_MAP = {
  "2xl": { outer: "rounded-2xl", inner: "rounded-[calc(1rem-2px)]" },
  "3xl": { outer: "rounded-3xl", inner: "rounded-[calc(1.5rem-2px)]" },
  "4xl": { outer: "rounded-4xl", inner: "rounded-[calc(2rem-2px)]" },
} as const;

export default function GlowingCard({
  fromColor = "#fb7185",
  viaColor = "#fb923c",
  toColor = "#fcd34d",
  radius = "3xl",
  glowOpacity = 30,
  innerClassName,
  className,
  children,
  ...props
}: GlowCardProps) {
  const gradient = `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`;
  const radii = RADIUS_MAP[radius];

  return (
    <div
      className={cn(
        "p-[1.5px] transition-all duration-500 ease-in-out hover:brightness-110",
        radii.outer,
        className,
      )}
      style={{ backgroundImage: gradient }}
      {...props}
    >
      <div className={cn("relative w-full overflow-hidden", radii.inner)}>
        {/* Inner ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-[filter] duration-500 ease-in-out"
          style={{
            backgroundImage: gradient,
            opacity: glowOpacity / 100,
            filter: "blur(24px)",
          }}
        />

        {/* Content */}
        <div
          className={cn(
            "relative flex flex-col gap-3 bg-white p-4 dark:bg-[#0f0d18]",
            innerClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}