import { CurtainLink } from "../Curtain/CurtainLink";

const Logo = () => {
  return (
    <CurtainLink
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-full py-1 pr-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf9f3] dark:focus-visible:ring-offset-[#0b0a12]"
      aria-label="Circle — home"
    >
      {/* Mark */}
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-linear-to-br from-rose-400 via-orange-400 to-amber-300 text-sm font-bold text-[#1a1e2b] shadow-[0_0_24px_-4px_rgba(251,146,60,0.4)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 dark:text-[#0b0a12] dark:shadow-[0_0_24px_-4px_rgba(251,146,60,0.6)]">
        {/* Soft inner highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_60%)]"
        />
        {/* Subtle curtain stripes inside the mark */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #1a1e2b 0px, #1a1e2b 1px, transparent 1px, transparent 6px)",
          }}
        />
        <span className="relative z-10">C</span>
      </span>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span className="text-base font-semibold tracking-tight text-[#1a1e2b] sm:text-lg dark:text-[#f4ede4]">
          Circle
        </span>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#1a1e2b]/45 sm:block dark:text-[#f4ede4]/45">
          Small &amp; trusted
        </span>
      </span>
    </CurtainLink>
  );
};

export default Logo;