import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      }
    });

    return NextResponse.json({
      categories,
      menuItems,
      message: 'Database query successful'
    });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({
      error: 'Failed to query database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 