"use client";

import { useCallback, useRef, useState } from "react";
import { animate } from "motion/react";
import { useTheme } from "next-themes";

export type CurtainEffect = "iris" | "wipe" | "clipWipe" | "doors";

export interface CurtainOptions {
  coverEffect?: CurtainEffect;
  revealEffect?: CurtainEffect;
  duration?: number;
  color?: string;
  awaitNavigation?: boolean;
  navigationTimeoutMs?: number;
}

const LIGHT_CURTAIN =
  "linear-gradient(135deg, #fb7185 0%, #fb923c 50%, #fcd34d 100%)";
const DARK_CURTAIN =
  "linear-gradient(135deg, #fda4af 0%, #fdba74 50%, #fde68a 100%)";

const COVER_FRAMES: Record<CurtainEffect, [string, string]> = {
  iris: ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"],
  wipe: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  clipWipe: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
  doors: ["inset(0 50% 0 50%)", "inset(0 0 0 0)"],
};

const REVEAL_FRAMES: Record<CurtainEffect, [string, string]> = {
  iris: ["circle(150% at 50% 50%)", "circle(0% at 50% 50%)"],
  wipe: ["inset(0 0 0 0)", "inset(0 0 0 100%)"],
  clipWipe: ["inset(0 0 0 0)", "inset(0 100% 0 0)"],
  doors: ["inset(0 0 0 0)", "inset(0 50% 0 50%)"],
};

export function useCurtainTransition() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);
  const pathnameRef = useRef<string | null>(null);
  const navigationWaiterRef = useRef<{
    from: string | null;
    resolve: () => void;
    timeoutId: number;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { resolvedTheme } = useTheme();

  const notifyPathnameChange = useCallback((pathname: string) => {
    pathnameRef.current = pathname;
    const waiter = navigationWaiterRef.current;
    if (waiter && pathname !== waiter.from) {
      window.clearTimeout(waiter.timeoutId);
      navigationWaiterRef.current = null;
      waiter.resolve();
    }
  }, []);

  const transition = useCallback(
    async (
      run: () => void | Promise<void>,
      options: CurtainOptions = {},
    ) => {
      if (isAnimating.current || !overlayRef.current) return;

      const {
        coverEffect = "iris",
        revealEffect = "wipe",
        duration = 0.9,
        color,
        awaitNavigation = false,
        navigationTimeoutMs = 2000,
      } = options;

      isAnimating.current = true;
      setIsTransitioning(true);

      const overlay = overlayRef.current;

      // Theme-aware fallback: only overridden when caller passes `color`
      const themedBackground =
        resolvedTheme === "dark" ? DARK_CURTAIN : LIGHT_CURTAIN;
      overlay.style.background = color ?? themedBackground;

      let navigationPromise: Promise<void> | undefined;
      let transitionError: unknown;

      try {
        const [coverFrom, coverTo] = COVER_FRAMES[coverEffect];
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        overlay.style.clipPath = coverFrom;

        await animate(
          overlay,
          { clipPath: [coverFrom, coverTo] },
          { duration: duration / 2, ease: [0.76, 0, 0.24, 1] },
        );

        if (awaitNavigation) {
          const from = pathnameRef.current;
          navigationPromise = new Promise<void>((resolve) => {
            const timeoutId = window.setTimeout(() => {
              navigationWaiterRef.current = null;
              resolve();
            }, navigationTimeoutMs);

            navigationWaiterRef.current = { from, resolve, timeoutId };
          });
        }

        await run();

        if (
          navigationPromise &&
          pathnameRef.current === navigationWaiterRef.current?.from
        ) {
          await navigationPromise;
        }

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      } catch (error) {
        transitionError = error;
      }

      try {
        const [revealFrom, revealTo] = REVEAL_FRAMES[revealEffect];
        await animate(
          overlay,
          { clipPath: [revealFrom, revealTo] },
          { duration: duration / 2, ease: [0.76, 0, 0.24, 1] },
        );
      } catch (error) {
        transitionError ??= error;
      } finally {
        const waiter = navigationWaiterRef.current;
        if (waiter) {
          window.clearTimeout(waiter.timeoutId);
          navigationWaiterRef.current = null;
          waiter.resolve();
        }

        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        overlay.style.clipPath = "inset(100% 0 0 0)";
        isAnimating.current = false;
        setIsTransitioning(false);
      }

      if (transitionError) {
        throw transitionError;
      }
    },
    [resolvedTheme], // ← new dependency
  );

  return { transition, isTransitioning, overlayRef, notifyPathnameChange };
}