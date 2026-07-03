
import Link from "next/link";
import { Heart,  } from "lucide-react";
import Logo from "../Logo/Logo";
import { footerData, socialLinks } from "@/constants/Footer.constants";

export function SimpleFooter() {
  const currentYear = "2026"

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section - Brand & Links */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <Logo />

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {footerData.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Social Icons & Theme Toggle */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}

            <span className="w-px h-6 bg-border mx-1" />
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} SocialApp. Built with{" "}
            <Heart className="inline w-3 h-3 text-red-500 animate-pulse" />{" "}
            using Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
