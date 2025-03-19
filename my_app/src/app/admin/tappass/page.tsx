import { listMembers } from '@/app/actions/member-actions';
import TapPassAdmin from '@/components/admin/TapPassAdmin';
import type { Member } from '@prisma/client';
import type { SuccessResponse } from '@/lib/utils/api-response';

export default async function TapPassAdminPage() {
  try {
    const response = await listMembers();

    if (!response.success) {
      throw new Error(response.error.message);
    }

    const successResponse = response as SuccessResponse<SuccessResponse<Member[]>>;
    return <TapPassAdmin members={successResponse.data.data} />;
  } catch (error) {
    console.error('Error loading TapPass admin data:', error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">TapPass Admin</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading TapPass data. Please try again later.
        </div>
      </div>
    );
  }
} 