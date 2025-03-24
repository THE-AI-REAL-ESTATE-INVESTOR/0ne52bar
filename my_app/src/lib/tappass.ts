import fs from 'fs';
import path from 'path';
import { TapPassMember } from '@/types/tappass';

const DB_PATH = path.join(process.cwd(), 'data', 'tappass.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize the database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

export function getMembers(): TapPassMember[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading TapPass database:', error);
    return [];
  }
}

export function saveMember(member: TapPassMember): boolean {
  try {
    const members = getMembers();
    const existingIndex = members.findIndex(m => m.email === member.email);
    
    if (existingIndex >= 0) {
      members[existingIndex] = member;
    } else {
      members.push(member);
    }
    
    fs.writeFileSync(DB_PATH, JSON.stringify(members, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving TapPass member:', error);
    return false;
  }
}

export function generateMemberID(): string {
  const members = getMembers();
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  const sequentialId = (members.length + 1).toString().padStart(4, '0');
  return `ONE52-${randomPart}-${sequentialId}`;
} 