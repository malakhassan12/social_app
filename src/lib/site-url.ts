const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://circle.com";

export const siteUrl = new URL(configuredSiteUrl).origin;
