'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

// Types for our form data
export interface TapPassFormData {
  name: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  agreeToTerms: boolean;
}

// Member data type including additional fields for storage
export interface TapPassMember extends TapPassFormData {
  memberId: string;
  memberSince: string;
  tier: string;
  points: number;
  visits: number;
  lastVisit?: string;
}

// Path to the JSON database file
const TAP_PASS_DB_PATH = path.join(process.cwd(), 'src/data/tap-pass-members.json');

// Helper function to ensure the database file exists
function ensureDatabaseExists() {
  try {
    if (!fs.existsSync(path.dirname(TAP_PASS_DB_PATH))) {
      fs.mkdirSync(path.dirname(TAP_PASS_DB_PATH), { recursive: true });
    }
    
    if (!fs.existsSync(TAP_PASS_DB_PATH)) {
      fs.writeFileSync(TAP_PASS_DB_PATH, JSON.stringify({ members: [] }), 'utf8');
    }
  } catch (error) {
    console.error('Error creating database file:', error);
  }
}

// Helper to read all members
function getMembers(): TapPassMember[] {
  ensureDatabaseExists();
  try {
    const data = fs.readFileSync(TAP_PASS_DB_PATH, 'utf8');
    const database = JSON.parse(data);
    return database.members || [];
  } catch (error) {
    console.error('Error reading members database:', error);
    return [];
  }
}

