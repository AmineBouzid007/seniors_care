import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "./globals.css";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Seniors Care | Home care for seniors in Tunisia", template: "%s | Seniors Care" },
  description: "Compassionate, professional elderly care at home in every governorate of Tunisia. Home visits, medication help, personal care, emotional support and more.",
  openGraph: { type: "website", siteName: "Seniors Care", locale: "en_TN", images: ["/images/hero_welc.jpg"] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#06202b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
