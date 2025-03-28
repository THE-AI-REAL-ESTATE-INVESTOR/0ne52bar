'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountCheck from '@/components/tappass/form/AccountCheck';
import PersonalInfo from '@/components/tappass/form/PersonalInfo';
import AdditionalDetails from '@/components/tappass/form/AdditionalDetails';
import ConfirmSubmit from '@/components/tappass/form/ConfirmSubmit';
import { registerTapPassMember } from '@/app/tappass/actions';
import type { TapPassFormData } from '@/types/tappass';

type RegisterResponse = {
  success: boolean;
  member?: {
    id: string;
    memberId: string;
    name: string;
    email: string;
    birthday: string;
    joinDate: string;
    lastVisit: string | null;
    visitHistory: Array<{
      id: string;
      memberId: string;
      points: number;
      createdAt: Date;
      visitDate: Date;
      amount: number;
    }>;
  };
  error?: string;
};

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
      
      // Create form data for registration
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name!);
      formDataObj.append('email', formData.email!);
      formDataObj.append('phoneNumber', formData.phoneNumber!);
      formDataObj.append('birthday', formData.birthday!);
      formDataObj.append('agreeToTerms', String(formData.agreeToTerms!));

      // Register the TapPass member
      const result = await registerTapPassMember(formDataObj) as RegisterResponse;

      if (!result.success) {
        throw new Error(result.error || 'Failed to create membership');
      }

      // Check if member exists in the response
      if (!result.member) {
        throw new Error('Member data not returned');
      }

      // Log success
      console.log('Successfully registered member:', result.member.memberId);

      // Redirect to dashboard with the member ID
      router.push(`/tappass/dashboard/${result.member.memberId}`);
      
    } catch (err) {
      console.error('Registration error:', err);
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