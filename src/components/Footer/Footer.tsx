import Link from "next/link";
import { Heart } from "lucide-react";
import Logo from "../Logo/Logo";
import { footerData, socialLinks } from "@/constants/Footer.constants";
import { linkedIn_URL } from "@/constants/profile.constants";

export function SimpleFooter() {
  const currentYear = "2026";

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

            {/* LinkedIn Icon - Malak Hassan */}
            <a
              href={linkedIn_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
              aria-label="Malak Hassan on LinkedIn"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM7.2 10H5v9h2.2v-9ZM6.1 5.8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM19 14c0-2.4-1.3-3.5-3-3.5-1.4 0-2 .8-2.4 1.3V10H11v9h2.6v-4.5c0-1.2.2-2.4 1.7-2.4s1.5 1.4 1.5 2.5V19H19v-5Z" />
              </svg>
            </a>

            <span className="w-px h-6 bg-border mx-1" />
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} SocialApp. Built with{" "}
            <Heart className="inline w-3 h-3 text-red-500 animate-pulse" />{" "}
            using Next.js & TypeScript by{" "}
            <a
              href={linkedIn_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Malak Hassan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}