import type { Metadata } from 'next';
import './globals.css';
import { getCurrentUser } from '@/lib/auth';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'The Keep - Personal Knowledge Management',
  description: 'AI-powered personal knowledge management system with transparent memory and file editing',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch current user on server
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers user={user}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
