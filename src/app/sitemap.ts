import type { MetadataRoute } from "next";
import { publicRoutes, sitemapEntry } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => sitemapEntry(route.path, route.priority));
}
