import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "pickture",
  description: "Photo Album",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${rubik.variable} bg-stone-300 text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
