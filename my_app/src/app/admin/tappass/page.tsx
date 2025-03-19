import { Suspense } from 'react';
import { listMembers } from "@/app/actions/member-actions";
import TapPassAdmin from '@/components/admin/TapPassAdmin';
import type { Member } from '@prisma/client';
import type { ApiResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TapPassAdminPage() {
  const membersResult = await listMembers({ page: 1, pageSize: 10 }) as ApiResponse<Member[]>;
  
  if (!membersResult.success) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">TapPass Admin</h1>
        <div className="text-red-500">
          {!membersResult.success && <div>Error loading members: {membersResult.error?.message}</div>}
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TapPassAdmin members={membersResult.data} />
    </Suspense>
  );
} 