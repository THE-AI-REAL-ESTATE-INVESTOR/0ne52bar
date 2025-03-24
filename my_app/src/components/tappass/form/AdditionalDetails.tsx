'use client';

import React, { useState } from 'react';
import { FormData } from '../../../types/tappass';

interface AdditionalDetailsProps {
  onNext: (data: Partial<FormData>) => void;
  initialData?: Partial<FormData>;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState<Partial<FormData>>(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <span className="ml-2 text-sm text-gray-700">I agree to the terms and conditions</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default AdditionalDetails; 