import { PrismaClient } from '@prisma/client';
import {
  getMemberByEmail,
  registerTapPassMember,
  recordVisit,
  getAllMembers
} from '../actions';

// Mock FormData
class MockFormData {
  private data: Record<string, string> = {};

  constructor(data: Record<string, string>) {
    this.data = data;
  }

  get(key: string) {
    return this.data[key];
  }
}

/**
 * TapPass Prisma Implementation Verification Tests
 * 
 * These tests verify that the TapPass system is fully integrated with Prisma
 * by testing the actual database operations. They require a test database
 * connection and will create/read/update actual records.
 * 
 * Intended to be run manually for verification rather than as part of CI.
 */
describe('TapPass Prisma Integration', () => {
  // Setup
  let prisma: PrismaClient;
  let testMemberId: string;
  const testEmail = `test-${Date.now()}@example.com`;

  beforeAll(async () => {
    prisma = new PrismaClient();
    // Create a test member directly in the database for verification
    const testMember = await prisma.member.create({
      data: {
        memberId: `TEST-${Date.now()}-0001`,
        name: 'Test Member',
        email: testEmail,
        phoneNumber: `555-${Date.now()}`,
        birthday: new Date('1990-01-01'),
        agreeToTerms: true,
        membershipLevel: 'BRONZE',
        joinDate: new Date(),
        points: 0,
        visits: 0
      }
    });
    testMemberId = testMember.memberId;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.visit.deleteMany({
      where: {
        member: {
          email: testEmail
        }
      }
    });
    await prisma.member.deleteMany({
      where: {
        email: testEmail
      }
    });
    await prisma.$disconnect();
  });

  // Tests
  test('getMemberByEmail returns correct member from database', async () => {
    const result = await getMemberByEmail(testEmail);
    expect(result.success).toBe(true);
    expect(result.member).toBeDefined();
    if (result.success && result.member) {
      expect(result.member.email).toBe(testEmail);
      expect(result.member.memberId).toBe(testMemberId);
    }
  });

  test('registerTapPassMember creates a new member in the database', async () => {
    const newEmail = `new-test-${Date.now()}@example.com`;
    const formData = new MockFormData({
      name: 'New Test Member',
      email: newEmail,
      birthday: '1995-05-05',
      phoneNumber: `555-${Date.now()}-new`,
      agreeToTerms: 'true'
    }) as unknown as FormData;

    const result = await registerTapPassMember(formData);
    expect(result.success).toBe(true);
    expect(result.member).toBeDefined();
    if (result.success && result.member) {
      expect(result.member.email).toBe(newEmail);
      expect(result.member.memberId).toBeDefined();

      // Verify the member was created in the database
      const member = await prisma.member.findUnique({
        where: { email: newEmail }
      });
      expect(member).toBeDefined();
      expect(member?.email).toBe(newEmail);
      expect(member?.memberId).toBe(result.member.memberId);

      // Clean up
      if (member) {
        await prisma.visit.deleteMany({
          where: { memberId: member.id }
        });
        await prisma.member.delete({
          where: { id: member.id }
        });
      }
    }
  });

  test('recordVisit creates a visit and updates member points', async () => {
    // Initial points
    const initialMember = await prisma.member.findUnique({
      where: { email: testEmail }
    });
    const initialPoints = initialMember?.points || 0;

    // Record a visit
    const amount = 50;
    const result = await recordVisit(testMemberId, amount);
    expect(result.success).toBe(true);

    // Verify visit was recorded
    const updatedMember = await prisma.member.findUnique({
      where: { email: testEmail },
      include: {
        visits: {
          orderBy: { visitDate: 'desc' },
          take: 1
        }
      }
    });

    expect(updatedMember).toBeDefined();
    expect(updatedMember?.points).toBe(initialPoints + amount);
    expect(updatedMember?.visits.length).toBeGreaterThan(0);
    expect(updatedMember?.visits[0].amount).toBe(amount);
  });

  test('getAllMembers returns members with visit history', async () => {
    const result = await getAllMembers();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.members)).toBe(true);
    
    // Look for our test member
    const testMember = result.members?.find(m => m.email === testEmail);
    expect(testMember).toBeDefined();
    expect(testMember?.visits).toBeDefined();
    expect(Array.isArray(testMember?.visits)).toBe(true);
  });
}); 