/**
 * Menu Actions
 * Server actions for menu functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all menu items
 */
export async function getMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });
    
    return {
      success: true,
      menuItems
    };
  } catch (error) {
    console.error('Error getting menu items:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(category) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
    
    return {
      success: true,
      menuItems
    };
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all categories
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    return {
      success: true,
      categories
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Add a menu item
 */
export async function addMenuItem(name, price, category, description) {
  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        category,
        description
      }
    });
    
    return {
      success: true,
      menuItem
    };
  } catch (error) {
    console.error('Error adding menu item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(id, data) {
  try {
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data
    });
    
    return {
      success: true,
      menuItem
    };
  } catch (error) {
    console.error('Error updating menu item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id) {
  try {
    await prisma.menuItem.delete({
      where: { id }
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
