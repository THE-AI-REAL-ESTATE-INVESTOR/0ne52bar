'use client';

import type { Member } from '@prisma/client';

interface TapPassAdminProps {
  members: Member[];
}

export default function TapPassAdmin({ members }: TapPassAdminProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">TapPass Admin</h1>
      
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.memberId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.membershipLevel === 'GOLD' ? 'bg-yellow-100 text-yellow-800' :
                        member.membershipLevel === 'SILVER' ? 'bg-gray-100 text-gray-800' :
                        member.membershipLevel === 'PLATINUM' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {member.membershipLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.visitCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 