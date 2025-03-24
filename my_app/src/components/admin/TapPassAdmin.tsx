'use client';

import { useState } from 'react';
import { type Member } from '@prisma/client';
import { updateMember, deleteMember } from '@/actions/admin-member-actions';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

interface TapPassAdminProps {
  members: Member[];
}

interface EditableMemberData {
  name: string;
  email: string;
  phoneNumber?: string;
  membershipLevel?: 'BRONZE' | 'SILVER' | 'GOLD' |'PLATINUM' |'GUESTS' ;
  points?: number;
}

export default function TapPassAdmin({ members }: TapPassAdminProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EditableMemberData>>({});
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    setIsDeleting(id);
    setError(null);
    
    try {
      const result = await deleteMember(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error?.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Failed to delete member');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = async (id: string) => {
    if (isEditing === id) {
      setError(null);
      try {
        // Ensure we have all required fields before updating
        if (!editData.name || !editData.email || !editData.membershipLevel || typeof editData.points !== 'number') {
          setError('Please fill in all required fields');
          return;
        }

        const updateData: EditableMemberData = {
          name: editData.name!,
          email: editData.email!,
          membershipLevel: editData.membershipLevel! as 'BRONZE' | 'SILVER' | 'GOLD',
          points: editData.points!,
          phoneNumber: editData.phoneNumber
        };

        const result = await updateMember(id, updateData);
        if (result.success) {
          router.refresh();
          setIsEditing(null);
          setEditData({});
        } else {
          setError(result.error?.message || 'Failed to update member');
        }
      } catch (error) {
        console.error('Error updating member:', error);
        setError('Failed to update member');
      }
    } else {
      // When starting to edit, populate all required fields from the member data
      const member = members.find(m => m.id === id);
      if (member) {
        setEditData({
          name: member.name,
          email: member.email,
          phoneNumber: member.phoneNumber || '',
          membershipLevel: member.membershipLevel as 'BRONZE' | 'SILVER' | 'GOLD',
          points: member.points || 0 // Ensure points is always a number
        });
        setIsEditing(id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-[95rem] mx-auto px-4 py-6 lg:py-4">
        <div className="mb-6 lg:mb-4">
          <h1 className="text-3xl font-semibold tracking-tight">TapPass Admin</h1>
          <p className="mt-2 text-gray-400">Manage your TapPass members and their rewards.</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl">
          <div className="p-4 lg:p-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-xl font-medium text-blue-300">Member Management</h2>
              {error && (
                <div className="w-full sm:w-auto px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {members.length === 0 ? (
              <div className="text-gray-400">No members found</div>
            ) : (
              <div className="relative rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-800/50">
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                          Member ID
                        </th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider hidden lg:table-cell">
                          Email
                        </th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider hidden sm:table-cell">
                          Phone
                        </th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider hidden sm:table-cell">
                          Points
                        </th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider hidden lg:table-cell">
                          Last Visit
                        </th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {members.map((member, idx) => (
                        <tr 
                          key={member.id}
                          className={clsx(
                            'transition-colors hover:bg-gray-700/30',
                            isEditing === member.id && 'bg-gray-700/50',
                            idx % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'
                          )}
                        >
                          <td className="py-2 px-3">
                            <div className="text-sm font-medium text-yellow-400">{member.memberId}</div>
                          </td>
                          <td className="py-2 px-3">
                            {isEditing === member.id ? (
                              <input
                                type="text"
                                value={editData.name || ''}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-100">{member.name || 'No Name'}</div>
                            )}
                          </td>
                          <td className="py-2 px-3 hidden lg:table-cell">
                            {isEditing === member.id ? (
                              <input
                                type="email"
                                value={editData.email || ''}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-300">{member.email || 'No Email'}</div>
                            )}
                          </td>
                          <td className="py-2 px-3 hidden sm:table-cell">
                            {isEditing === member.id ? (
                              <input
                                type="tel"
                                value={editData.phoneNumber || ''}
                                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-300">{member.phoneNumber || 'No Phone'}</div>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {isEditing === member.id ? (
                              <select
                                value={editData.membershipLevel || member.membershipLevel}
                                onChange={(e) => setEditData({ 
                                  ...editData, 
                                  membershipLevel: e.target.value as 'BRONZE' | 'SILVER' | 'GOLD' 
                                })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="BRONZE">Bronze</option>
                                <option value="SILVER">Silver</option>
                                <option value="GOLD">Gold</option>
                              </select>
                            ) : (
                              <span className={clsx(
                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                member.membershipLevel === 'GOLD' && 'bg-yellow-900/50 text-yellow-300 ring-1 ring-yellow-500/20',
                                member.membershipLevel === 'SILVER' && 'bg-gray-700/50 text-gray-300 ring-1 ring-gray-500/20',
                                member.membershipLevel === 'BRONZE' && 'bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/20'
                              )}>
                                {member.membershipLevel}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 hidden sm:table-cell">
                            {isEditing === member.id ? (
                              <input
                                type="number"
                                value={editData.points || 0}
                                onChange={(e) => setEditData({ ...editData, points: parseInt(e.target.value) })}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-300">{member.points}</div>
                            )}
                          </td>
                          <td className="py-2 px-3 hidden lg:table-cell">
                            <div className="text-sm text-gray-400">
                              {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(member.id)}
                                className={clsx(
                                  'px-2.5 py-1 rounded text-xs font-medium transition-all',
                                  'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800',
                                  isEditing === member.id
                                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 ring-1 ring-green-500/20 focus:ring-green-500'
                                    : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 ring-1 ring-blue-500/20 focus:ring-blue-500'
                                )}
                              >
                                {isEditing === member.id ? 'Save' : 'Edit'}
                              </button>
                              <button
                                onClick={() => handleDelete(member.id)}
                                disabled={isDeleting === member.id}
                                className={clsx(
                                  'px-2.5 py-1 rounded text-xs font-medium transition-all',
                                  'bg-red-500/10 text-red-400 hover:bg-red-500/20 ring-1 ring-red-500/20',
                                  'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-red-500',
                                  'disabled:opacity-50 disabled:cursor-not-allowed'
                                )}
                              >
                                {isDeleting === member.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 