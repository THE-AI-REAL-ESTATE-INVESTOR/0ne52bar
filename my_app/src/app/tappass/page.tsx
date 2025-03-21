'use client';

// @ts-expect-error - Missing type definitions for dom-to-image-more
declare module 'dom-to-image-more';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { createMember, getMemberByEmail } from '@/app/actions/member-actions';
import { z } from 'zod';

const MembershipLevels = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;

const MemberSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  birthday: z.date(),
  agreeToTerms: z.boolean(),
  membershipLevel: z.enum(MembershipLevels),
  joinDate: z.date(),
  points: z.number(),
  visitCount: z.number(),
  lastVisit: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  visits: z.array(z.any()),
  rewards: z.array(z.any())
});

// Type for form data
interface FormData {
  name: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  agreeToTerms: boolean;
}

// Type for login data
interface LoginData {
  email: string;
}

// Type definitions for server action responses
interface EmailResponse {
  success: boolean;
  error?: string;
}

// Helper function for rounded rectangles
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Special promotions and benefits
const BENEFITS = [
  {
    icon: "🎂",
    title: "Birthday Special",
    description: "Free drink or shot with any meal or bar tab over $10 on your birthday"
  },
  {
    icon: "🎉",
    title: "Event Discount",
    description: "Let us know you're coming to an event and get 10% off your bar tab that night"
  },
  {
    icon: "🍺",
    title: "Beer Club",
    description: "Special discounts on our Beer of the Month selections"
  },
  {
    icon: "👫",
    title: "Bring Friends",
    description: "Bring 3 friends to ONE-52 and get 10% off your tab"
  },
  {
    icon: "📱",
    title: "Social Rewards",
    description: "Invite friends to our Facebook page for a one-time 20% off your tab"
  },
  {
    icon: "📅",
    title: "Exclusive Perks",
    description: "Weekly and monthly member-only offers and promotions"
  }
];

// Fallback implementation if server actions aren't available yet
const mockEmailMembershipCard = async (): Promise<EmailResponse> => {
  // Simulate server processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
};

