import type { Metadata, Viewport } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mr Frog's World — Happy Birthday Amelia",
  description:
    "A notebook gallery of Amelia's Mr Frog drawings, sprites, and short videos. Happy 12th birthday.",
};

export const viewport: Viewport = {
  themeColor: "#faf6ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={kalam.variable}>
      <body>{children}</body>
    </html>
  );
}
