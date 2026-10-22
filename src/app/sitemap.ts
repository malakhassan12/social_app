import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/privacy", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: new URL("/terms", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}