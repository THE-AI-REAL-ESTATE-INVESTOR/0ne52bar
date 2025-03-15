import { PrismaClient, MembershipLevel } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.reward.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.member.deleteMany();

  console.log('Creating sample members...');

  // Generate a unique member ID in the format ONE52-XXXX-YYYY
  function generateMemberId(index: number): string {
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    const sequentialPart = index.toString().padStart(4, '0');
    return `ONE52-${randomPart}-${sequentialPart}`;
  }

  // Sample member data
  const members = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phoneNumber: '5551234567',
      birthday: new Date('1985-05-15'),
      membershipLevel: MembershipLevel.GOLD,
      agreeToTerms: true,
      memberId: generateMemberId(1),
    },
    {
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phoneNumber: '5559876543',
      birthday: new Date('1990-08-23'),
      membershipLevel: MembershipLevel.SILVER,
      agreeToTerms: true,
      memberId: generateMemberId(2),
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phoneNumber: '5552345678',
      birthday: new Date('1978-11-30'),
      membershipLevel: MembershipLevel.BRONZE,
      agreeToTerms: true,
      memberId: generateMemberId(3),
    },
    {
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      phoneNumber: '5558765432',
      birthday: new Date('1992-03-12'),
      membershipLevel: MembershipLevel.PLATINUM,
      agreeToTerms: true,
      memberId: generateMemberId(4),
    },
  ];

  // Create members
  for (const memberData of members) {
    const member = await prisma.member.create({
      data: memberData,
    });

    console.log(`Created member: ${member.name} (${member.memberId})`);

    // Add sample visits for each member
    const visitCount = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < visitCount; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Random date in the last 90 days
      
      const amount = Math.round((Math.random() * 50 + 10) * 100) / 100; // Random amount between $10 and $60
      const points = Math.floor(amount); // 1 point per dollar

      await prisma.visit.create({
        data: {
          memberId: member.id,
          visitDate: date,
          amount,
          points,
        },
      });
    }

    // Add sample rewards for each member
    if (Math.random() > 0.5) {
      const rewardTypes = ['BIRTHDAY_DRINK', 'DISCOUNT', 'FREE_ITEM'];
      const rewardType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // Expires in 30 days
      
      await prisma.reward.create({
        data: {
          memberId: member.id,
          rewardType,
          description: rewardType === 'BIRTHDAY_DRINK' 
            ? 'Free drink on your birthday' 
            : rewardType === 'DISCOUNT' 
              ? '10% off your next purchase' 
              : 'Free appetizer',
          value: rewardType === 'BIRTHDAY_DRINK' ? 8.00 : rewardType === 'DISCOUNT' ? 0 : 12.00,
          expiresAt: expiryDate,
          isRedeemed: false,
        },
      });
    }
  }

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 