import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMembers(): Promise<void> {
  try {
    const members = await prisma.member.findMany();
    console.log("Total members:", members.length);
    
    if (members.length > 0) {
      console.log("Sample member:", members[0]);
    }
  } catch (e) {
    console.error("Error checking members:", e);
  } finally {
    await prisma.$disconnect();
  }
}

checkMembers(); 