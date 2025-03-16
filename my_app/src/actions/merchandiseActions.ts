"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

const merchandiseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  imagePath: z.string().optional(),
  inStock: z.boolean().default(false),
  comingSoon: z.boolean().default(true),
  sortOrder: z.number().int().default(100),
  categoryId: z.string().min(1, "Category is required"),
});

// Category actions
export async function getCategories() {
  try {
    const categories = await prisma.merchandiseCategory.findMany({
      orderBy: { name: 'asc' },
    });
    
    return {
      success: true,
      categories,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error getting merchandise categories:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    
    // Validate data
    const result = categorySchema.safeParse({ name, description });
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid category data",
      };
    }
    
    const category = await prisma.merchandiseCategory.create({
      data: {
        name,
        description,
      },
    });
    
    revalidatePath('/admin/merchandise');
    
    return {
      success: true,
      category,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error creating merchandise category:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    
    // Validate data
    const result = categorySchema.safeParse({ name, description });
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid category data",
      };
    }
    
    const category = await prisma.merchandiseCategory.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    
    revalidatePath('/admin/merchandise');
    
    return {
      success: true,
      category,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error updating merchandise category:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has items
    const itemCount = await prisma.merchandise.count({
      where: { categoryId: id },
    });
    
    if (itemCount > 0) {
      return {
        success: false,
        error: "Cannot delete category with merchandise items. Move or delete the items first.",
      };
    }
    
    await prisma.merchandiseCategory.delete({
      where: { id },
    });
    
    revalidatePath('/admin/merchandise');
    
    return {
      success: true,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error deleting merchandise category:", error);
    return {
      success: false,
      error: message,
    };
  }
}

// Merchandise actions
export async function getMerchandise(categoryId?: string) {
  try {
    const whereClause = categoryId ? { categoryId } : {};
    
    const items = await prisma.merchandise.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        category: true,
      },
    });
    
    return {
      success: true,
      items,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error getting merchandise items:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function getMerchandiseById(id: string) {
  try {
    const item = await prisma.merchandise.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    
    if (!item) {
      return {
        success: false,
        error: "Merchandise item not found",
      };
    }
    
    return {
      success: true,
      item,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error getting merchandise item:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function createMerchandise(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      imagePath: formData.get('imagePath') as string || null,
      inStock: formData.get('inStock') === 'true',
      comingSoon: formData.get('comingSoon') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string || '100'),
      categoryId: formData.get('categoryId') as string,
    };
    
    // Validate data
    const result = merchandiseSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid merchandise data",
      };
    }
    
    const item = await prisma.merchandise.create({
      data,
    });
    
    revalidatePath('/admin/merchandise');
    revalidatePath('/merch');
    
    return {
      success: true,
      item,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error creating merchandise item:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateMerchandise(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      imagePath: formData.get('imagePath') as string || null,
      inStock: formData.get('inStock') === 'true',
      comingSoon: formData.get('comingSoon') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string || '100'),
      categoryId: formData.get('categoryId') as string,
    };
    
    // Validate data
    const result = merchandiseSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid merchandise data",
      };
    }
    
    const item = await prisma.merchandise.update({
      where: { id },
      data,
    });
    
    revalidatePath('/admin/merchandise');
    revalidatePath('/merch');
    
    return {
      success: true,
      item,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error updating merchandise item:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteMerchandise(id: string) {
  try {
    await prisma.merchandise.delete({
      where: { id },
    });
    
    revalidatePath('/admin/merchandise');
    revalidatePath('/merch');
    
    return {
      success: true,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error deleting merchandise item:", error);
    return {
      success: false,
      error: message,
    };
  }
}

// Bulk operations
export async function updateMerchandiseStatus(
  ids: string[], 
  inStock: boolean, 
  comingSoon: boolean
) {
  try {
    const results = await Promise.all(
      ids.map((id) =>
        prisma.merchandise.update({
          where: { id },
          data: { inStock, comingSoon },
        })
      )
    );
    
    revalidatePath('/admin/merchandise');
    revalidatePath('/merch');
    
    return {
      success: true,
      count: results.length,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error updating merchandise status:", error);
    return {
      success: false,
      error: message,
    };
  }
} 