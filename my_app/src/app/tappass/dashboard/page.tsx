import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beer, Gift, Star, Trophy } from "lucide-react";
import { memberService } from "@/lib/db/member";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function TapPassDashboard() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your TapPass dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const member = await memberService.getMemberByEmail(email);

  if (!member) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Member Not Found</CardTitle>
            <CardDescription>Please register for TapPass to access the dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Member Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {member.name}!</CardTitle>
          <CardDescription>Member ID: {member.memberId}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Points Balance</p>
              <p className="text-2xl font-bold">{member.points}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membership Level</p>
              <p className="text-2xl font-bold">{member.membershipLevel}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <p className="text-2xl font-bold">{member.visitCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Visit</p>
              <p className="text-2xl font-bold">
                {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beer className="h-5 w-5" />
              Beer of the Month
            </CardTitle>
            <CardDescription>Get 50% off your first beer or mixed drink</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Special Discounts
            </CardTitle>
            <CardDescription>10% off meals of $25 or more</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Points Program
            </CardTitle>
            <CardDescription>Earn points with every visit and purchase</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Loyalty Rewards
            </CardTitle>
            <CardDescription>Unlock exclusive benefits as you level up</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 