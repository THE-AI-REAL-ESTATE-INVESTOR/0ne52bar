'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { memberService } from '@/lib/db/member';
import type { Member } from '@prisma/client';

export default function TapPassDashboard() {
  const params = useParams();
  const memberId = params.memberId as string;
  const [member, setMember] = React.useState<Member | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadMember() {
      try {
        const result = await memberService.find({ memberId });
        if (result) {
          setMember(result);
        } else {
          setError('Member not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load member data');
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, [memberId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
          Member not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome, {member.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Membership Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Membership Info</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Member ID:</span> {member.memberId}</p>
            <p><span className="font-medium">Level:</span> {member.membershipLevel}</p>
            <p><span className="font-medium">Points:</span> {member.points}</p>
            <p><span className="font-medium">Visits:</span> {member.visitCount}</p>
            <p><span className="font-medium">Last Visit:</span> {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {member.email}</p>
            <p><span className="font-medium">Phone:</span> {member.phoneNumber}</p>
            <p><span className="font-medium">Birthday:</span> {new Date(member.birthday).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Member Since:</span> {new Date(member.joinDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Status:</span> Active</p>
          </div>
        </div>
      </div>
    </div>
  );
} 