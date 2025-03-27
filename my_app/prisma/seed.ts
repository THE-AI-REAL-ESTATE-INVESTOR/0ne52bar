import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding menu data...');

  // Clear existing menu data only
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating menu categories...');

  // First, create categories
  const categories = [
    { name: 'KICK STARTERS', sortOrder: 100 },
    { name: 'EXTRAS', sortOrder: 200 },
    { name: 'MAIN DISHES', sortOrder: 300 },
    { name: 'SALADS & WRAPS', sortOrder: 400 },
    { name: 'BURGERS & SANDWICHES', sortOrder: 500 }
  ];

  // Create categories first
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        sortOrder: category.sortOrder
      }
    });
  }

  // Get created categories
  const categoryMap = new Map();
  const createdCategories = await prisma.category.findMany();
  createdCategories.forEach(cat => categoryMap.set(cat.name, cat.id));

  console.log('Creating menu items...');

  // Menu items data with prices as strings
  const menuItems = [
    { name: "CHIPS & SALSA", price: "6.00", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "CHIPS AND QUESO", price: "7.50", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "CHIPS SALSA & QUESO", price: "8.50", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "FRIED MUSHROOMS", price: "6.00", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "FRIED GREEN BEANS", price: "6.00", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "CHEESE STICKS", price: "7.50", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "FRIED PICKLES", price: "6.00", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "FRIED OKRA", price: "6.00", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "HOT WINGS", price: "8.50", category: "KICK STARTERS", description: "Buffalo, Teriyaki, Honey BBQ, Garlic Parmesan", status: "AVAILABLE" },
    { name: "BASKET OF FRIES/TOTS", price: "4.00", category: "KICK STARTERS", description: "Add all your favorite toppings for an additional charge", status: "AVAILABLE" },
    { name: "ONION RING", price: "4.00", category: "KICK STARTERS", description: "No description", status: "AVAILABLE" },
    { name: "Madatots", price: "8.50", category: "KICK STARTERS", description: "Chili, Queso Cheese, Sour Cream, Tomatoes and Salsa", status: "AVAILABLE" },
    { name: "ONE - 52 SAMPLER - Pick 3", price: "15.00", category: "KICK STARTERS", description: "Cheese Sticks, Mushrooms, Pickles, Okra, Green Beans", status: "AVAILABLE" },
    { name: "BOWL OF CHILI", price: "4.50", category: "EXTRAS", description: "No description", status: "AVAILABLE" },
    { name: "FRITO CHILI PIE", price: "6.50", category: "EXTRAS", description: "No description", status: "AVAILABLE" },
    { name: "QUESADILLAS - Half", price: "6.50", category: "MAIN DISHES", description: "Your Choice of Steak or Chicken Stuffed with Cheese & Onions", status: "AVAILABLE" },
    { name: "QUESADILLAS - Full", price: "10.00", category: "MAIN DISHES", description: "Your Choice of Steak or Chicken Stuffed with Cheese & Onions", status: "AVAILABLE" },
    { name: "TACOS - CLASSIC", price: "0.00", category: "MAIN DISHES", description: "Lightly Fried Corn Tortilla with Lettuce, Tomato, Cheese and Onions [ADMIN NOTE: NEEDS PRICE ADDED]", status: "NEEDS_PRICING" },
    { name: "TACOS - SOFT", price: "0.00", category: "MAIN DISHES", description: "Flour Tortilla filled with Ground Beef, Lettuce, Tomato, Cheese [ADMIN NOTE: NEEDS PRICE ADDED]", status: "NEEDS_PRICING" },
    { name: "TACOS - STREET", price: "0.00", category: "MAIN DISHES", description: "Warm Corn Tortilla, filled with Steak or Chicken, Onion & Cilantro [ADMIN NOTE: NEEDS PRICE ADDED]", status: "NEEDS_PRICING" },
    { name: "NACHOS", price: "8.00", category: "MAIN DISHES", description: "Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream & Salsa", status: "AVAILABLE" },
    { name: "Nachos Grande", price: "13.50", category: "MAIN DISHES", description: "Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream & Salsa (Steak or Chicken upon request for an additional $2.00)", status: "AVAILABLE" },
    { name: "FAJITAS", price: "10.00", category: "MAIN DISHES", description: "Beef or Chicken, Green Peppers & Onions & Cheese", status: "AVAILABLE" },
    { name: "CHICKEN WRAP", price: "8.00", category: "SALADS & WRAPS", description: "Grilled or breaded chicken, lettuce, tomatoes, bacon, cheese and ranch wrapped up in a flour tortilla.", status: "AVAILABLE" },
    { name: "PILE UP SALAD", price: "8.50", category: "SALADS & WRAPS", description: "Lettuce, tomatoes, cucumbers, cheese, bacon and your choice of fried or grilled chicken.", status: "AVAILABLE" },
    { name: "HOUSE SALAD", price: "4.50", category: "SALADS & WRAPS", description: "No description", status: "AVAILABLE" },
    { name: "ONE-52 BURGER", price: "8.00", category: "BURGERS & SANDWICHES", description: "½ lb 100% Beef Patty Topped with Lettuce, Tomato, Onion and Pickle", status: "AVAILABLE" },
    { name: "PHILLY STEAK", price: "8.50", category: "BURGERS & SANDWICHES", description: "Philly Steak Grilled Onions, Bell Peppers and Cheese", status: "AVAILABLE" },
    { name: "CLUB SPECIAL", price: "8.50", category: "BURGERS & SANDWICHES", description: "Sliced Ham, Turkey & Bacon topped with Swiss & Cheddar Cheese, Lettuce & Tomato Served on Sough Dough", status: "AVAILABLE" },
    { name: "PATTY MELT", price: "8.00", category: "BURGERS & SANDWICHES", description: "Topped with Cheese and Grilled Onions. Served on Sough Dough.", status: "AVAILABLE" },
    { name: "BLT", price: "7.50", category: "BURGERS & SANDWICHES", description: "No description", status: "AVAILABLE" },
    { name: "GRILLED CHEESE", price: "7.00", category: "BURGERS & SANDWICHES", description: "Texas toast with melted cheese", status: "AVAILABLE" },
    { name: "YARD BIRD SANDWICH", price: "8.50", category: "BURGERS & SANDWICHES", description: "Grilled chicken with Lettuce, Tomato and Honey Mustard", status: "AVAILABLE" },
    { name: "CHICKEN STRIP SANDWICH", price: "8.50", category: "BURGERS & SANDWICHES", description: "Chicken Strips with swiss cheese on Texas Toast", status: "AVAILABLE" },
    { name: "CHICKEN STRIP BASKET", price: "8.50", category: "BURGERS & SANDWICHES", description: "Pick a Side (Tots, Fries, Onion Rings)", status: "AVAILABLE" },
    { name: "HOT DOG", price: "3.25", category: "BURGERS & SANDWICHES", description: "No description", status: "AVAILABLE" }
  ];

  // Create menu items
  for (const item of menuItems) {
    const categoryId = categoryMap.get(item.category);
    if (!categoryId) {
      console.warn(`Category not found for item: ${item.name}`);
      continue;
    }

    // First try to find existing item
    const existingItem = await prisma.menuItem.findFirst({
      where: { name: item.name }
    });

    if (existingItem) {
      // Update existing item
      await prisma.menuItem.update({
        where: { id: existingItem.id },
        data: {
          price: item.price,
          description: item.description,
          categoryId: categoryId,
          isActive: true,
          sortOrder: 100,
          status: item.status
        } as { 
          price: string;
          description: string | null;
          categoryId: string;
          isActive: boolean;
          sortOrder: number;
          status: 'AVAILABLE' | 'NEEDS_PRICING' | 'COMING_SOON' | 'ARCHIVED';
        }
      });
    } else {
      // Create new item
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          categoryId: categoryId,
          isActive: true,
          sortOrder: 100,
          status: item.status
        } as {
          name: string;
          price: string;
          description: string | null;
          categoryId: string;
          isActive: boolean;
          sortOrder: number;
          status: 'AVAILABLE' | 'NEEDS_PRICING' | 'COMING_SOON' | 'ARCHIVED';
        }
      });
    }
  }

  console.log('Menu data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 