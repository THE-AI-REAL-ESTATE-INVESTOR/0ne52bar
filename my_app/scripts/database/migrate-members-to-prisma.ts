/**
 * Migrate TapPass Members from JSON to Prisma Database
 * 
 * This script reads members from the JSON file and imports them into the Prisma database.
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Path to the JSON file
const TAP_PASS_DB_PATH = path.join(process.cwd(), 'src/data/tap-pass-members.json');

// Interface for members in the JSON file
interface TapPassMemberJSON {
  name: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  agreeToTerms: boolean;
  memberId: string;
  memberSince: string;
  tier: string;
  points: number;
  visits: number;
  lastVisit?: string;
}

// Get members from JSON file
function getMembersFromJSON() {
  try {
    const data = fs.readFileSync(TAP_PASS_DB_PATH, 'utf8');
    const database = JSON.parse(data);
    return database.members || [];
  } catch (error) {
    console.error('Error reading members database:', error);
    return [];
  }
}

// Convert JSON tier to MembershipLevel enum
function convertTierToMembershipLevel(tier) {
  switch (tier.toUpperCase()) {
    case 'SILVER':
      return 'SILVER';
    case 'GOLD':
      return 'GOLD';
    case 'PLATINUM':
      return 'PLATINUM';
    default:
      return 'BRONZE';
  }
}

// Main migration function
async function migrateMembers() {
  try {
    // Get members from JSON
    const members = getMembersFromJSON();
    console.log(`Found ${members.length} members in JSON file.`);
    
    // Keep track of migration stats
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    // Process each member
    for (const member of members) {
      try {
        // Check if member already exists in database
        const existingMember = await prisma.member.findUnique({
          where: {
            email: member.email
          }
        });
        
        // Skip if member already exists
        if (existingMember) {
          console.log(`Skipping ${member.email} - already exists in database.`);
          skipped++;
          continue;
        }
        
        // Create new member in database
        await prisma.member.create({
          data: {
            memberId: member.memberId,
            name: member.name,
            email: member.email,
            phoneNumber: member.phoneNumber,
            birthday: new Date(member.birthday),
            agreeToTerms: member.agreeToTerms,
            membershipLevel: convertTierToMembershipLevel(member.tier),
            joinDate: new Date(member.memberSince),
            points: member.points,
            visits: member.visits,
            lastVisit: member.lastVisit ? new Date(member.lastVisit) : null
          }
        });
        
        created++;
        console.log(`Created member ${member.email} with ID ${member.memberId} in database.`);
      } catch (error) {
        console.error(`Error migrating member ${member.email}:`, error);
        errors++;
      }
    }
    
    // Log stats
    console.log('\nMigration completed:');
    console.log(`- Created: ${created}`);
    console.log(`- Skipped: ${skipped}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Total processed: ${members.length}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Run the migration
migrateMembers()
  .then(() => console.log('Migration completed.'))
  .catch(error => console.error('Error in migration script:', error)); 