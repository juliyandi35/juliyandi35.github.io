import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/?*q=", "/?*page="],
      },
    ],
    sitemap: "https://juliyandi35.github.io/sitemap.xml",
  };
}
