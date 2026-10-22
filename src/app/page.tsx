"use client";

import { useSyncExternalStore } from "react";
import { Floating3DParticles } from "@/components/ui/floating-3d-particles";
import { ArrowRight, Lock, Sparkles, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/Buttons/ModeToggleBtn";
import GithubCardShiny from "@/components/animata/card/github-card-shiny";
import StackedSections from "@/components/animata/scroll/stacked-sections";
import LineByLineSlide from "@/components/animata/text/line-by-line-slide";
import { CurtainLink } from "@/components/Curtain/CurtainLink";
import Logo from "@/components/Logo/Logo";

const FEATURES = [
  "Posts",
  "Reactions",
  "Follows",
  "DMs & Groups",
  "Real-time",
  "Privacy",
];

const STACKED_PANES = [
  {
    eyebrow: "01 · Private by default",
    title: "You decide who sees what.",
    desc: "Control who follows you and who can comment on your posts. Your circle stays yours.",
    icon: Lock,
    gradient: "from-rose-400 via-orange-400 to-amber-300",
  },
  {
    eyebrow: "02 · Real-time",
    title: "Conversations that keep up with you.",
    desc: "Direct and group messages with reactions and live updates — no refresh required.",
    icon: Zap,
    gradient: "from-amber-300 via-orange-400 to-rose-400",
  },
  {
    eyebrow: "03 · Everything in one place",
    title: "Posts, reactions, and notifications — synced live.",
    desc: "One feed for the people you care about. Reshare what matters; mute what doesn't.",
    icon: Sparkles,
    gradient: "from-emerald-300 via-teal-300 to-cyan-300",
  },
];

const STEPS = [
  {
    title: "Create your profile",
    desc: "Set your privacy and who can comment.",
  },
  {
    title: "Find your circle",
    desc: "Follow accounts and send follow requests.",
  },
  {
    title: "Start sharing",
    desc: "Post, react, comment, and reshare in real time.",
  },
];

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const LandingPage = () => {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const color = isDark ? "#f5e6d3" : "#1a1e2b";

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#fdf9f3] font-sans text-[#1a1e2b] antialiased transition-colors duration-300 dark:bg-[#0b0a12] dark:text-[#f4ede4]">
      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-multiply dark:opacity-[0.035] dark:mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ───────────── Top bar ───────────── */}
      <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-black/6 bg-[#fdf9f3]/80 backdrop-blur-xl transition-colors dark:border-white/[0.08] dark:bg-[#0b0a12]/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
          {/* Left: Logo */}
          <div className="flex min-w-0 items-center">
            <Logo />
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ModeToggle />

            <CurtainLink
              href="/login"
              className="inline-flex h-9 items-center rounded-full border border-black/10 bg-black/[0.03] px-3 text-xs font-medium text-[#1a1e2b] backdrop-blur-sm transition-colors hover:bg-black/[0.06] sm:h-10 sm:px-4 sm:text-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-[#f4ede4] dark:hover:bg-white/[0.08]"
            >
              Sign in
            </CurtainLink>

            <CurtainLink
              href="/sign-up"
              className="hidden h-10 items-center rounded-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 px-4 text-sm font-semibold text-[#1a1e2b] shadow-[0_8px_24px_-8px_rgba(251,113,133,0.6)] transition-transform hover:-translate-y-0.5 sm:inline-flex dark:text-[#0b0a12] dark:shadow-[0_8px_24px_-8px_rgba(251,113,133,0.7)]"
              transitionOptions={{ coverEffect: "doors", revealEffect: "iris" }}
            >
              Create account
            </CurtainLink>
          </div>
        </div>
      </header>

      {/* Header spacer — because header is fixed */}
      <div aria-hidden className="h-42.5 sm:h-16" />

      {/* ───────────── Particle layer ───────────── */}
      <Floating3DParticles color={color} />

      {/* ───────────── Hero ───────────── */}
      <section
        data-aos="zoom-in"
        className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-4 mt-4"
      >
        <div className="relative flex min-h-[30rem] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-4 py-14 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:min-h-[34rem] sm:rounded-[2rem] sm:px-8 sm:py-16 md:min-h-[38rem] dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-none">
          {/* Warm ambient blobs */}
          <div className="absolute -left-40 -top-40 h-72 w-72 rounded-full bg-rose-400/20 blur-[100px] sm:h-[28rem] sm:w-[28rem] sm:blur-[140px] dark:bg-rose-500/25" />
          <div className="absolute -bottom-40 -right-40 h-72 w-72 rounded-full bg-amber-300/25 blur-[100px] sm:h-[28rem] sm:w-[28rem] sm:blur-[140px] dark:bg-amber-400/20" />
          <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-orange-300/15 blur-[80px] sm:h-72 sm:w-72 sm:blur-[120px] dark:bg-orange-500/15" />

          {/* Curtain stripes (light) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] dark:hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(26,30,43,0.9) 0px, rgba(26,30,43,0.9) 1px, transparent 1px, transparent 64px)",
            }}
          />
          {/* Curtain stripes (dark) */}
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-[0.06] dark:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 64px)",
            }}
          />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(253,249,243,0.35)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,10,18,0.5)_100%)]" />

          {/* Hero content */}
          <div className="relative z-10 flex w-full flex-col items-center gap-5 text-center sm:gap-6 md:gap-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-300/[0.12] px-3 py-1 text-[11px] font-medium text-rose-700 backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs dark:border-rose-300/20 dark:bg-rose-300/[0.06] dark:text-rose-200/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75 dark:bg-rose-300" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400 dark:bg-rose-300" />
              </span>
              Small, trusted circles
            </span>

            {/* Headline — responsive height */}
            <LineByLineSlide
              text={[
                "Your people,\nyour circle.",
                "Share moments,\nstay closer.",
              ]}
              titleTag="h1"
              titleClassName="max-w-3xl text-balance text-3xl font-bold leading-[1.1] tracking-tight text-[#1a1e2b] sm:text-4xl md:text-6xl lg:text-7xl dark:text-[#f4ede4]"
              className="h-32 max-w-3xl sm:h-36 md:h-40"
            />

            <p className="max-w-xl text-pretty text-sm leading-relaxed text-[#1a1e2b]/60 sm:max-w-2xl sm:text-base md:text-lg dark:text-[#f4ede4]/55">
              Share posts, react to moments, and message the people who matter —
              with privacy controls, real-time updates, and group conversations
              that keep your circle connected.
            </p>

            {/* CTAs — stack on mobile, row on sm */}
            <div className="mt-1 flex w-full max-w-sm flex-col items-stretch justify-center gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:gap-3">
              <CurtainLink
                href="/sign-up"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 px-6 text-sm font-semibold text-[#1a1e2b] shadow-[0_12px_32px_-10px_rgba(251,113,133,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(251,146,60,0.6)] sm:h-12 sm:px-7 sm:text-base dark:text-[#0b0a12] dark:shadow-[0_12px_32px_-10px_rgba(251,113,133,0.8)] dark:hover:shadow-[0_16px_40px_-10px_rgba(251,146,60,0.9)]"
                transitionOptions={{
                  coverEffect: "doors",
                  revealEffect: "iris",
                }}
              >
                Join your circle
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </CurtainLink>

              <a
                href="#features"
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] px-6 text-sm font-medium text-[#1a1e2b]/90 backdrop-blur-md transition-colors hover:bg-black/[0.06] sm:h-12 sm:px-7 sm:text-base dark:border-white/10 dark:bg-white/[0.04] dark:text-[#f4ede4]/90 dark:hover:bg-white/[0.08]"
              >
                Explore features
              </a>
            </div>

            {/* Feature chips */}
            <ul className="mt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-black/[0.08] bg-black/[0.02] px-2.5 py-0.5 text-[10px] text-[#1a1e2b]/55 backdrop-blur-sm sm:px-3 sm:py-1 sm:text-xs dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#f4ede4]/55"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── Stacked feature panes ───────────── */}
      <section
        data-aos="zoom-out"
        id="features"
        className="relative z-10 mx-auto mt-16 w-full max-w-6xl scroll-mt-20 px-3 sm:mt-24 sm:px-4 md:mt-28"
      >
        <div className="mb-8 max-w-2xl sm:mb-10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-600/70 sm:text-xs dark:text-rose-300/70">
            Made for your people
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Social, with more{" "}
            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-rose-300 dark:via-orange-300 dark:to-amber-200">
              intention
            </span>
            .
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-sm text-[#1a1e2b]/55 sm:text-base dark:text-[#f4ede4]/50">
            Keep your community close without putting your life on display.
            Scroll to explore what makes Circle different.
          </p>
        </div>

        <StackedSections
          withDramaEffect
          stackOffset={48}
          paneGap="gap-3"
          scrollRunway="28vh"
        >
          {STACKED_PANES.map(
            ({ eyebrow, title, desc, icon: Icon, gradient }) => (
              <div
                key={eyebrow}
                className="relative flex min-h-[16rem] flex-col justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-2xl shadow-black/[0.06] sm:min-h-[19rem] sm:rounded-[2rem] sm:p-8 md:min-h-[22rem] md:p-12 dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-black/40"
              >
                {/* Per-pane glow */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-rose-400/10 blur-[100px] sm:h-72 sm:w-72 dark:bg-rose-500/15" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-amber-300/10 blur-[100px] sm:h-72 sm:w-72 dark:bg-amber-400/10" />

                {/* Curtain lines (light) */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04] dark:hidden"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #1a1e2b 0px, #1a1e2b 1px, transparent 1px, transparent 48px)",
                  }}
                />
                {/* Curtain lines (dark) */}
                <div
                  className="pointer-events-none absolute inset-0 hidden opacity-[0.05] dark:block"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 48px)",
                  }}
                />

                <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span
                      className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-[#1a1e2b] shadow-[0_8px_24px_-8px_rgba(251,146,60,0.4)] sm:size-12 sm:rounded-2xl dark:text-[#0b0a12] dark:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.6)]`}
                    >
                      <Icon className="size-5 sm:size-6" strokeWidth={2.2} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1e2b]/45 sm:text-xs dark:text-[#f4ede4]/45">
                      {eyebrow}
                    </span>
                  </div>

                  <h3 className="max-w-2xl text-balance text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                    {title}
                  </h3>
                  <p className="max-w-xl text-pretty text-xs leading-relaxed text-[#1a1e2b]/60 sm:text-sm md:text-base dark:text-[#f4ede4]/55">
                    {desc}
                  </p>

                  <div
                    className={`mt-1 h-px w-12 bg-gradient-to-r sm:w-16 ${gradient} opacity-60`}
                  />
                </div>
              </div>
            ),
          )}
        </StackedSections>
      </section>

      {/* ───────────── How it works + Shiny card ───────────── */}
      <section data-aos="zoom-out" className="relative z-10 mx-auto mt-16 grid w-full max-w-6xl items-center gap-8 px-3 sm:mt-24 sm:gap-10 sm:px-4 md:mt-28 md:grid-cols-2">
        <div className="py-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Get started in{" "}
            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-rose-300 dark:via-orange-300 dark:to-amber-200">
              three steps
            </span>
          </h2>
          <p className="mt-3 text-sm text-[#1a1e2b]/55 sm:text-base dark:text-[#f4ede4]/50">
            Circle is designed to feel familiar from the first minute.
          </p>

          <ol className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3 sm:gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 bg-black/[0.03] text-xs font-semibold text-rose-600 sm:size-9 sm:text-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-rose-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium sm:text-base">{s.title}</p>
                  <p className="text-xs text-[#1a1e2b]/55 sm:text-sm dark:text-[#f4ede4]/50">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex w-full justify-center md:justify-end">
          <GithubCardShiny className="w-full max-w-md" />
        </div>
      </section>

      {/* ───────────── Footer CTA ───────────── */}
      <section data-aos="zoom-out" className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-3 pb-10 sm:mt-24 sm:px-4 sm:pb-16 md:mt-28">
        <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-4 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:rounded-[2rem] sm:px-8 sm:py-14 md:py-16 dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-none">
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-rose-400/20 blur-[100px] sm:h-80 sm:w-80 sm:blur-[130px] dark:bg-rose-500/20" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-amber-300/20 blur-[100px] sm:h-80 sm:w-80 sm:blur-[130px] dark:bg-amber-400/15" />

          {/* Curtain lines (light) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] dark:hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(26,30,43,0.9) 0px, rgba(26,30,43,0.9) 1px, transparent 1px, transparent 64px)",
            }}
          />
          {/* Curtain lines (dark) */}
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-[0.05] dark:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 64px)",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to bring your circle closer?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-sm text-[#1a1e2b]/60 sm:text-base dark:text-[#f4ede4]/55">
              Create an account and start sharing with the people who matter.
            </p>
            <CurtainLink
              href="/sign-up"
              className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 px-6 text-sm font-semibold text-[#1a1e2b] shadow-[0_12px_32px_-10px_rgba(251,113,133,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(251,146,60,0.6)] sm:h-12 sm:px-8 sm:text-base dark:text-[#0b0a12] dark:shadow-[0_12px_32px_-10px_rgba(251,113,133,0.8)] dark:hover:shadow-[0_16px_40px_-10px_rgba(251,146,60,0.9)]"
              transitionOptions={{ coverEffect: "doors", revealEffect: "iris" }}
            >
              Get started — it&apos;s free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </CurtainLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
