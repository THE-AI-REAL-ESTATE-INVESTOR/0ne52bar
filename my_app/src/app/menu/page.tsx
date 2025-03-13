import React from 'react';
import Image from 'next/image';
import MenuOrderSystem from '@/components/MenuOrderSystem';
import OrderButton from '@/components/OrderButton';
import MenuStyles from '@/components/MenuStyles';

export default function MenuPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Our Menu</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* KICK STARTERS */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="h-0.5 w-6 bg-amber-500 mr-2"></div>
            <h2 className="text-2xl font-bold text-amber-500">KICK STARTERS</h2>
            <div className="h-0.5 w-6 bg-amber-500 ml-2"></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="font-medium">CHIPS & SALSA</p>
              <p className="font-mono">$6.00</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">CHIPS AND QUESO</p>
              <p className="font-mono">$7.50</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">CHIPS SALSA & QUESO</p>
              <p className="font-mono">$8.50</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">FRIED MUSHROOMS</p>
              <p className="font-mono">$6.00</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">FRIED GREEN BEANS</p>
              <p className="font-mono">$6.00</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">CHEESE STICKS</p>
              <p className="font-mono">$7.50</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">FRIED PICKLES</p>
              <p className="font-mono">$6.00</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">FRIED OKRA</p>
              <p className="font-mono">$6.00</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">HOT WINGS</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Buffalo, Teriyaki, Honey BBQ, Garlic Parmesan</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">BASKET OF FRIES/TOTS</p>
                <p className="font-mono">$4.00</p>
              </div>
              <p className="text-gray-400 text-sm">Add all your favorite toppings for an additional charge</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">ONION RING</p>
              <p className="font-mono">$4.00</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">Madatots</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Chili, Queso Cheese, Sour Cream, Tomatoes and Salsa</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">ONE - 52 SAMPLER - Pick 3</p>
                <p className="font-mono">$15.00</p>
              </div>
              <p className="text-gray-400 text-sm">Cheese Sticks, Mushrooms, Pickles, Okra, Green beans</p>
            </div>
          </div>
        </div>
        
        {/* MAIN DISHES */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="h-0.5 w-6 bg-amber-500 mr-2"></div>
            <h2 className="text-2xl font-bold text-amber-500">MAIN DISHES</h2>
            <div className="h-0.5 w-6 bg-amber-500 ml-2"></div>
          </div>
          
          <div className="space-y-6">
            {/* Quesadillas */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-blue-300">QUESADILLAS</h3>
              <div className="flex justify-between mb-1">
                <p className="font-medium">Half</p>
                <p className="font-mono">$6.50</p>
              </div>
              <div className="flex justify-between mb-1">
                <p className="font-medium">Full</p>
                <p className="font-mono">$10.00</p>
              </div>
              <p className="text-gray-400 text-sm">Your Choice of Steak or Chicken Stuffed with Cheese & Onions</p>
            </div>
            
            {/* Tacos */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-blue-300">TACOS</h3>
              <div>
                <div className="flex justify-between">
                  <p className="font-medium">CLASSIC</p>
                  <p className="font-mono">$3.50</p>
                </div>
                <p className="text-gray-400 text-sm">Lightly Fried Corn tortilla with Lettuce, Tomato, Cheese and Onions</p>
              </div>
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="font-medium">SOFT TACO</p>
                  <p className="font-mono">$3.50</p>
                </div>
                <p className="text-gray-400 text-sm">Flour Tortilla filled with Ground Beef, Lettuce, Tomato, Cheese</p>
              </div>
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="font-medium">STREET TACO</p>
                  <p className="font-mono">$4.00</p>
                </div>
                <p className="text-gray-400 text-sm">Warm Corn Tortilla, filled with Steak or Chicken, Onion & Cilantro</p>
              </div>
            </div>
            
            {/* Nachos */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-blue-300">NACHOS</h3>
              <div>
                <div className="flex justify-between">
                  <p className="font-medium">NACHOS</p>
                  <p className="font-mono">$8.00</p>
                </div>
                <p className="text-gray-400 text-sm">Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream, & Salsa</p>
                <p className="text-gray-400 text-sm italic">Upon Request, Steak or Chicken for additional $2.00</p>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="font-medium">Nachos Grande</p>
                  <p className="font-mono">$13.50</p>
                </div>
                <p className="text-gray-400 text-sm">Topped with Ground Beef, Cheese, Jalapeños, Diced Tomatoes, Served with Sour Cream, & Salsa</p>
                <p className="text-gray-400 text-sm italic">Upon Request, Steak or Chicken for additional $2.00</p>
              </div>
            </div>
            
            {/* Fajitas */}
            <div>
              <div className="flex justify-between">
                <p className="font-medium">FAJITAS</p>
                <p className="font-mono">$4.00</p>
              </div>
              <p className="text-gray-400 text-sm">Beef or Chicken, Green Peppers & Onions & cheese</p>
            </div>
          </div>
        </div>
        
        {/* SALADS & WRAPS */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="h-0.5 w-6 bg-amber-500 mr-2"></div>
            <h2 className="text-2xl font-bold text-amber-500">SALADS & WRAPS</h2>
            <div className="h-0.5 w-6 bg-amber-500 ml-2"></div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <p className="font-medium">CHICKEN WRAP</p>
                <p className="font-mono">$8.00</p>
              </div>
              <p className="text-gray-400 text-sm">Grilled or breaded chicken, lettuce, tomatoes, bacon, cheese and ranch wrapped up in a flour tortilla.</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">PILE UP SALAD</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Lettuce, tomatoes, cucumbers, cheese, bacon and your choice of fried or grilled chicken</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">HOUSE SALAD</p>
                <p className="font-mono">$4.50</p>
              </div>
            </div>
          </div>
          
          {/* EXTRAS */}
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <div className="h-0.5 w-6 bg-amber-500 mr-2"></div>
              <h2 className="text-2xl font-bold text-amber-500">EXTRAS</h2>
              <div className="h-0.5 w-6 bg-amber-500 ml-2"></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="font-medium">BOWL OF CHILI</p>
                <p className="font-mono">$4.50</p>
              </div>
              
              <div className="flex justify-between">
                <p className="font-medium">FRITO CHILI PIE</p>
                <p className="font-mono">$6.50</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* BURGERS & SANDWICHES */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="h-0.5 w-6 bg-amber-500 mr-2"></div>
            <h2 className="text-2xl font-bold text-amber-500">BURGERS & SANDWICHES</h2>
            <div className="h-0.5 w-6 bg-amber-500 ml-2"></div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <p className="font-medium">ONE-52 BURGER</p>
                <p className="font-mono">$8.00</p>
              </div>
              <p className="text-gray-400 text-sm">½ lb 100% Beef Patty Topped with Lettuce, Tomato, Onion and Pickle, choice of Fries, Tots or Onion Rings. Additional cost to sub other sides.</p>
              <p className="text-gray-400 text-sm">Bacon 1.00  Cheese .50 Chili 1.00 Grilled Onions .50</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">PHILLY STEAK</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Philly Steak Grilled Onions, Bell Peppers and Cheese</p>
              <p className="text-gray-400 text-sm">Add Jalapeño Peppers for an additional .50</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">CLUB SPECIAL</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Sliced Ham, Turkey & Bacon topped with Swiss & Cheddar Cheese, Lettuce & Tomato Served on Sough dough</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">PATTY MELT</p>
                <p className="font-mono">$8.00</p>
              </div>
              <p className="text-gray-400 text-sm">Topped with Cheese and Grilled Onions. Served on Sough Dough.</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">BLT</p>
                <p className="font-mono">$7.50</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">GRILLED CHEESE</p>
                <p className="font-mono">$7.00</p>
              </div>
              <p className="text-gray-400 text-sm">Texas toast with melted cheese</p>
              <p className="text-gray-400 text-sm">Add ham $1.50</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">YARD BIRD SANDWICH</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Grilled chicken with Lettuce, Tomato and Honey Mustard</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">CHICKEN STRIP SANDWICH</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Chicken Strips with swiss cheese on Texas Toast</p>
            </div>
            
            <div>
              <div className="flex justify-between">
                <p className="font-medium">CHICKEN STRIP BASKET</p>
                <p className="font-mono">$8.50</p>
              </div>
              <p className="text-gray-400 text-sm">Pick a Side (Tots, Fries, Onion Rings)</p>
            </div>
            
            <div className="flex justify-between">
              <p className="font-medium">HOT DOG</p>
              <p className="font-mono">$3.25</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CENTER IMAGE AND ORDER BUTTON MOVED TO BOTTOM */}
      <div className="flex flex-col items-center justify-center my-10">
        <div className="relative w-64 h-64 mb-6">
          <Image 
            src="/assets/food/tacos.jpg" 
            alt="Delicious Tacos" 
            fill
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
        
        <OrderButton />
      </div>
      
      <div className="mt-8 p-4 text-center text-gray-400 border-t border-gray-700">
        <p>DAILY SPECIALS ARE DINE-IN ONLY!!</p>
      </div>
      
      {/* Menu Order System Popup */}
      <MenuOrderSystem />
      
      {/* Include the styles as a component */}
      <MenuStyles />
    </div>
  );
}