import { Suspense } from 'react';
import { listTapPassMembers } from "@/app/actions/tappassmember-actions";
import { listTapPassFormData } from "@/app/actions/tappassformdata-actions";
import TapPassAdmin from '@/components/admin/TapPassAdmin';
import type { TapPassMember, TapPassFormData } from '@prisma/client';
import type { ApiResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TapPassAdminPage() {
  const membersResult = await listTapPassMembers({ page: 1, pageSize: 10 }) as ApiResponse<TapPassMember[]>;
  const formsResult = await listTapPassFormData({ page: 1, pageSize: 10 }) as ApiResponse<TapPassFormData[]>;
  
  if (!membersResult.success || !formsResult.success) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">TapPass Admin</h1>
        <div className="text-red-500">
          {!membersResult.success && <div>Error loading members: {membersResult.error?.message}</div>}
          {!formsResult.success && <div>Error loading forms: {formsResult.error?.message}</div>}
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TapPassAdmin 
        members={membersResult.data} 
        formData={formsResult.data}
      />
    </Suspense>
  );
} 