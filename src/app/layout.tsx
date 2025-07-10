import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OneClickDrive - Your Complete Driving Solution",
    template: "%s | OneClickDrive",
  },
  description:
    "OneClickDrive makes your driving experience seamless with comprehensive vehicle management, services.",
  keywords: [
    "driving",
    "vehicle management",
    "car services",
    "OneClickDrive",
    "OCD",
    "vehicle maintenance",
    "car rental",
    "driving solutions",
  ],
  authors: [{ name: "OneClickDrive Team", url: "https://oneclickdrive.com" }],
  creator: "OneClickDrive",
  publisher: "OneClickDrive",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/images/ocd_app_icon.webp",
        sizes: "32x32",
        type: "image/webp",
      },
      {
        url: "/images/ocd_app_icon.webp",
        sizes: "16x16",
        type: "image/webp",
      },
      {
        url: "/images/ocd_app_icon.webp",
        sizes: "192x192",
        type: "image/webp",
      },
    ],
    apple: [
      {
        url: "/images/ocd_app_icon.webp",
        sizes: "180x180",
        type: "image/webp",
      },
    ],
    shortcut: "/images/ocd_app_icon.webp",
  },
  category: "automotive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
