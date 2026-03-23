import { WorkspaceLayout } from '@/components/workspace';

// Force dynamic rendering since we read cookies
export const dynamic = 'force-dynamic';

export default function Home() {
  return <WorkspaceLayout />;
}
