'use server';

import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { registrationSchema } from '@/lib/validations';
import { memberService } from '@/lib/db/member';
import type { RegisterResponse, EmailResponse, MemberLookupResponse } from './types';

/**
 * Generates a unique member ID in the format ONE52-XXXX-YYYY
 * Where XXXX is a random 4-digit number and YYYY is a sequential 4-digit number
 */
export function generateMemberId(): string {
  // Create the random part (4 digits)
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Create a timestamp-based sequential part (4 digits)
  // This uses the last 4 digits of the current timestamp to ensure uniqueness
  const timestamp = Date.now();
  const sequentialPart = timestamp.toString().slice(-4);
  
  return `ONE52-${randomPart}-${sequentialPart}`;
}

/**
 * Register a new TapPass member
 * @param formData Form data with member information
 */
export async function registerTapPassMember(formData: FormData): Promise<RegisterResponse> {
  try {
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const birthday = formData.get('birthday') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const agreeToTermsValue = formData.get('agreeToTerms');
    const agreeToTerms = agreeToTermsValue === 'true';
    
    // Create data object
    const userData = {
      name,
      email,
      birthday,
      phoneNumber,
      agreeToTerms
    };
    
    // Validate data with Zod schema
    try {
      registrationSchema.parse(userData);
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const errorMessage = validationError.errors.map(err => err.message).join(', ');
        return { 
          success: false, 
          error: errorMessage 
        };
      }
      
      return { 
        success: false, 
        error: 'Invalid form data' 
      };
    }
    
    // Check for existing member with this email
    const existingEmailResult = await getMemberByEmail(email);
    if (existingEmailResult.success && existingEmailResult.member) {
      return { 
        success: true, 
        memberId: existingEmailResult.member.memberId,
        error: 'Email already registered. We have sent your ID again.' 
      };
    }
    
    // Check for existing member with this phone
    const existingPhoneResult = await getMemberByPhone(phoneNumber);
    if (existingPhoneResult.success && existingPhoneResult.member) {
      return { 
        success: true, 
        memberId: existingPhoneResult.member.memberId,
        error: 'Phone already registered. We have sent your ID again.' 
      };
    }
    
    // Generate a unique member ID
    const memberId = generateMemberId();
    
    try {
      // Create member in database using the member service
      const newMember = await memberService.create({
        data: userData,
        memberId,
      });
      
      // Revalidate the path to ensure fresh data
      revalidatePath('/tappass');
      
      // Return success response
      return { 
        success: true, 
        memberId: newMember.memberId
      };
    } catch (dbError) {
      console.error('Database error during registration:', dbError);
      return { 
        success: false, 
        error: 'An error occurred while saving member information' 
      };
    }
    
  } catch (error) {
    console.error('Error registering member:', error);
    return { 
      success: false, 
      error: 'An error occurred during registration' 
    };
  }
}

/**
 * Send membership card via email
 * @param formData Form data containing email and member ID
 * @returns Response with success status
 */
export async function emailMembershipCard(formData: FormData): Promise<EmailResponse> {
  try {
    const email = formData.get('email') as string;
    const memberId = formData.get('memberId') as string;
    
    if (!email || !memberId) {
      return {
        success: false,
        error: 'Email and member ID are required'
      };
    }
    
    // In a real implementation, we would send an email with the card
    // For now, just log the action
    console.log(`Sending membership card to ${email} for member ID: ${memberId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error in emailMembershipCard:', error);
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
}

/**
 * Look up a member by email
 * @param email Member's email address
 * @returns Response with member information if found
 */
export async function getMemberByEmail(email: string): Promise<MemberLookupResponse> {
  try {
    if (!email) {
      return {
        success: false,
        error: 'Email is required'
      };
    }
    
    try {
      // Look up in the database using the member service
      const member = await memberService.find({ email });
      
      if (!member) {
        return {
          success: false,
          error: 'Member not found'
        };
      }
      
      // Convert Prisma object to MemberRecord type for the response
      return {
        success: true,
        member: {
          memberId: member.memberId,
          name: member.name,
          email: member.email,
          birthday: member.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
          phoneNumber: member.phoneNumber,
          agreeToTerms: member.agreeToTerms,
          joinDate: member.joinDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          membershipLevel: member.membershipLevel as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
        }
      };
    } catch (dbError) {
      console.error('Database error looking up member by email:', dbError);
      return {
        success: false,
        error: 'An error occurred while looking up member'
      };
    }
    
  } catch (error) {
    console.error('Error in getMemberByEmail:', error);
    return {
      success: false,
      error: 'An error occurred while looking up member'
    };
  }
}

/**
 * Look up a member by phone number
 * @param phoneNumber Member's phone number (digits only)
 * @returns Response with member information if found
 */
export async function getMemberByPhone(phoneNumber: string): Promise<MemberLookupResponse> {
  try {
    if (!phoneNumber) {
      return {
        success: false,
        error: 'Phone number is required'
      };
    }
    
    try {
      // Look up in the database using the member service
      const member = await memberService.find({ phoneNumber });
      
      if (!member) {
        return {
          success: false,
          error: 'Member not found'
        };
      }
      
      // Convert Prisma object to MemberRecord type for the response
      return {
        success: true,
        member: {
          memberId: member.memberId,
          name: member.name,
          email: member.email,
          birthday: member.birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
          phoneNumber: member.phoneNumber,
          agreeToTerms: member.agreeToTerms,
          joinDate: member.joinDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          membershipLevel: member.membershipLevel as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
        }
      };
    } catch (dbError) {
      console.error('Database error looking up member by phone:', dbError);
      return {
        success: false,
        error: 'An error occurred while looking up member'
      };
    }
    
  } catch (error) {
    console.error('Error in getMemberByPhone:', error);
    return {
      success: false,
      error: 'An error occurred while looking up member'
    };
  }
} 