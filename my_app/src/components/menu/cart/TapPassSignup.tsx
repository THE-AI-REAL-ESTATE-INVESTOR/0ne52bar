'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registerTapPassMember } from '@/app/tappass/actions';
import { useRouter } from 'next/navigation';
import { Beer, Wine, Star, Calendar } from 'lucide-react';
import CardGenerator from '@/components/tappass/card/CardGenerator';
import CardActions from '@/components/tappass/card/CardActions';
import type { MembershipLevel, Member } from '@prisma/client';

interface MemberResponse {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  agreeToTerms: boolean;
  membershipLevel: MembershipLevel;
  points: number;
  visitCount: number;
  joinDate: string;
  lastVisit: string | null;
  visitHistory: Array<{
    id: string;
    memberId: string;
    visitDate: string;
    points: number;
    amount: number;
  }>;
}

interface TapPassSignupProps {
  orderTotal: number;
  customerName: string;
  phoneNumber: string;
  onSkip: () => void;
  clearCart: () => void;
}

export function TapPassSignup({ orderTotal, customerName, phoneNumber, onSkip, clearCart }: TapPassSignupProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [member, setMember] = useState<MemberResponse | null>(null);
  const [cardImage, setCardImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!agreeToTerms) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', customerName);
      formData.append('email', email);
      formData.append('birthday', birthday);
      formData.append('phoneNumber', phoneNumber);
      formData.append('agreeToTerms', 'true');

      const result = await registerTapPassMember(formData);

      if (result.success && result.member) {
        setShowSuccess(true);
        setMember(result.member);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error registering member:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDashboard = () => {
    clearCart();
    router.push('/tappass/dashboard');
  };

  // Convert MemberResponse to Member format for CardGenerator
  const getMemberForCard = (memberResponse: MemberResponse): Member => {
    return {
      ...memberResponse,
      birthday: new Date(memberResponse.birthday),
      joinDate: new Date(memberResponse.joinDate),
      lastVisit: memberResponse.lastVisit ? new Date(memberResponse.lastVisit) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      visitHistory: memberResponse.visitHistory.map(visit => ({
        ...visit,
        visitDate: new Date(visit.visitDate)
      }))
    } as Member;
  };

  const handleCardGenerated = (dataUrl: string) => {
    setCardImage(dataUrl);
  };

  const handleDownload = () => {
    if (cardImage) {
      const link = document.createElement('a');
      link.href = cardImage;
      link.download = `ONE52-TapPass-${member?.name.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEmail = async () => {
    // Implement email functionality
    alert('Email functionality will be implemented soon!');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800 max-h-[95vh] overflow-y-auto">
            <CardHeader className="pb-2 sticky top-0 bg-gray-900 z-10 border-b border-gray-800">
              <CardTitle className="text-lg sm:text-xl font-bold text-white text-center">
                Join ONE-52 Bar TapPass Today 🍻
              </CardTitle>
              <div className="mt-2 text-center space-y-1">
                <p className="text-amber-500 font-semibold text-sm">Drink beer, Earn points +</p>
                <p className="text-amber-500 font-semibold text-sm">Eat food, Earn points +</p>
                <p className="text-amber-500 font-semibold text-sm">Register for events, Get points!</p>
                <p className="text-gray-300 text-xs mt-2">
                  Cash in your points for more food, beer, and discounts!
                </p>
                <p className="text-amber-500 font-bold text-sm">ONE-52 BAR TAP PASS 🍺</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="bg-amber-600/10 border border-amber-600/20 rounded-lg p-3">
                <h3 className="text-base sm:text-lg font-bold text-amber-500 mb-2">Special Offers!</h3>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    Get 10% off your order today of ${orderTotal.toFixed(2)} or more!
                  </p>
                  <p className="text-amber-500 font-semibold text-sm">
                    That&apos;s ${(orderTotal * 0.1).toFixed(2)} in savings!
                  </p>
                  <div className="mt-2 pt-2 border-t border-amber-600/20">
                    <p className="text-amber-500 font-semibold text-sm">PLUS</p>
                    <p className="text-gray-300 text-sm">
                      50% off your first beer or mixed drink!*
                    </p>
                    <p className="text-xs text-gray-400">
                      *Ask your bartender about available drinks
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Beer className="h-5 w-5 text-amber-500 mb-1" />
                  <h4 className="text-amber-500 font-semibold text-sm">Beer Club</h4>
                  <p className="text-xs text-gray-300">Special brews access</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Wine className="h-5 w-5 text-amber-500 mb-1" />
                  <h4 className="text-amber-500 font-semibold text-sm">Mixed Drinks</h4>
                  <p className="text-xs text-gray-300">Half off first drink</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Star className="h-5 w-5 text-amber-500 mb-1" />
                  <h4 className="text-amber-500 font-semibold text-sm">Points</h4>
                  <p className="text-xs text-gray-300">Earn with every visit</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-500 mb-1" />
                  <h4 className="text-amber-500 font-semibold text-sm">Events</h4>
                  <p className="text-xs text-gray-300">VIP access</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="birthday" className="text-gray-300 text-sm">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="bg-gray-800 border-gray-700 h-9"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 h-9"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-gray-800">
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={!birthday || !email}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800 max-h-[95vh] overflow-y-auto">
            <CardHeader className="pb-2 sticky top-0 bg-gray-900 z-10 border-b border-gray-800">
              <CardTitle className="text-lg sm:text-xl font-bold text-white text-center">
                Membership Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded-lg border border-amber-500/20">
                  <h3 className="text-amber-500 font-semibold mb-2 text-sm">BRONZE</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• 10% off all orders over $25</li>
                    <li>• 50% off first beer or mixed drink</li>
                    <li>• Points for every visit</li>
                    <li>• Birthday special</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-400/20">
                  <h3 className="text-gray-400 font-semibold mb-2 text-sm">SILVER</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• 15% off all orders over $25</li>
                    <li>• Free birthday drink</li>
                    <li>• Priority service</li>
                    <li>• Double points on weekdays</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg border border-yellow-500/20">
                  <h3 className="text-yellow-500 font-semibold mb-2 text-sm">GOLD</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• 20% off all orders over $25</li>
                    <li>• Monthly free drink</li>
                    <li>• VIP events access</li>
                    <li>• Triple points on weekends</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-gray-800 space-y-3">
              {error && (
                <div className="bg-red-900/20 border border-red-900/20 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="border-gray-700"
                />
                <Label htmlFor="terms" className="text-gray-300 text-sm">
                  I agree to the TapPass terms and conditions
                </Label>
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={!agreeToTerms || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up & Get 10% Off'}
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  if (showSuccess && member) {
    const memberForCard = getMemberForCard(member);
    return (
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
              Here&apos;s your ONE-52 TAP PASS:
            </p>
          </div>

          <div className="flex flex-col items-center">
            <CardGenerator member={memberForCard} onGenerated={handleCardGenerated} />
            <CardActions onDownload={handleDownload} onEmail={handleEmail} />
          </div>

          <p className="text-amber-500 text-sm mt-4 text-center">
            Redirecting to your dashboard in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      {renderStep()}
    </div>
  );
} 