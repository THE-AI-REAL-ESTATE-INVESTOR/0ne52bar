"use client";

import { useState } from "react";
import { updateTapPassFormData } from "@/app/actions/tappassformdata-actions";
import { createTapPassMember } from "@/app/actions/tappassmember-actions";
import type { TapPassFormData } from "@/app/models/tappassformdata";

interface TapPassModerationFormProps {
  formData: TapPassFormData;
  onComplete: () => void;
}

export default function TapPassModerationForm({ formData, onComplete }: TapPassModerationFormProps) {
  const [status, setStatus] = useState("active");
  const [expiryDays, setExpiryDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);
      
      // Create the TapPass member
      const memberResult = await createTapPassMember({
        email: formData.email,
        name: formData.name,
        phone: formData.phone || undefined,
        membershipId: `TAP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status,
        expiresAt
      });
      
      if (!memberResult.success) {
        throw new Error(memberResult.error);
      }
      
      // Mark the form as submitted
      const updateResult = await updateTapPassFormData({
        id: formData.id,
        submitted: true,
        memberId: memberResult.data.id
      });
      
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }
      
      // Call completion handler
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Process TapPass Request</h3>
      
      <div className="mb-4">
        <p><span className="font-medium">Name:</span> {formData.name}</p>
        <p><span className="font-medium">Email:</span> {formData.email}</p>
        <p><span className="font-medium">Phone:</span> {formData.phone || "Not provided"}</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Membership Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Period (days)
        </label>
        <input
          type="number"
          value={expiryDays}
          onChange={(e) => setExpiryDays(parseInt(e.target.value))}
          min="1"
          max="365"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Approve Membership"}
        </button>
      </div>
    </div>
  );
} 