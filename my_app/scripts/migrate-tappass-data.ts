import { PrismaClient } from '@prisma/client';
import { parse } from 'date-fns';

const prisma = new PrismaClient();

async function migrateData() {
  console.log('Starting TapPass data migration...');
  
  try {
    // Get all form data
    const formData = await prisma.tapPassFormData.findMany();
    console.log(`Found ${formData.length} form records to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const form of formData) {
      try {
        // Find corresponding member data
        const memberData = await prisma.tapPassMember.findFirst({
          where: { memberId: form.id }
        });

        console.log(`Processing member: ${form.email}`);

        // Create new member record
        const newMember = await prisma.member.create({
          data: {
            memberId: form.id,
            name: form.name,
            email: form.email,
            phoneNumber: form.phoneNumber,
            birthday: parse(form.birthday, 'yyyy-MM-dd', new Date()),
            agreeToTerms: form.agreeToTerms,
            membershipLevel: memberData?.tier || 'BRONZE',
            joinDate: parse(memberData?.memberSince || new Date().toISOString(), 'yyyy-MM-dd', new Date()),
            points: memberData?.points || 0,
            visits: memberData?.visits || 0,
            lastVisit: memberData?.lastVisit ? parse(memberData.lastVisit, 'yyyy-MM-dd', new Date()) : null
          }
        });

        // Create initial visit record if member has points
        if (memberData?.points > 0) {
          await prisma.visit.create({
            data: {
              memberId: newMember.id,
              visitDate: newMember.joinDate,
              points: memberData.points,
              amount: 0 // We don't have historical amount data
            }
          });
        }

        successCount++;
        console.log(`Successfully migrated member: ${form.email}`);
      } catch (error) {
        errorCount++;
        console.error(`Error migrating member ${form.email}:`, error);
      }
    }

    console.log('\nMigration Summary:');
    console.log(`Total records processed: ${formData.length}`);
    console.log(`Successful migrations: ${successCount}`);
    console.log(`Failed migrations: ${errorCount}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateData()
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 