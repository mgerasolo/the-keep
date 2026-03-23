import { getCurrentUser } from '@/lib/auth';

// Force dynamic rendering since we read cookies
export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">The Keep</h1>
        <p className="text-foreground-secondary mb-8">
          Personal Knowledge Management System
        </p>

        {user && (
          <div className="mb-8 p-4 bg-surface rounded-lg border border-border">
            <p className="text-sm text-foreground-secondary">Logged in as</p>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-foreground-secondary">{user.email}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <a
            href="/api/health"
            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition"
          >
            Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
