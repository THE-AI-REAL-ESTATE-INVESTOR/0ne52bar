'use client';

import React from 'react';
import { TapPassMember } from '../../../types/tappass';

interface MemberCardProps {
  member: TapPassMember;
  onDownload?: () => void;
  onEmail?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onDownload, onEmail }) => {
  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case 'PLATINUM':
        return 'bg-gradient-to-r from-gray-300 to-gray-100';
      case 'GOLD':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-300';
      case 'SILVER':
        return 'bg-gradient-to-r from-gray-400 to-gray-200';
      default:
        return 'bg-gradient-to-r from-amber-700 to-amber-500';
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className={`relative p-6 rounded-lg shadow-lg ${getTierColor(member.tier)}`}>
        <div className="absolute top-4 right-4 text-sm font-semibold">
          {member.tier.toUpperCase()}
        </div>
        <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Member ID</p>
            <p>{member.memberId}</p>
          </div>
          <div>
            <p className="font-semibold">Member Since</p>
            <p>{new Date(member.memberSince).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Points</p>
            <p>{member.points}</p>
          </div>
          <div>
            <p className="font-semibold">Visits</p>
            <p>{member.visits}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download
            </button>
          )}
          {onEmail && (
            <button
              onClick={onEmail}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard; 