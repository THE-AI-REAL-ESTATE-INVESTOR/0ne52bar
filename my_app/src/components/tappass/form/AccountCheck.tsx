'use client';

import React, { useState } from 'react';
import { getMemberByEmail } from '@/app/tappass/actions';
import type { TapPassFormData } from '@/types/tappass';
import type { Member, Visit } from '@prisma/client';
import CardGenerator from '../card/CardGenerator';
import CardActions from '../card/CardActions';
import BenefitCards from '../shared/BenefitCards';

interface AccountCheckProps {
  onNext: (data: Partial<TapPassFormData>) => void;
}

interface MemberWithVisits extends Member {
  visitHistory: Visit[];
}

const AccountCheck: React.FC<AccountCheckProps> = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<MemberWithVisits | null>(null);
  const [cardImage, setCardImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMemberByEmail(email);
      
      if (result.success && result.member) {
        // Convert string dates to Date objects and ensure visitHistory exists
        const memberData = {
          ...result.member,
          birthday: new Date(result.member.birthday),
          joinDate: new Date(result.member.joinDate),
          lastVisit: result.member.lastVisit ? new Date(result.member.lastVisit) : null,
          visitHistory: result.member.visitHistory || []
        } as MemberWithVisits;
        setMember(memberData);
      } else {
        // Account doesn't exist, proceed to registration
        onNext({ email });
      }
    } catch (err) {
      console.error('Account check error:', err);
      setError('Failed to check account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardGenerated = (dataUrl: string) => {
    setCardImage(dataUrl);
  };

  const handleDownload = () => {
    if (cardImage) {
      const link = document.createElement('a');
      link.href = cardImage;
      link.download = `ONE52-TapPass-${member?.name.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEmail = async () => {
    // Implement email functionality
    alert('Email functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-300">TapPass Loyalty Program</h1>
        <p className="text-center text-xl mb-12 text-white">Earn rewards every time you visit ONE-52 Bar & Grill!</p>

        {!member ? (
          <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-blue-300">Check Your TapPass</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-700 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <div className="mb-4 p-2 bg-red-900 text-white rounded">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                  >
                    {isLoading ? 'Checking...' : 'Check My TapPass'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => onNext({ email })}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Create New TapPass
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-900 rounded-full">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-yellow-300">Welcome Back!</h2>
                <p className="mt-2 text-gray-300">
                  Here&apos;s your ONE-52 TAP PASS:
                </p>
              </div>

              <div className="flex flex-col items-center">
                <CardGenerator member={member} onGenerated={handleCardGenerated} />
                <CardActions onDownload={handleDownload} onEmail={handleEmail} />
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Your Benefits</h3>
                <BenefitCards />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountCheck; 