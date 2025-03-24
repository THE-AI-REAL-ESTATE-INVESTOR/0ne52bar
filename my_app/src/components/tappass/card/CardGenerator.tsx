'use client';

import React, { useEffect, useRef } from 'react';
import type { Member } from '@prisma/client';
import html2canvas from 'html2canvas';

interface CardGeneratorProps {
  member: Member;
  onGenerated?: (dataUrl: string) => void;
}

const CardGenerator: React.FC<CardGeneratorProps> = ({ member, onGenerated }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && onGenerated) {
      html2canvas(cardRef.current).then((canvas) => {
        const dataUrl = canvas.toDataURL('image/png');
        onGenerated(dataUrl);
      });
    }
  }, [member, onGenerated]);

  const getMembershipColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'PLATINUM':
        return 'from-gray-300 to-gray-100';
      case 'GOLD':
        return 'from-yellow-500 to-yellow-300';
      case 'SILVER':
        return 'from-gray-400 to-gray-200';
      case 'BRONZE':
      default:
        return 'from-amber-700 to-amber-500';
    }
  };

  return (
    <div 
      ref={cardRef} 
      className="relative mx-auto rounded-lg border border-gray-700 shadow-xl overflow-hidden"
      style={{ 
        width: '550px',
        height: '430px',
        boxSizing: 'border-box',
        maxWidth: '95vw',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), 0 6px 10px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Background with membership level gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getMembershipColor(member.membershipLevel)}`}></div>
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-6">
        {/* Card Header */}
        <div className="text-center mb-1">
          <h3 className="text-gray-900 text-2xl font-bold tracking-wider">ONE-52 TAP PASS</h3>
          <h3 className= "text-white-900 text 2xl font-bold tracking-wider"> {member.membershipLevel}</h3>
          <p className="text-gray-700 text-sm">www.one52bar.com</p>
        </div>
        
        {/* License Plate */}
        <div className="bg-white rounded-lg w-11/12 h-44 flex flex-col items-center shadow-md overflow-hidden">
          <div className="bg-gray-100 w-full py-2 border-b border-gray-300">
            <h4 className="text-gray-800 text-center font-bold text-lg">ONE-52 BAR & GRILL</h4>
          </div>
          
          {/* Member Name */}
          <div className="bg-blue-900 w-full py-3 flex items-center justify-center">
            <p className="text-white font-bold text-xl">{member.name}</p>
          </div>
          
          {/* Member ID */}
          <div className="bg-black w-full py-4 flex items-center justify-center">
            <p className="font-mono font-bold text-xl tracking-wide">
              <span className="text-white">ONE52-</span>
              <span className="text-yellow-400">{member.memberId.split('-')[1]}-</span>
              <span className="text-green-400">{member.memberId.split('-')[2]}</span>
            </p>
          </div>
          
          {/* Bottom Text */}
          <div className="bg-gray-100 w-full py-5 border-t border-gray-300 flex-grow flex flex-col justify-center">
            <p className="text-gray-800 text-center font-extrabold text-lg">TAP PASS • {member.membershipLevel.toUpperCase()} MEMBER</p>
            <p className="text-gray-600 text-center text-sm mt-1">Welcome to the {member.membershipLevel.toLowerCase()} Tier!</p>
          </div>
        </div>
        
        {/* Stats and Benefits */}
        <div className="w-full flex flex-col items-center gap-2">
          {/* Stats */}
          <div className="flex justify-center gap-6 text-gray-900 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-bold">{member.points}</span>
              <span>Points</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{member.visits}</span>
              <span>Visits</span>
            </div>
          </div>
          
          {/* Benefits */}
          <p className="text-gray-900 text-sm text-center">
            🎂 Free Birthday Drink • 🎉 10% Event Discount • 🍺 Beer Club • 👫 Bring Friends
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardGenerator; 