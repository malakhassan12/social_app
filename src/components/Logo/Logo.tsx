import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="group inline-flex flex-col items-start">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md transition-transform duration-300 group-hover:scale-105">
          C
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">Circle</h1>

          <p className="text-xs text-muted-foreground">
            Connect. Share. Discover.
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
