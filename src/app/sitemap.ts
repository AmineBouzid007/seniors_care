import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/services", "/booking", "/contact"].map((p) => ({ url: siteUrl() + p, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
