export interface TapPassMember {
  name: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  agreeToTerms: boolean;
  memberId: string;
  memberSince: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
  visits: number;
} 