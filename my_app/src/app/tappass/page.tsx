'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountCheck from '@/components/tappass/form/AccountCheck';
import PersonalInfo from '@/components/tappass/form/PersonalInfo';
import AdditionalDetails from '@/components/tappass/form/AdditionalDetails';
import ConfirmSubmit from '@/components/tappass/form/ConfirmSubmit';
import { create } from '@/actions/tapPassMember';
import type { TapPassFormData, TapPassMemberInput } from '@/types/tappass';
import type { SuccessResponse, ErrorResponse } from '@/lib/utils/api-response';

const TapPassPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TapPassFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (data: Partial<TapPassFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create the TapPass member with initial Bronze level
      const result = await create({
        email: formData.email!,
        name: formData.name!,
        phoneNumber: formData.phoneNumber!,
        birthday: new Date(formData.birthday!),
        agreeToTerms: formData.agreeToTerms!,
        membershipLevel: 'BRONZE',
        points: 0,
        visits: 0,
        lastVisit: null,
        visitHistory: []
      } as TapPassMemberInput);

      if (!result.success) {
        const errorResponse = result as ErrorResponse;
        throw new Error(errorResponse.error.message || 'Failed to create membership');
      }

      const successResponse = result as SuccessResponse<{ id: string }>;
      // Show success message in the UI
      router.push(`/tappass/dashboard/${successResponse.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create membership');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountCheck onNext={handleNext} />;
      case 2:
        return <PersonalInfo onNext={handleNext} initialData={formData} />;
      case 3:
        return <AdditionalDetails onNext={handleNext} initialData={formData} />;
      case 4:
        return (
          <ConfirmSubmit 
            formData={formData as TapPassFormData} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">TapPass Registration</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default TapPassPage;