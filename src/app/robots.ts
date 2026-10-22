import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/create-post",
        "/explore",
        "/home",
        "/image/",
        "/messages",
        "/messages/",
        "/notifications",
        "/notifications/",
        "/post/",
        "/profile",
        "/profile/",
        "/select-account",
        "/settings",
        "/settings/",
        "/suggestions",
        "/videos",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}