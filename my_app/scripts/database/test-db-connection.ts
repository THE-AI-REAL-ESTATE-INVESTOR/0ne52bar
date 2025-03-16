#!/usr/bin/env ts-node

/**
 * Database Connection Test Script
 * 
 * This script tests the connection to the database and performs
 * basic CRUD operations to verify everything is working correctly.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test connection by getting the number of users
    const userCount = await prisma.user.count();
    console.log(`✅ Connection successful. Found ${userCount} users in the database.`);
    
    // Test TapPassFormData operations
    console.log('\n🧪 Testing TapPassFormData operations...');
    
    // Create a test submission
    const testSubmission = await prisma.tapPassFormData.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        birthday: '1990-01-01',
        phoneNumber: '555-123-4567',
        agreeToTerms: true
      }
    });
    console.log('✅ Created test submission:', testSubmission.id);
    
    // Read the submission
    const foundSubmission = await prisma.tapPassFormData.findUnique({
      where: { id: testSubmission.id }
    });
    console.log('✅ Retrieved submission:', foundSubmission?.id);
    
    // Update the submission
    const updatedSubmission = await prisma.tapPassFormData.update({
      where: { id: testSubmission.id },
      data: {
        name: 'Updated Test User',
        phoneNumber: '555-999-8888'
      }
    });
    console.log('✅ Updated submission name to:', updatedSubmission.name);
    
    // Delete the submission (clean up)
    await prisma.tapPassFormData.delete({
      where: { id: testSubmission.id }
    });
    console.log('✅ Deleted test submission');
    
    // Test TapPassMember operations
    console.log('\n🧪 Testing TapPassMember operations...');
    
    // Create a test member
    const testMember = await prisma.tapPassMember.create({
      data: {
        memberId: 'MEM12345',
        memberSince: '2023-01-01',
        tier: 'GOLD',
        points: 1000,
        visits: 10,
        lastVisit: '2023-06-15'
      }
    });
    console.log('✅ Created test member:', testMember.id);
    
    // Read the member
    const foundMember = await prisma.tapPassMember.findUnique({
      where: { id: testMember.id }
    });
    console.log('✅ Retrieved member:', foundMember?.id);
    
    // Update the member
    const updatedMember = await prisma.tapPassMember.update({
      where: { id: testMember.id },
      data: {
        tier: 'PLATINUM',
        points: 1500,
        visits: 15
      }
    });
    console.log('✅ Updated member tier to:', updatedMember.tier);
    
    // Delete the member (clean up)
    await prisma.tapPassMember.delete({
      where: { id: testMember.id }
    });
    console.log('✅ Deleted test member');
    
    console.log('\n🎉 All database operations completed successfully!');
  } catch (error) {
    console.error('❌ Error testing database connection:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the test
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 