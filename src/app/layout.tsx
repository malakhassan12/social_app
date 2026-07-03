import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Circle",
    template: "%s | Circle",
  },
  description:
    "Circle is a modern social media platform where you can share posts, connect with friends, discover new people, and engage with communities in real time.",

  keywords: [
    "social media",
    "social network",
    "posts",
    "friends",
    "community",
    "chat",
    "sharing",
    "next.js",
    "Circle",
  ],

  authors: [
    {
      name: "Malak Hassan",
    },
  ],

  creator: "Malak Hassan",

  applicationName: "Circle",

  category: "Social Networking",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Circle",
    description:
      "Share moments, connect with people, and explore communities on Circle.",
    type: "website",
    locale: "en_US",
    siteName: "Circle",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Circle Social App",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Circle",
    description:
      "Share moments, connect with people, and explore communities on Circle.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  metadataBase: new URL("https://Circle.com"),
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
