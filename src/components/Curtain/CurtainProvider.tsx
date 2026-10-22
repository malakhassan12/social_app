"use client";

import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  useCurtainTransition,
  type CurtainOptions,
} from "@/hooks/useCurtainTransition";

function CurtainPathnameObserver({
  onPathnameChange,
}: {
  onPathnameChange: (pathname: string) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onPathnameChange(pathname);
  }, [onPathnameChange, pathname]);

  return null;
}

type CurtainContextValue = {
  transition: (
    run: () => void | Promise<void>,
    options?: CurtainOptions,
  ) => Promise<void>;
  isTransitioning: boolean;
};

const CurtainContext = createContext<CurtainContextValue | null>(null);

export function useTransitionContext() {
  const ctx = useContext(CurtainContext);
  if (!ctx) {
    throw new Error(
      "useTransitionContext must be used inside <CurtainProvider>",
    );
  }
  return ctx;
}

export function CurtainProvider({ children }: { children: ReactNode }) {
  const { transition, isTransitioning, overlayRef, notifyPathnameChange } =
    useCurtainTransition();

  // Track theme so the overlay can swap its gradient.
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Curtain gradients — light = richer warm rose→orange→amber,
  // dark = brighter pastel rose→peach→cream so it glows against ink.
  const curtainGradient = isDark
    ? "linear-gradient(135deg, #fda4af 0%, #fdba74 50%, #fde68a 100%)"
    : "linear-gradient(135deg, #fb7185 0%, #fb923c 50%, #fcd34d 100%)";

  // Stripe ink flips: warm deep ink on light, warm cream on dark.
  const stripeColor = isDark
    ? "rgba(244, 237, 228, 0.55)"
    : "rgba(26, 30, 43, 0.55)";

  const vignette = isDark
    ? "radial-gradient(ellipse at center, transparent 0%, rgba(11,10,18,0.35) 100%)"
    : "radial-gradient(ellipse at center, transparent 0%, rgba(26,30,43,0.20) 100%)";

  return (
    <CurtainContext.Provider value={{ transition, isTransitioning }}>
      <Suspense fallback={null}>
        <CurtainPathnameObserver onPathnameChange={notifyPathnameChange} />
      </Suspense>

      {/* Curtain overlay */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-9999 opacity-0 transition-colors duration-300"
        style={{
          clipPath: "inset(100% 0 0 0)",
          background: curtainGradient,
        }}
      >
        {/* Curtain stripes (vertical velvet lines) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${stripeColor} 0px, ${stripeColor} 1px, transparent 1px, transparent 64px)`,
          }}
        />

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Vignette for dimensional depth */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: vignette }}
        />

        {/* Top footlight glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10 opacity-60"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
          }}
        />
      </div>

      {children}
    </CurtainContext.Provider>
  );
}