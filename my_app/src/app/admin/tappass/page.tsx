"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data for demonstration purposes
const initialMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", tier: "Bronze", points: 120, joined: "2025-02-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", tier: "Silver", points: 450, joined: "2025-01-20" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", tier: "Gold", points: 890, joined: "2025-01-05" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", tier: "Bronze", points: 75, joined: "2025-03-01" },
  { id: 5, name: "Robert Brown", email: "robert@example.com", tier: "Platinum", points: 1500, joined: "2024-12-10" },
];

const tierSettings = {
  Bronze: { pointThreshold: 0, benefits: ["5% off drinks", "Birthday special"] },
  Silver: { pointThreshold: 300, benefits: ["10% off drinks", "Birthday special", "Happy hour extension"] },
  Gold: { pointThreshold: 750, benefits: ["15% off drinks", "Birthday special", "Happy hour extension", "Priority seating"] },
  Platinum: { pointThreshold: 1200, benefits: ["20% off drinks", "Birthday special", "Happy hour extension", "Priority seating", "Exclusive events"] },
};

export default function TapPassAdmin() {
  const [members, setMembers] = useState(initialMembers);
  const [activeTab, setActiveTab] = useState('members');
  const [tierConfig, setTierConfig] = useState(tierSettings);
  const [newPromotion, setNewPromotion] = useState({ name: '', description: '', pointBonus: 0, startDate: '', endDate: '' });
  
  // Active promotions
  const [promotions, setPromotions] = useState([
    { id: 1, name: "Sunday Double Points", description: "Earn 2x points on all purchases on Sundays", pointBonus: 2, startDate: "2025-03-01", endDate: "2025-04-30", isActive: true },
    { id: 2, name: "First-Time Member Bonus", description: "100 bonus points for new sign-ups", pointBonus: 100, startDate: "2025-03-01", endDate: "2025-05-31", isActive: true },
  ]);

  const handleCreatePromotion = (e) => {
    e.preventDefault();
    setPromotions([
      ...promotions, 
      { 
        id: promotions.length + 1, 
        ...newPromotion, 
        isActive: true 
      }
    ]);
    setNewPromotion({ name: '', description: '', pointBonus: 0, startDate: '', endDate: '' });
  };
  
  const togglePromotionStatus = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">TapPass Management</h1>
          <p className="text-gray-600 mt-2">Manage your bar's loyalty program</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-6 font-medium ${activeTab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('tiers')}
              className={`py-4 px-6 font-medium ${activeTab === 'tiers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tier Settings
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`py-4 px-6 font-medium ${activeTab === 'promotions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Promotions
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Reports
            </button>
          </nav>
        </div>
        
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Member Directory</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add New Member
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${member.tier === 'Bronze' ? 'bg-yellow-100 text-yellow-800' : 
                          member.tier === 'Silver' ? 'bg-gray-100 text-gray-800' : 
                          member.tier === 'Gold' ? 'bg-yellow-300 text-yellow-900' : 
                          'bg-purple-100 text-purple-800'}`}>
                          {member.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.joined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Tier Settings Tab */}
        {activeTab === 'tiers' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tier Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(tierConfig).map(([tier, config]) => (
                <div key={tier} className="bg-white p-6 rounded-lg shadow">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3
                    ${tier === 'Bronze' ? 'bg-yellow-100 text-yellow-800' : 
                    tier === 'Silver' ? 'bg-gray-100 text-gray-800' : 
                    tier === 'Gold' ? 'bg-yellow-300 text-yellow-900' : 
                    'bg-purple-100 text-purple-800'}`}>
                    {tier} Tier
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{tier} Benefits</h3>
                  <p className="text-sm text-gray-600 mb-2">Point Threshold: {config.pointThreshold}+</p>
                  <ul className="text-sm text-gray-700 space-y-1 mt-3">
                    {config.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit Tier Benefits
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Promotions</h2>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point Bonus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promotions.map((promo) => (
                    <tr key={promo.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{promo.name}</td>
                      <td className="px-6 py-4">{promo.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {typeof promo.pointBonus === 'number' ? `${promo.pointBonus} points` : `${promo.pointBonus}x multiplier`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promo.startDate} to {promo.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => togglePromotionStatus(promo.id)}
                          className={`mr-3 ${promo.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {promo.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Promotion</h3>
              <form onSubmit={handleCreatePromotion}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Point Bonus</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      value={newPromotion.pointBonus}
                      onChange={(e) => setNewPromotion({...newPromotion, pointBonus: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      value={newPromotion.description}
                      onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Create Promotion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">TapPass Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Members</p>
                    <p className="text-2xl font-semibold">{members.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Points Awarded</p>
                    <p className="text-2xl font-semibold">3,250</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Avg. Points/Member</p>
                    <p className="text-2xl font-semibold">607</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Promotions</p>
                    <p className="text-2xl font-semibold">{promotions.filter(p => p.isActive).length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Member Distribution by Tier</h3>
                <div className="flex h-64 items-end space-x-2">
                  <div className="flex-1 bg-yellow-100 rounded-t-lg" style={{ height: '30%' }}>
                    <div className="py-2 text-center font-medium text-yellow-800">Bronze</div>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-t-lg" style={{ height: '25%' }}>
                    <div className="py-2 text-center font-medium text-gray-800">Silver</div>
                  </div>
                  <div className="flex-1 bg-yellow-300 rounded-t-lg" style={{ height: '20%' }}>
                    <div className="py-2 text-center font-medium text-yellow-900">Gold</div>
                  </div>
                  <div className="flex-1 bg-purple-100 rounded-t-lg" style={{ height: '10%' }}>
                    <div className="py-2 text-center font-medium text-purple-800">Platinum</div>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <div>50% Bronze</div>
                  <div>35% Silver</div>
                  <div>12% Gold</div>
                  <div>3% Platinum</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Sign-up Trend (Last 7 Days)</h3>
                <div className="h-64 flex items-end space-x-2">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '60%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Mon</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '40%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Tue</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '55%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Wed</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '75%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Thu</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '90%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Fri</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '80%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Sat</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '65%' }}></div>
                    <div className="text-xs mt-2 text-gray-600">Sun</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 