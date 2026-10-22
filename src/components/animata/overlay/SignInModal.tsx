"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Code2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "lg";

interface SignInModalProps {
  modalSize?: ModalSize;
  triggerClassName?: string;
  triggerLabel?: string;
}

export default function SignInModal({
  modalSize = "lg",
  triggerClassName,
  triggerLabel = "Sign in",
}: SignInModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Focus first field on open
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: wire to your auth endpoint (NextAuth, Supabase, etc.)
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex h-10 items-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-5 text-sm font-medium text-white shadow-md shadow-violet-500/30 transition-all hover:brightness-110",
          triggerClassName,
        )}
      >
        {triggerLabel}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 cursor-default border-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="signin-title"
              aria-describedby="signin-desc"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={cn(
                "relative z-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-6 text-white shadow-2xl shadow-indigo-950/60 sm:p-8",
                modalSize === "sm" ? "max-w-sm" : "max-w-md",
              )}
            >
              {/* Ambient glows */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

              {/* Grid overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Header */}
              <div className="relative z-10">
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <span className="text-lg font-bold">C</span>
                </div>
                <h2
                  id="signin-title"
                  className="text-2xl font-bold tracking-tight"
                >
                  Welcome back to Circle
                </h2>
                <p
                  id="signin-desc"
                  className="mt-1 text-sm text-white/60"
                >
                  Sign in to catch up with your people — posts, reactions, and
                  group chats waiting for you.
                </p>
              </div>

              {/* OAuth */}
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10"
                >
                  <Code2 className="size-4" />
                  GitHub
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10"
                >
                  <Mail className="size-4" />
                  Google
                </button>
              </div>

              {/* Divider */}
              <div className="relative z-10 my-5 flex items-center gap-3 text-xs text-white/40">
                <span className="h-px flex-1 bg-white/10" />
                or continue with email
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="relative z-10 flex flex-col gap-3"
              >
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-white/70">Email</span>
                  <input
                    ref={firstFieldRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@circle.app"
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 outline-none backdrop-blur transition-colors focus:border-violet-400/60 focus:bg-white/10"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Password</span>
                    <button
                      type="button"
                      className="text-xs text-violet-300 transition-colors hover:text-violet-200"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 pr-10 text-sm text-white placeholder:text-white/30 outline-none backdrop-blur transition-colors focus:border-violet-400/60 focus:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-6 font-semibold text-white shadow-lg shadow-violet-500/40 transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="relative z-10 mt-5 text-center text-sm text-white/60">
                New to Circle?{" "}
                <button
                  type="button"
                  className="font-medium text-white underline-offset-4 hover:underline"
                >
                  Create an account
                </button>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}