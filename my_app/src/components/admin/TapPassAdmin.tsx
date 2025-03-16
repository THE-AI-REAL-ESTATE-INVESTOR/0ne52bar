'use client';

import type { TapPassMember, TapPassFormData } from '@prisma/client';

interface TapPassAdminProps {
  members: TapPassMember[];
  formData: TapPassFormData[];
}

export default function TapPassAdmin({ members, formData }: TapPassAdminProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">TapPass Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">TapPass Members</h2>
          
          {members.length === 0 ? (
            <div className="text-gray-500">No members found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{member.memberId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                          member.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {member.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Form Data Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Form Submissions</h2>
          
          {formData.length === 0 ? (
            <div className="text-gray-500">No form submissions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.map((form) => (
                    <tr key={form.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{form.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{form.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{form.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{form.birthday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 