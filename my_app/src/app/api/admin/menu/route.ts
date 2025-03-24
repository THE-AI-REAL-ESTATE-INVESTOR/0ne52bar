import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { menuItemSchema, categorySchema } from '@/lib/validations/menu';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [menuItems, categories] = await Promise.all([
      prisma.menuItem.findMany({
        include: {
          category: true,
        },
        orderBy: {
          category: {
            sortOrder: 'asc',
          },
        },
      }),
      prisma.category.findMany({
        orderBy: {
          sortOrder: 'asc',
        },
      }),
    ]);

    return NextResponse.json({ menuItems, categories });
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'menuItem') {
      const validatedData = menuItemSchema.parse(data);
      const menuItem = await prisma.menuItem.create({
        data: validatedData,
        include: {
          category: true,
        },
      });
      return NextResponse.json(menuItem);
    }

    if (type === 'category') {
      const validatedData = categorySchema.parse(data);
      const category = await prisma.category.create({
        data: validatedData,
      });
      return NextResponse.json(category);
    }

    return new NextResponse('Invalid request type', { status: 400 });
  } catch (error) {
    console.error('Error creating menu item or category:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'menuItem') {
      const validatedData = menuItemSchema.parse(data);
      const menuItem = await prisma.menuItem.update({
        where: { id },
        data: validatedData,
        include: {
          category: true,
        },
      });
      return NextResponse.json(menuItem);
    }

    if (type === 'category') {
      const validatedData = categorySchema.parse(data);
      const category = await prisma.category.update({
        where: { id },
        data: validatedData,
      });
      return NextResponse.json(category);
    }

    return new NextResponse('Invalid request type', { status: 400 });
  } catch (error) {
    console.error('Error updating menu item or category:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    if (type === 'menuItem') {
      await prisma.menuItem.delete({
        where: { id },
      });
      return new NextResponse(null, { status: 204 });
    }

    if (type === 'category') {
      await prisma.category.delete({
        where: { id },
      });
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse('Invalid request type', { status: 400 });
  } catch (error) {
    console.error('Error deleting menu item or category:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 