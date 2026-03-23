import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Keep - Personal Knowledge IDE (Revised)",
  description: "A Cursor-style IDE for personal knowledge management - Enhanced Mockup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