export default function TapPass() {
  console.log('TapPass component initialized');
  console.log('Imported functions:', { createMember, getMemberByEmail });
  
  // Form state
  const [formStep, setFormStep] = useState(0); // Start at step 0 now - login check
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    birthday: '',
    phoneNumber: '',
    agreeToTerms: false,
  });
  const [loginData, setLoginData] = useState<LoginData>({
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [memberID, setMemberID] = useState('');
  const [cardImage, setCardImage] = useState('');
  const [formError, setFormError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  
  // Reference to the membership card div for capturing as image
  const memberCardRef = useRef<HTMLDivElement>(null);
  
  // Handle input changes for registration form
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error message when user starts typing
    if (formError) {
      setFormError('');
    }
  };
  
  // Handle input changes for login form
  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    
    // Clear error message when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };
  
  // Check if user account exists
  const checkExistingAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!loginData.email) {
      setLoginError('Please enter your email address');
      return;
    }
    
    setIsCheckingAccount(true);
    
    try {
      console.log("Checking for member with email:", loginData.email);
      const response = await getMemberByEmail(loginData.email);
      console.log("Server response:", response);
      
      if (response.success && 'data' in response) {
        // User exists, populate form data and show card
        console.log("Member found:", response.data);
        const existingMember = MemberSchema.parse(response.data);
        
        setFormData({
          name: existingMember.name,
          email: existingMember.email,
          birthday: existingMember.birthday.toISOString().split('T')[0],
          phoneNumber: existingMember.phoneNumber,
          agreeToTerms: existingMember.agreeToTerms
        });
        
        setMemberID(existingMember.memberId);
        setSubmitted(true);
        
        // Generate the card image
        setTimeout(() => {
          captureCardImage(existingMember.memberId);
        }, 100);
      } else {
        // User doesn't exist, proceed to registration
        console.log("Member not found, redirecting to registration");
        setFormData({
          ...formData,
          email: loginData.email
        });
        setFormStep(1);
      }
    } catch (err) {
      console.error('Error checking account:', err);
      // If there's an error, proceed to registration anyway
      setFormData({
        ...formData,
        email: loginData.email
      });
      setFormStep(1);
    } finally {
      setIsCheckingAccount(false);
    }
  };
  
  // Move to registration mode
  const startRegistration = () => {
    setFormStep(1);
  };
  
  // Move to next step
  const nextStep = () => {
    setFormStep(formStep + 1);
  };
  
  // Go back to previous step
  const prevStep = () => {
    setFormStep(formStep - 1);
  };
  
  // Handle form submission
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setFormError('Please agree to the terms and conditions');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.birthday || !formData.phoneNumber) {
      setFormError('Please fill in all required fields');
      return;
    }

    // Log form data for debugging
    console.log('Submitting form data:', {
      name: formData.name,
      email: formData.email,
      birthday: formData.birthday,
      phoneNumber: formData.phoneNumber,
      agreeToTerms: formData.agreeToTerms
    });
    
    setIsSubmitting(true);
    
    try {
      const response = await createMember({
        name: formData.name,
        email: formData.email,
        birthday: new Date(formData.birthday),
        phoneNumber: formData.phoneNumber,
        agreeToTerms: formData.agreeToTerms,
        membershipLevel: 'BRONZE', // Default level for new members
        joinDate: new Date() // Set join date to current date
      });
      
      console.log('Server response:', response);
      
      if (response.success && 'data' in response) {
        // The response data already matches our MemberSchema structure
        const newMember = (response.data as unknown) as {
          memberId: string;
          name: string;
          email: string;
          phoneNumber: string;
          birthday: Date;
          agreeToTerms: boolean;
          membershipLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
          joinDate: Date;
          points: number;
          visitCount: number;
          lastVisit: Date | null;
          createdAt: Date;
          updatedAt: Date;
        };
        setMemberID(newMember.memberId);
        setSubmitted(true);
        
        // Generate the card image
        setTimeout(() => {
          captureCardImage(newMember.memberId);
        }, 100);
      } else {
        console.error('Server error:', response);
        setFormError('error' in response ? response.error.message : 'Failed to create account');
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setFormError('An error occurred while creating your account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Capture the membership card as an image
  const captureCardImage = async (directMemberId?: string) => {
    if (memberCardRef.current) {
      setIsGeneratingCard(true);
      try {
        // Use the directly passed ID if available, otherwise use state
        // This helps avoid issues with state updates not being reflected yet
        const idToUse = directMemberId || memberID;
        
        // Validate and normalize the member ID to ensure it's properly formatted
        const currentMemberID = validateMemberID(idToUse);
        console.log(`Capturing card for ${formData.name} with validated ID ${currentMemberID}`);
        
        // Create a simplified version of the card directly with canvas for maximum compatibility
        const canvas = document.createElement('canvas');
        const width = 550;
        const height = 330;
        canvas.width = width * 2; // 2x for better resolution
        canvas.height = height * 2;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");
        
        // Scale everything for higher resolution
        ctx.scale(2, 2);
        
        // Apply crisp rendering for text
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Parse member ID parts
        const idParts = currentMemberID.split('-');
        const prefix = idParts[0] || 'ONE52';
        const middle = idParts[1] || '0000';
        const suffix = idParts[2] || '0000';
        
        // Draw clean background (dark with gradient)
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#111827');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw license plate background
        ctx.fillStyle = '#f5f5f5';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        roundRect(ctx, 25, 65, width - 50, 170, 10);
        ctx.fill();
        ctx.stroke();
        
        // Card title
        ctx.fillStyle = '#f0b429';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ONE-52 TAP PASS', width / 2, 38);
        
        // Website URL
        ctx.fillStyle = '#f0b429';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('www.one52bar.com', width / 2, 60);
        
        // Bar name
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ONE-52 BAR & GRILL', width / 2, 85);
        
        // Member name background
        ctx.fillStyle = '#1a365d';
        roundRect(ctx, 45, 100, width - 90, 40, 5);
        ctx.fill();
        
        // Member name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(formData.name, width / 2, 125);
        
        // Member ID background
        ctx.fillStyle = '#000000';
        roundRect(ctx, 45, 150, width - 90, 40, 5);
        ctx.fill();
        
        // ID text calculation for centering
        ctx.font = 'bold 20px monospace';
        const fullIdText = `${prefix}-${middle}-${suffix}`;
        const fullWidth = ctx.measureText(fullIdText).width;
        const startX = width / 2 - fullWidth / 2;
        
        // Draw ID parts with different colors
        ctx.fillStyle = '#ffffff';
        const prefixText = `${prefix}-`;
        const prefixWidth = ctx.measureText(prefixText).width;
        ctx.fillText(prefixText, startX, 175);
        
        ctx.fillStyle = '#f0b429';
        const randomText = `${middle}-`;
        const randomWidth = ctx.measureText(randomText).width;
        ctx.fillText(randomText, startX + prefixWidth, 175);
        
        ctx.fillStyle = '#4ade80';
        ctx.fillText(suffix, startX + prefixWidth + randomWidth, 175);
        
        // Footer text inside white area - increased size and weight, lowered position
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TAP PASS • BRONZE MEMBER', width / 2, 225);
        
        // Benefits summary - moved to black area below the card
        ctx.fillStyle = '#f0b429';
        ctx.font = '14px Arial';
        ctx.fillText('🎂 Free Birthday Drink • 🎉 10% Event Discount • 🍺 Beer Club • 👫 Bring Friends', width / 2, 285);
        
        // Generate image
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        console.log(`Card generated successfully with size: ${Math.round(dataUrl.length/1024)}KB`);
        setCardImage(dataUrl);
        
      } catch (error) {
        console.error('Error generating card:', error);
        // Create ultra-simple fallback that won't have any security issues
        createSimpleFallbackCard(formData.name, validateMemberID(directMemberId || memberID));
      } finally {
        setIsGeneratingCard(false);
      }
    }
  };
  
  // Simplified version of createSimpleFallbackCard
  const createSimpleFallbackCard = (name: string, memberId: string) => {
    try {
      const canvas = document.createElement('canvas');
      const width = 550;
      const height = 330;
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
      
      // Simple black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      
      // Card title
      ctx.fillStyle = '#f0b429';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ONE-52 TAP PASS', width / 2, 40);
      
      // Website URL
      ctx.fillStyle = '#f0b429';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('www.one52bar.com', width / 2, 60);
      
      // White plate background - increased height to make room for BRONZE MEMBER text
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(50, 70, 400, 160);
      
      // Member name
      ctx.fillStyle = '#1a365d';
      ctx.fillRect(70, 100, 360, 40);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, width / 2, 125);
      
      // Member ID
      ctx.fillStyle = '#000000';
      ctx.fillRect(70, 150, 360, 40);
      
      // Parse ID parts
      const idParts = memberId.split('-');
      const prefix = idParts[0] || 'ONE52';
      const middle = idParts[1] || '0000';
      const suffix = idParts[2] || '0000';
      
      // Draw ID with different colors
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px monospace';
      
      // Draw ID parts with proper colors
      const fullIdText = `${prefix}-${middle}-${suffix}`;
      const fullWidth = ctx.measureText(fullIdText).width;
      const startX = width / 2 - fullWidth / 2;
      
      // Draw the prefix "ONE52-"
      ctx.fillStyle = '#ffffff';
      const prefixText = `${prefix}-`;
      const prefixWidth = ctx.measureText(prefixText).width;
      ctx.fillText(prefixText, startX, 175);
      
      // Draw the random part in yellow/gold
      ctx.fillStyle = '#f0b429';
      const randomText = `${middle}-`;
      const randomWidth = ctx.measureText(randomText).width;
      ctx.fillText(randomText, startX + prefixWidth, 175);
      
      // Sequential part in green
      ctx.fillStyle = '#4ade80';
      ctx.fillText(suffix, startX + prefixWidth + randomWidth, 175);
      
      // Footer text - increased size and boldness
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 18px Arial'; // Increased from 16px to 18px
      ctx.fillText('TAP PASS • BRONZE MEMBER', width / 2, 220); // Lowered position
      
      // Benefits moved to black area below
      ctx.fillStyle = '#f0b429';
      ctx.font = '12px Arial';
      ctx.fillText('🎂 Free Birthday Drink • 🎉 10% Event Discount • 🍺 Beer Club • 👫 Bring Friends', width / 2, 260);
      
      // Get the resulting image
      const fallbackDataUrl = canvas.toDataURL('image/png');
      setCardImage(fallbackDataUrl);
      
    } catch (fallbackError) {
      console.error('Failed to create fallback card:', fallbackError);
      alert("Unable to generate card image. Please try again later.");
    }
  };
  
  // Helper function to draw a complete card on canvas
  const drawFullCardToCanvas = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    name: string, 
    memberId: string
  ) => {
    // Parse member ID parts
    const idParts = memberId.split('-');
    const prefix = idParts[0] || 'ONE52';
    const middle = idParts[1] || '0000';
    const suffix = idParts[2] || '0000';
    
    // Apply crisp rendering for text
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw a better background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Card title
    ctx.fillStyle = '#f0b429';
    ctx.font = 'bold 46px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ONE-52 TAP PASS', width/2, 70);
    
    // Draw license plate background with better styling
    ctx.fillStyle = '#f5f5f5';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    
    // Rounded rectangle for license plate with better proportions
    roundRect(ctx, width/2 - 350, 120, 700, 400, 20);
    ctx.fill();
    ctx.stroke();
    
    // Draw embossed effect
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 2;
    roundRect(ctx, width/2 - 340, 130, 680, 380, 15);
    ctx.stroke();
    
    // Add light texture to plate
    ctx.fillStyle = 'rgba(220, 220, 220, 0.2)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 700 + (width/2 - 350);
      const y = Math.random() * 400 + 120;
      const size = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Bar header with proper styling
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ONE-52 BAR & GRILL', width/2, 180);
    
    // Member name section with better styling
    ctx.fillStyle = '#1a365d';
    roundRect(ctx, width/2 - 300, 220, 600, 80, 8);
    ctx.fill();
    
    // Add subtle gradient to name background
    const nameGradient = ctx.createLinearGradient(0, 220, 0, 300);
    nameGradient.addColorStop(0, '#1a365d');
    nameGradient.addColorStop(1, '#0f2147');
    ctx.fillStyle = nameGradient;
    roundRect(ctx, width/2 - 300, 220, 600, 80, 8);
    ctx.fill();
    
    // Add embossed border to name area
    ctx.strokeStyle = '#0f2147';
    ctx.lineWidth = 3;
    roundRect(ctx, width/2 - 300, 220, 600, 80, 8);
    ctx.stroke();
    
    // Member name with shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(name, width/2, 270);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Member ID section with metallic look
    const idGradient = ctx.createLinearGradient(0, 330, 0, 410);
    idGradient.addColorStop(0, '#000000');
    idGradient.addColorStop(0.5, '#121212');
    idGradient.addColorStop(1, '#000000');
    ctx.fillStyle = idGradient;
    roundRect(ctx, width/2 - 300, 330, 600, 80, 8);
    ctx.fill();
    
    // Add highlight to ID background for metallic look
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    roundRect(ctx, width/2 - 300, 330, 600, 80, 8);
    ctx.stroke();
    
    // Member ID text with better styling
    ctx.font = 'bold 42px monospace';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 3;
    
    // Calculate total width for centering
    const fullIdText = `${prefix}-${middle}-${suffix}`;
    const fullWidth = ctx.measureText(fullIdText).width;
    const startX = width/2 - fullWidth/2;
    
    // Draw the prefix "ONE52-"
    ctx.fillStyle = '#ffffff';
    const prefixText = `${prefix}-`;
    const prefixWidth = ctx.measureText(prefixText).width;
    ctx.fillText(prefixText, startX, 380);
    
    // Draw the random part in yellow/gold
    ctx.fillStyle = '#f0b429';
    const randomText = `${middle}-`;
    const randomWidth = ctx.measureText(randomText).width;
    ctx.fillText(randomText, startX + prefixWidth, 380);
    
    // Sequential part in green with glow effect
    ctx.fillStyle = '#4ade80';
    ctx.shadowColor = 'rgba(74, 222, 128, 0.5)';
    ctx.shadowBlur = 5;
    ctx.fillText(suffix, startX + prefixWidth + randomWidth, 380);
    ctx.shadowBlur = 0;
    
    // Bottom text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('TAP PASS • BRONZE MEMBER', width/2, 450);
    
    // Add membership benefits area
    ctx.fillStyle = '#f0b429';
    ctx.font = 'bold 34px Arial';
    ctx.fillText('MEMBER BENEFITS', width/2, 570);
    
    // Add simplified benefits list
    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Arial';
    ctx.fillText('🎂 Free Birthday Drink • 🎉 10% Event Discount', width/2, 620);
    ctx.fillText('🍺 Beer Club • 👫 Bring Friends', width/2, 660);
    
    // QR code placeholder
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, width/2 - 75, 700, 150, 150, 10);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add QR code indicator
    ctx.fillStyle = '#f0b429';
    ctx.font = '20px Arial';
    ctx.fillText('Scan to verify membership', width/2, 890);
    
    // Add footer
    ctx.fillStyle = '#999999';
    ctx.font = '16px Arial';
    ctx.fillText('Present this card to earn and redeem rewards', width/2, 950);
    ctx.fillStyle = '#f0b429';
    ctx.fillText(`Join Date: ${new Date().toLocaleDateString()}`, width/2, 980);
  };
  
  // Download membership card
  const downloadCard = () => {
    console.log("Download requested, card image available:", !!cardImage);
    
    if (!cardImage) {
      alert("Still generating your card. Please wait a moment and try again.");
      captureCardImage(); // Try capturing again
      return;
    }
    
    try {
      // Use the download attribute approach for modern browsers
      const link = document.createElement('a');
      link.href = cardImage;
      link.download = `ONE52-TapPass-${formData.name.replace(/\s+/g, '-')}.png`;
      
      // Add to body and position offscreen
      document.body.appendChild(link);
      link.style.position = 'absolute';
      link.style.left = '-9999px';
      
      // Trigger click with a small delay to ensure browser handles it
      setTimeout(() => {
        link.click();
        console.log("Download link clicked");
        
        // Remove the element after a delay
        setTimeout(() => {
          document.body.removeChild(link);
        }, 1000);
      }, 100);
      
      // Show confirmation
      alert("Your TapPass card download has started. Check your downloads folder.");
      
    } catch (error) {
      console.error("Download error:", error);
      
      // Try a different method if the first one failed
      try {
        // Open image in new window as a fallback
        window.open(cardImage, '_blank');
        alert("We've opened your card in a new tab. You can right-click and select 'Save Image As...' to download it.");
      } catch (fallbackError) {
        console.error("Fallback download failed:", fallbackError);
        alert("There was an issue downloading your card. Please try again or use the Email option.");
      }
    }
  };
  
  // Handle email card
  const handleEmailCard = async () => {
    const emailFormData = new FormData();
    emailFormData.append('email', formData.email);
    emailFormData.append('memberId', memberID);
    
    try {
      // Use mock implementation for now
      const result = await mockEmailMembershipCard();
      
      if (result.success) {
        alert(`In this demo version, emails are simulated.\n\nIn production, your TapPass card would be sent to ${formData.email}.\n\nPlease use the download button to save your card.`);
      } else {
        alert(result.error || 'Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };
  
  // Return to the account check step
  const returnToLogin = () => {
    setFormStep(0);
    setFormError('');
    setLoginError('');
  };
  
  // Benefit cards component
  const BenefitCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {BENEFITS.map((benefit, index) => (
        <div key={index} className="bg-gray-900 bg-opacity-80 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 border border-gray-700">
          <div className="p-5">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">{benefit.icon}</span>
              <h3 className="font-bold text-lg text-blue-300">{benefit.title}</h3>
            </div>
            <p className="text-gray-300">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  // SVG license plate component for rendering the member ID consistently
  const LicensePlateText = ({ memberID }: { memberID: string }) => {
    // Parse the ID parts safely using our validation function
    const validatedID = validateMemberID(memberID);
    const parts = validatedID.split('-');
    const prefix = parts[0];
    const middle = parts[1];
    const suffix = parts[2];
    
    return (
      <>
        <tspan>{prefix}-</tspan>
        <tspan fill="#f0b429">{middle}-</tspan>
        <tspan fill="#4ade80">{suffix}</tspan>
      </>
    );
  };
  
  // Helper function to validate and format member ID consistently
  const validateMemberID = (id: string): string => {
    console.log("Validating member ID:", id);
    
    // Default if no ID or invalid format
    let validID = "ONE52-0000-0000";
    
    if (id && typeof id === 'string') {
      if (id.includes('-')) {
        // Already has hyphens, validate format
        const parts = id.split('-');
        if (parts.length >= 3) {
          // Ensure each part has proper format:
          // First part should be ONE52
          // Second part should be 4 digits
          // Third part should be 4 digits (sequential ID)
          const firstPart = parts[0] === 'ONE52' ? 'ONE52' : 'ONE52';
          
          // IMPORTANT: Preserve the actual values from the server instead of defaulting
          let secondPart = parts[1];
          let thirdPart = parts[2];
          
          // Only apply padding/limiting if parts are missing or malformed
          if (!secondPart || !/^\d{4}$/.test(secondPart)) {
            secondPart = (secondPart || '0000').padStart(4, '0').substring(0, 4);
          }
          
          if (!thirdPart || !/^\d{4}$/.test(thirdPart)) {
            thirdPart = (thirdPart || '0000').padStart(4, '0').substring(0, 4);
          }
          
          validID = `${firstPart}-${secondPart}-${thirdPart}`;
        }
      } else {
        // No hyphens, check if it might be a legacy or malformed ID
        const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanId.length >= 8) {
          // Try to extract meaningful parts
          if (cleanId.toLowerCase().startsWith('one52')) {
            // Remove ONE52 prefix and then split remaining digits
            const numericPart = cleanId.substring(5);
            if (numericPart.length >= 8) {
              // If we have at least 8 digits after prefix
              const randomPart = numericPart.substring(0, 4);
              const sequentialPart = numericPart.substring(4, 8);
              validID = `ONE52-${randomPart}-${sequentialPart}`;
            } else if (numericPart.length >= 4) {
              // If we have at least 4 digits, use them as random part
              const randomPart = numericPart.substring(0, 4);
              validID = `ONE52-${randomPart}-0001`;
            } else {
              // Not enough digits, generate random
              const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
              validID = `ONE52-${randomPart}-0001`;
            }
          } else {
            // No prefix, treat first 8 chars as two parts
            const randomPart = cleanId.substring(0, 4);
            const sequentialPart = cleanId.length > 4 ? cleanId.substring(4, 8) : '0001';
            validID = `ONE52-${randomPart}-${sequentialPart}`;
          }
        } else {
          // Not enough characters, generate a random ID
          const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
          validID = `ONE52-${randomPart}-0001`;
        }
      }
    }
    
    console.log("Validated member ID:", validID);
    return validID;
  };
  
  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-300">TapPass Loyalty Program</h1>
        <p className="text-center text-xl mb-12 text-white">Earn rewards every time you visit ONE-52 Bar & Grill!</p>
        
        {!submitted ? (
          <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-6 md:p-8">
              <div className="flex justify-between mb-8">
                <div className="w-full max-w-xs">
                  <div className="relative h-2 bg-gray-600 rounded">
                    <div 
                      className="absolute h-2 bg-yellow-500 rounded"
                      style={{ width: `${((formStep) / 4) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    {formStep === 0 ? 'Account Check' : `Step ${formStep} of 3`}
                  </div>
                </div>
              </div>
              
              {/* Step 0: Check for existing account */}
              {formStep === 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-blue-300">Check Your TapPass</h2>
                  
                  <form onSubmit={checkExistingAccount}>
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        className="shadow appearance-none border border-gray-700 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    
                    {loginError && (
                      <div className="mb-4 p-2 bg-red-900 text-white rounded">
                        {loginError}
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={isCheckingAccount}
                        className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                      >
                        {isCheckingAccount ? 'Checking...' : 'Check My TapPass'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={startRegistration}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Create New TapPass
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Registration steps - keep the existing ones */}
              <form onSubmit={handleFormSubmit}>
                {formStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-blue-300">Personal Information</h2>
                    
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        className="shadow appearance-none border border-gray-700 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="shadow appearance-none border border-gray-700 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                      <button
                        type="button"
                        onClick={returnToLogin}
                        className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Back
                      </button>
                      
                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                
                {formStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-blue-300">Additional Details</h2>
                    
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="birthday">
                        Birthday (for birthday rewards)
                      </label>
                      <input
                        className="shadow appearance-none border border-gray-700 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-sm text-yellow-400 mt-1">🎂 Free drink on your birthday with purchase over $10!</p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="phoneNumber">
                        Phone Number
                      </label>
                      <input
                        className="shadow appearance-none border border-gray-700 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="(555) 555-5555"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-sm text-yellow-400 mt-1">📱 We&apos;ll text you about exclusive member events</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Back
                      </button>
                      
                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                
                {formStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-blue-300">Confirm & Submit</h2>
                    
                    <div className="bg-blue-900 bg-opacity-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-200 font-medium">
                            You&apos;re almost done! Sign up today and receive an immediate 10% discount on your next visit.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 bg-opacity-70 p-4 rounded mb-4">
                      <h3 className="font-bold text-lg mb-2 text-yellow-300">TapPass Benefits</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-200">
                        <li>Earn points on every purchase</li>
                        <li>Free birthday drink with purchase over $10</li>
                        <li>10% off your bar tab when you RSVP to events</li>
                        <li>Exclusive member-only events and offers</li>
                        <li>Beer of the month club discounts</li>
                        <li>20% off when you invite friends to our Facebook page</li>
                        <li>10% off when you bring 3 friends to ONE-52</li>
                        <li>Tiered rewards system (Bronze to Platinum)</li>
                        <li>Sunday double points</li>
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center p-3 bg-gray-900 rounded-md border border-gray-600">
                        <input
                          id="agreeToTerms"
                          name="agreeToTerms"
                          type="checkbox"
                          className="h-5 w-5 text-yellow-500 border-gray-400 rounded focus:ring-yellow-400"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          required
                        />
                        <label className="ml-3 block text-white text-base" htmlFor="agreeToTerms">
                          I agree to the ONE-52 TapPass terms and conditions
                        </label>
                      </div>
                      <div className="mt-2 text-xs text-gray-300 px-3">
                        By checking this box, you agree to our membership terms including receiving promotional emails and texts about events and special offers. You can unsubscribe at any time. View our full <a href="#" className="text-yellow-400 underline">Terms & Conditions</a>.
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Back
                      </button>
                      
                      <button
                        type="submit"
                        className={`${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400'} text-gray-900 font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline flex items-center transition-all`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Join Now & Get 10% Off'
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
                <h2 className="mt-4 text-2xl font-bold text-yellow-300">Welcome to TapPass!</h2>
                <p className="mt-2 text-gray-300">
                  Your membership has been created successfully. Here&apos;s your ONE-52 TAP PASS:
                </p>
              </div>
              
              {/* Membership Card - This will be captured as an image */}
              <div 
                ref={memberCardRef}
                data-card-clone="true"
                className="relative mx-auto my-8 bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden"
                style={{ 
                  width: '550px',
                  height: '330px',
                  boxSizing: 'border-box',
                  maxWidth: '95vw',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), 0 6px 10px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Dark background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
                
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-6">
                  {/* Card Header */}
                  <div className="text-center mb-1">
                    <h3 className="text-yellow-400 text-2xl font-bold tracking-wider">ONE-52 TAP PASS</h3>
                    <p className="text-yellow-400 text-sm">www.one52bar.com</p>
                  </div>
                  
                  {/* License Plate - increased height for BRONZE MEMBER text */}
                  <div className="bg-white rounded-lg w-11/12 h-44 flex flex-col items-center shadow-md overflow-hidden">
                    <div className="bg-gray-100 w-full py-2 border-b border-gray-300">
                      <h4 className="text-gray-800 text-center font-bold text-lg">ONE-52 BAR & GRILL</h4>
                    </div>
                    
                    {/* Member Name */}
                    <div className="bg-blue-900 w-full py-3 flex items-center justify-center">
                      <p className="text-white font-bold text-xl">{formData.name}</p>
                    </div>
                    
                    {/* Member ID */}
                    <div className="bg-black w-full py-4 flex items-center justify-center">
                      <p className="font-mono font-bold text-xl tracking-wide">
                        <span className="text-white">ONE52-</span>
                        <span className="text-yellow-400">{validateMemberID(memberID).split('-')[1]}-</span>
                        <span className="text-green-400">{validateMemberID(memberID).split('-')[2]}</span>
                      </p>
                    </div>
                    
                    {/* Bottom Text - increased padding and font size/weight */}
                    <div className="bg-gray-100 w-full py-5 border-t border-gray-300 flex-grow flex flex-col justify-center">
                      <p className="text-gray-800 text-center font-extrabold text-lg">TAP PASS • BRONZE MEMBER</p>
                    </div>
                  </div>
                  
                  {/* Benefits moved to black area */}
                  <p className="text-yellow-400 text-sm text-center mt-2">
                    🎂 Free Birthday Drink • 🎉 10% Event Discount • 🍺 Beer Club • 👫 Bring Friends
                  </p>
                </div>
              </div>
              
              {isGeneratingCard ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                  <p className="mt-2 text-gray-300">Generating your membership card...</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button
                    onClick={downloadCard}
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                    disabled={!cardImage || isGeneratingCard}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Membership Card
                  </button>
                  
                  <button
                    onClick={handleEmailCard}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Email Membership Card
                    <span className="text-xs ml-1">(Demo)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}