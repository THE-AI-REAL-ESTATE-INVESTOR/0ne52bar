const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedMerchandise() {
  console.log('Starting merchandise seeding...');

  try {
    // Create merchandise categories
    console.log('Creating merchandise categories...');
    const categories = [
      {
        name: 'Apparel',
        description: 'T-shirts, hoodies, and other clothing items',
      },
      {
        name: 'Drinkware',
        description: 'Glasses, mugs, and other drink containers',
      },
      {
        name: 'Accessories',
        description: 'Hats, stickers, and other accessories',
      },
    ];

    const createdCategories = {};
    
    for (const category of categories) {
      const existingCategory = await prisma.merchandiseCategory.findFirst({
        where: { name: category.name },
      });
      
      if (existingCategory) {
        console.log(`Category "${category.name}" already exists, skipping...`);
        createdCategories[category.name] = existingCategory;
      } else {
        const newCategory = await prisma.merchandiseCategory.create({ data: category });
        console.log(`Created category: ${newCategory.name}`);
        createdCategories[category.name] = newCategory;
      }
    }

    // Create merchandise items
    console.log('Creating merchandise items...');
    const items = [
      {
        name: 'ONE-52 Classic Logo Tee',
        description: 'Black t-shirt with the classic ONE-52 license plate logo on the front.',
        price: '$24.99',
        imagePath: '/images/merch/tshirt-placeholder.jpg',
        inStock: false,
        comingSoon: true,
        sortOrder: 10,
        categoryId: createdCategories['Apparel'].id,
      },
      {
        name: 'ONE-52 Premium Hoodie',
        description: 'Comfortable black hoodie with the ONE-52 logo embroidered on the chest.',
        price: '$49.99',
        imagePath: '/images/merch/hoodie-placeholder.jpg',
        inStock: false,
        comingSoon: true,
        sortOrder: 20,
        categoryId: createdCategories['Apparel'].id,
      },
      {
        name: 'ONE-52 Coffee Mug',
        description: 'Start your morning right with our ceramic coffee mug featuring the ONE-52 logo.',
        price: '$14.99',
        imagePath: '/images/merch/mug-placeholder.jpg',
        inStock: false,
        comingSoon: true,
        sortOrder: 10,
        categoryId: createdCategories['Drinkware'].id,
      },
      {
        name: 'ONE-52 Pint Glass',
        description: 'A 16oz pint glass with the ONE-52 logo - perfect for your favorite beer.',
        price: '$12.99',
        imagePath: '/images/merch/pint-placeholder.jpg',
        inStock: false,
        comingSoon: true,
        sortOrder: 20,
        categoryId: createdCategories['Drinkware'].id,
      },
      {
        name: 'ONE-52 Snapback Cap',
        description: 'Adjustable snapback cap with embroidered ONE-52 logo.',
        price: '$22.99',
        imagePath: '/images/merch/hat-placeholder.jpg',
        inStock: false,
        comingSoon: true,
        sortOrder: 10,
        categoryId: createdCategories['Accessories'].id,
      },
      {
        name: 'ONE-52 Sticker Pack',
        description: 'Set of 5 waterproof vinyl stickers featuring ONE-52 designs.',
        price: '$8.99',
        imagePath: '/images/merch/sticker-placeholder.jpg',
        inStock: false,
        comingSoon: true,
        sortOrder: 20,
        categoryId: createdCategories['Accessories'].id,
      },
    ];

    for (const item of items) {
      const existingItem = await prisma.merchandise.findFirst({
        where: { 
          name: item.name,
          categoryId: item.categoryId,
        },
      });
      
      if (existingItem) {
        console.log(`Item "${item.name}" already exists, skipping...`);
      } else {
        const newItem = await prisma.merchandise.create({ data: item });
        console.log(`Created item: ${newItem.name}`);
      }
    }

    console.log('Merchandise seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding merchandise data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedMerchandise(); 