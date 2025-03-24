import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding menu data...');

  // Clear existing menu data only
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating menu categories...');

  // Create categories
  const categories = [
    { name: 'KICK STARTERS', sortOrder: 1 },
    { name: 'EXTRAS', sortOrder: 2 },
    { name: 'MAIN DISHES', sortOrder: 3 },
    { name: 'SALADS & WRAPS', sortOrder: 4 },
    { name: 'BURGERS & SANDWICHES', sortOrder: 5 },
  ];

  const createdCategories = await Promise.all(
    categories.map(category => 
      prisma.category.create({
        data: category
      })
    )
  );

  console.log('Creating menu items...');

  // Menu items data
  const menuItems = [
    // KICK STARTERS
    { name: 'CHIPS & SALSA', price: '$6.00', category: 'KICK STARTERS', description: 'No description' },
    { name: 'CHIPS AND QUESO', price: '$7.50', category: 'KICK STARTERS', description: 'No description' },
    { name: 'CHIPS SALSA & QUESO', price: '$8.50', category: 'KICK STARTERS', description: 'No description' },
    { name: 'FRIED MUSHROOMS', price: '$6.00', category: 'KICK STARTERS', description: 'No description' },
    { name: 'FRIED GREEN BEANS', price: '$6.00', category: 'KICK STARTERS', description: 'No description' },
    { name: 'CHEESE STICKS', price: '$7.50', category: 'KICK STARTERS', description: 'No description' },
    { name: 'FRIED PICKLES', price: '$6.00', category: 'KICK STARTERS', description: 'No description' },
    { name: 'FRIED OKRA', price: '$6.00', category: 'KICK STARTERS', description: 'No description' },
    { name: 'HOT WINGS', price: '$8.50', category: 'KICK STARTERS', description: 'Buffalo, Teriyaki, Honey BBQ, Garlic Parmesan' },
    { name: 'BASKET OF FRIES/TOTS', price: '$4.00', category: 'KICK STARTERS', description: 'Add all your favorite toppings for an additional charge' },
    { name: 'ONION RING', price: '$4.00', category: 'KICK STARTERS', description: 'No description' },
    { name: 'Madatots', price: '$8.50', category: 'KICK STARTERS', description: 'Chili, Queso Cheese, Sour Cream, Tomatoes and Salsa' },
    { name: 'ONE - 52 SAMPLER - Pick 3', price: '$15.00', category: 'KICK STARTERS', description: 'Cheese Sticks, Mushrooms, Pickles, Okra, Green Beans' },
    
    // EXTRAS
    { name: 'BOWL OF CHILI', price: '$4.50', category: 'EXTRAS', description: 'No description' },
    { name: 'FRITO CHILI PIE', price: '$6.50', category: 'EXTRAS', description: 'No description' },
    
    // MAIN DISHES
    { name: 'QUESADILLAS - Half', price: '$6.50', category: 'MAIN DISHES', description: 'Your Choice of Steak or Chicken Stuffed with Cheese & Onions' },
    { name: 'QUESADILLAS - Full', price: '$10.00', category: 'MAIN DISHES', description: 'Your Choice of Steak or Chicken Stuffed with Cheese & Onions' },
    { name: 'TACOS - CLASSIC', price: 'No price listed', category: 'MAIN DISHES', description: 'Lightly Fried Corn Tortilla with Lettuce, Tomato, Cheese and Onions' },
    { name: 'TACOS - SOFT', price: 'No price listed', category: 'MAIN DISHES', description: 'Flour Tortilla filled with Ground Beef, Lettuce, Tomato, Cheese' },
    { name: 'TACOS - STREET', price: 'No price listed', category: 'MAIN DISHES', description: 'Warm Corn Tortilla, filled with Steak or Chicken, Onion & Cilantro' },
    { name: 'NACHOS', price: '$8.00', category: 'MAIN DISHES', description: 'Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream & Salsa' },
    { name: 'Nachos Grande', price: '$13.50', category: 'MAIN DISHES', description: 'Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream & Salsa (Steak or Chicken upon request for an additional $2.00)' },
    { name: 'FAJITAS', price: '$10.00', category: 'MAIN DISHES', description: 'Beef or Chicken, Green Peppers & Onions & Cheese' },
    
    // SALADS & WRAPS
    { name: 'CHICKEN WRAP', price: '$8.00', category: 'SALADS & WRAPS', description: 'Grilled or breaded chicken, lettuce, tomatoes, bacon, cheese and ranch wrapped up in a flour tortilla.' },
    { name: 'PILE UP SALAD', price: '$8.50', category: 'SALADS & WRAPS', description: 'Lettuce, tomatoes, cucumbers, cheese, bacon and your choice of fried or grilled chicken.' },
    { name: 'HOUSE SALAD', price: '$4.50', category: 'SALADS & WRAPS', description: 'No description' },
    
    // BURGERS & SANDWICHES
    { name: 'ONE-52 BURGER', price: '$8.00', category: 'BURGERS & SANDWICHES', description: '½ lb 100% Beef Patty Topped with Lettuce, Tomato, Onion and Pickle' },
    { name: 'PHILLY STEAK', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Philly Steak Grilled Onions, Bell Peppers and Cheese' },
    { name: 'CLUB SPECIAL', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Sliced Ham, Turkey & Bacon topped with Swiss & Cheddar Cheese, Lettuce & Tomato Served on Sough Dough' },
    { name: 'PATTY MELT', price: '$8.00', category: 'BURGERS & SANDWICHES', description: 'Topped with Cheese and Grilled Onions. Served on Sough Dough.' },
    { name: 'BLT', price: '$7.50', category: 'BURGERS & SANDWICHES', description: 'No description' },
    { name: 'GRILLED CHEESE', price: '$7.00', category: 'BURGERS & SANDWICHES', description: 'Texas toast with melted cheese' },
    { name: 'YARD BIRD SANDWICH', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Grilled chicken with Lettuce, Tomato and Honey Mustard' },
    { name: 'CHICKEN STRIP SANDWICH', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Chicken Strips with swiss cheese on Texas Toast' },
    { name: 'CHICKEN STRIP BASKET', price: '$8.50', category: 'BURGERS & SANDWICHES', description: 'Pick a Side (Tots, Fries, Onion Rings)' },
    { name: 'HOT DOG', price: '$3.25', category: 'BURGERS & SANDWICHES', description: 'No description' },
  ];

  // Create menu items with their categories
  for (const item of menuItems) {
    const category = createdCategories.find(c => c.name === item.category);
    if (category) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          categoryId: category.id,
          isActive: true,
          sortOrder: 100 // Default sort order
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