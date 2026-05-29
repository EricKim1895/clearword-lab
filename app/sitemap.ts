import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getAllWordPairs } from "@/lib/words";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/confusing-words", "/quiz", "/review"];
  const wordRoutes = getAllWordPairs().map((entry) => entry.seo.canonicalPath);

  return [...staticRoutes, ...wordRoutes].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route.startsWith("/confusing-words/") ? "monthly" : "weekly",
    priority: route === "/" ? 1 : route.startsWith("/confusing-words/") ? 0.8 : 0.7,
  }));
}
