export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">The Keep</h1>
        <p className="text-foreground-secondary mb-8">
          Personal Knowledge Management System
        </p>
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
