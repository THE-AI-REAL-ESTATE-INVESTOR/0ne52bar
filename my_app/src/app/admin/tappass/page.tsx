import { getAdminMembers } from '@/actions/admin-member-actions';
import TapPassAdmin from '@/components/admin/TapPassAdmin';

export const dynamic = 'force-dynamic';

export default async function TapPassAdminPage() {
  const { success, members, error } = await getAdminMembers();

  if (!success) {
    throw new Error(error?.message || 'Failed to fetch members');
  }

  return <TapPassAdmin members={members} />;
} 