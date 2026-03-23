import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Keep - Personal Knowledge Management',
  description: 'AI-powered personal knowledge management system with transparent memory and file editing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
