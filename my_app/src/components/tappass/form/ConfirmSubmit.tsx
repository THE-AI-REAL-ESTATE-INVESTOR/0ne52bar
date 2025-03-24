'use client';

import React from 'react';
import type { TapPassFormData } from '@/types/tappass';

interface ConfirmSubmitProps {
  formData: TapPassFormData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ConfirmSubmit: React.FC<ConfirmSubmitProps> = ({ formData, onSubmit, isSubmitting }) => {
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Confirm Submission</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Birthday:</strong> {formData.birthday}</p>
        <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        <p><strong>Agree to Terms:</strong> {formData.agreeToTerms ? 'Yes' : 'No'}</p>
      </div>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating Membership...' : 'Submit'}
      </button>
    </div>
  );
};

export default ConfirmSubmit; 