import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json();
        
        const menuItem = await prisma.menuItem.update({
            where: { id: params.id },
            data: {
            name: data.name,
            description: data.description,
            price: data.price,
            isActive: data.isActive,
            sortOrder: data.sortOrder,
            categoryId: data.categoryId
            }
        });
  
        return NextResponse.json(menuItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json(
            { error: 'Failed to update menu item' },
            { status: 500 }
        );
    }
}
  
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;
      
      await prisma.menuItem.delete({
        where: { id }
      });
  
      return NextResponse.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return NextResponse.json(
        { error: 'Failed to delete menu item' },
        { status: 500 }
      );
    }
  }
  