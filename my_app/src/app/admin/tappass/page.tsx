"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { listTapPassMembers } from "@/app/actions/tappassmember-actions";
import { listTapPassFormData } from "@/app/actions/tappassformdata-actions";

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

export default async function TapPassAdminPage() {
  const membersResult = await listTapPassMembers({ page: 1, pageSize: 10 });
  const formsResult = await listTapPassFormData({ page: 1, pageSize: 10 });
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">TapPass Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">TapPass Members</h2>
          
          {!membersResult.success ? (
            <div className="text-red-500">Error loading members: {membersResult.error}</div>
          ) : membersResult.data.length === 0 ? (
            <div className="text-gray-500">No members found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {membersResult.data.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(member.expiresAt).toLocaleDateString()}
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
          
          {!formsResult.success ? (
            <div className="text-red-500">Error loading forms: {formsResult.error}</div>
          ) : formsResult.data.length === 0 ? (
            <div className="text-gray-500">No form submissions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formsResult.data.map((form) => (
                    <tr key={form.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{form.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{form.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{form.phone || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          form.submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {form.submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
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