// Helper to save a new member
function saveMember(member: TapPassMember): boolean {
  ensureDatabaseExists();
  try {
    const members = getMembers();
    
    // Check if member with same email already exists
    const existingMemberIndex = members.findIndex(m => m.email === member.email);
    
    if (existingMemberIndex >= 0) {
      // Update existing member
      members[existingMemberIndex] = {
        ...members[existingMemberIndex],
        ...member,
        // Keep the original memberId and memberSince
        memberId: members[existingMemberIndex].memberId,
        memberSince: members[existingMemberIndex].memberSince
      };
    } else {
      // Add new member
      members.push(member);
    }
    
    fs.writeFileSync(TAP_PASS_DB_PATH, JSON.stringify({ members }, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving member:', error);
    return false;
  }
}

// Helper to find a member by their ID
function getMemberById(memberId: string): TapPassMember | null {
  const members = getMembers();
  const member = members.find(m => m.memberId === memberId);
  return member || null;
}

// Helper to find a member by their email
export async function getMemberByEmail(email: string): Promise<{ success: boolean; member: TapPassMember | null; error?: string }> {
  try {
    const members = getMembers();
    const member = members.find(m => m.email === email);
    
    return {
      success: true,
      member: member || null
    };
  } catch (error) {
    console.error('Error finding member by email:', error);
    return {
      success: false,
      member: null,
      error: 'Failed to find member. Please try again.'
    };
  }
}

// Helper to generate a unique member ID with tracking capability
function generateMemberID(): string {
  // Get all existing members to determine the next sequential number
  const members = getMembers();
  
  // Calculate next member number (user count + 1)
  const nextMemberNumber = members.length + 1;
  
  // Format to ensure 4 digits with leading zeros if needed (e.g., 0001, 0012, 0123, etc.)
  const sequentialPart = nextMemberNumber.toString().padStart(4, '0');
  
  // Generate 4 random digits for the first part
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Combine for final format: ONE52-RANDOM-SEQUENTIAL
  return `ONE52-${randomPart}-${sequentialPart}`;
}

// Function to migrate existing member IDs to the new format
export async function migrateExistingMemberIDs(): Promise<{ success: boolean; message: string }> {
  try {
    const members = getMembers();
    let migratedCount = 0;
    
    // Loop through members and update their IDs
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      // Check if the member ID is already in the correct format (ONE52-XXXX-YYYY)
      if (member.memberId && member.memberId.split('-').length === 3) {
        const parts = member.memberId.split('-');
        // If the third part is already a 4-digit number, assume it's already migrated
        if (parts[2] && parts[2].length === 4 && !isNaN(Number(parts[2]))) {
          continue; // Skip already migrated members
        }
      }
      
      // Generate a sequential part based on the member's index + 1
      const sequentialPart = (i + 1).toString().padStart(4, '0');
      
      // Generate a random part or extract from existing ID if possible
      let randomPart = Math.floor(1000 + Math.random() * 9000).toString();
      if (member.memberId) {
        const existingParts = member.memberId.split('-');
        if (existingParts.length > 1 && existingParts[1]) {
          // Try to use the existing random part if it's numeric
          const existingRandom = existingParts[1].replace(/\D/g, '');
          if (existingRandom.length > 0) {
            randomPart = existingRandom.padStart(4, '0').substring(0, 4);
          }
        }
      }
      
      // Assign the new ID with proper format
      members[i].memberId = `ONE52-${randomPart}-${sequentialPart}`;
      migratedCount++;
    }
    
    // Save the updated members
    if (migratedCount > 0) {
      fs.writeFileSync(TAP_PASS_DB_PATH, JSON.stringify({ members }, null, 2), 'utf8');
      return { 
        success: true, 
        message: `Successfully migrated ${migratedCount} member IDs to the new format.` 
      };
    } else {
      return { 
        success: true, 
        message: 'No member IDs needed migration.' 
      };
    }
  } catch (error) {
    console.error('Error migrating member IDs:', error);
    return { 
      success: false, 
      message: 'Failed to migrate member IDs. See server logs for details.' 
    };
  }
}

// Server action to register a new TapPass member
export async function registerTapPassMember(formData: FormData): Promise<{ memberId: string; success: boolean; error?: string }> {
  try {
    // Extract data from the form
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const birthday = formData.get('birthday') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    
    // Handle checkbox value which can come in different formats
    const agreeToTermsValue = formData.get('agreeToTerms');
    const agreeToTerms = agreeToTermsValue === 'true' || 
                        agreeToTermsValue === 'on' || 
                        agreeToTermsValue === 't' ||
                        String(agreeToTermsValue) === 'true';

    // Validate the data
    if (!name || !email || !birthday || !phoneNumber || !agreeToTerms) {
      return {
        memberId: '',
        success: false,
        error: 'All fields are required'
      };
    }

    // Check if member already exists - using internal function directly for synchronous operation
    const members = getMembers();
    const existingMember = members.find(m => m.email === email);
    
    // Generate a unique member ID or use existing one
    const memberId = existingMember ? 
      existingMember.memberId : 
      generateMemberID();
    
    // Create new member object
    const newMember: TapPassMember = {
      name,
      email,
      birthday,
      phoneNumber,
      agreeToTerms,
      memberId,
      memberSince: existingMember ? existingMember.memberSince : new Date().toISOString(),
      tier: 'BRONZE',
      points: existingMember ? existingMember.points : 0,
      visits: existingMember ? existingMember.visits : 0
    };
    
    // Save to our JSON database
    const saved = saveMember(newMember);
    
    if (!saved) {
      throw new Error('Failed to save member data');
    }

    // Log the registration
    console.log(`TapPass member ${existingMember ? 'updated' : 'registered'}: ${memberId}`);

    // Revalidate the TapPass page to reflect any changes
    revalidatePath('/tappass');
    revalidatePath('/admin/tappass');

    return {
      memberId,
      success: true
    };
  } catch (error) {
    console.error('Error registering TapPass member:', error);
    return {
      memberId: '',
      success: false,
      error: 'Failed to register. Please try again.'
    };
  }
}

// Server action to email the membership card
export async function emailMembershipCard(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const email = formData.get('email') as string;
    const memberId = formData.get('memberId') as string;
    
    if (!email || !memberId) {
      return {
        success: false,
        error: 'Email and member ID are required'
      };
    }
    
    // Find member in database
    const member = getMemberById(memberId);
    
    if (!member) {
      return {
        success: false,
        error: 'Member not found'
      };
    }
    
    // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll simulate sending an email
    console.log(`Sending membership card to ${email} for member ${memberId}`);
    
    // Log the action to JSON database - could add an emailSent field to member record
    // For a production app, you would integrate with a real email service here
    
    // Simulating email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending membership card:', error);
    return {
      success: false, 
      error: 'Failed to send email. Please try again.'
    };
  }
}

// Server action to get a member's information by ID
export async function getMemberInfo(memberId: string): Promise<{ member: TapPassMember | null; success: boolean; error?: string }> {
  try {
    const member = getMemberById(memberId);
    
    if (!member) {
      return {
        member: null,
        success: false,
        error: 'Member not found'
      };
    }
    
    return {
      member,
      success: true
    };
  } catch (error) {
    console.error('Error retrieving member info:', error);
    return {
      member: null,
      success: false,
      error: 'Failed to retrieve member information'
    };
  }
}

// Server action to get all members (for admin view)
export async function getAllMembers(): Promise<{ members: TapPassMember[]; success: boolean; error?: string }> {
  try {
    const members = getMembers();
    
    return {
      members,
      success: true
    };
  } catch (error) {
    console.error('Error retrieving all members:', error);
    return {
      members: [],
      success: false,
      error: 'Failed to retrieve members'
    };
  }
} 