"use client";

import React, { createContext, useContext, useState } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  calories: string;
  description: string;
  category: string;
}

interface MenuContextType {
  menuItems: MenuItem[];
  categories: string[];
  filterMenuItems: (category: string, searchTerm: string) => MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // Appetizers
    { id: "1", name: "Crispy Calamari", price: "$9.99", calories: "450", description: "Tender calamari rings lightly breaded and fried", category: "Appetizers" },
    { id: "2", name: "Bruschetta", price: "$7.99", calories: "280", description: "Toasted bread with fresh tomatoes and basil", category: "Appetizers" },
    { id: "3", name: "Spinach Artichoke Dip", price: "$10.99", calories: "520", description: "Creamy dip with spinach and artichokes", category: "Appetizers" },
    { id: "4", name: "Buffalo Wings", price: "$12.99", calories: "850", description: "Crispy wings with spicy buffalo sauce", category: "Appetizers" },
    { id: "5", name: "Mozzarella Sticks", price: "$8.99", calories: "460", description: "Breaded mozzarella with marinara sauce", category: "Appetizers" },
    { id: "6", name: "Loaded Nachos", price: "$11.99", calories: "920", description: "Tortilla chips with cheese, jalapeños, and all the fixings", category: "Appetizers" },
    { id: "7", name: "Shrimp Cocktail", price: "$13.99", calories: "280", description: "Chilled jumbo shrimp with cocktail sauce", category: "Appetizers" },
    { id: "8", name: "Garlic Bread", price: "$5.99", calories: "320", description: "Toasted bread with garlic butter and herbs", category: "Appetizers" },
    { id: "9", name: "Stuffed Mushrooms", price: "$9.99", calories: "380", description: "Mushroom caps filled with herbs and cheese", category: "Appetizers" },
    { id: "10", name: "Spring Rolls", price: "$8.99", calories: "340", description: "Crispy rolls with vegetables and dipping sauce", category: "Appetizers" },
    { id: "11", name: "Onion Rings", price: "$7.99", calories: "420", description: "Beer-battered onion rings with ranch", category: "Appetizers" },
    { id: "12", name: "Hummus Plate", price: "$8.99", calories: "380", description: "Creamy hummus with pita and vegetables", category: "Appetizers" },
    // Main Course
    { id: "13", name: "Cheeseburger Deluxe", price: "$12.99", calories: "950", description: "1/3 lb beef patty with cheese and fixings", category: "Main Course" },
    { id: "14", name: "Grilled Salmon", price: "$24.99", calories: "580", description: "Fresh salmon with seasonal vegetables", category: "Main Course" },
    { id: "15", name: "Chicken Alfredo", price: "$18.99", calories: "1100", description: "Fettuccine in creamy alfredo sauce", category: "Main Course" },
    { id: "16", name: "Ribeye Steak", price: "$29.99", calories: "890", description: "12oz ribeye cooked to your preference", category: "Main Course" },
    { id: "17", name: "Vegetable Stir Fry", price: "$15.99", calories: "420", description: "Fresh vegetables in savory sauce", category: "Main Course" },
    { id: "18", name: "BBQ Ribs", price: "$26.99", calories: "980", description: "Full rack of tender baby back ribs", category: "Main Course" },
    { id: "19", name: "Fish & Chips", price: "$16.99", calories: "850", description: "Beer-battered cod with crispy fries", category: "Main Course" },
    { id: "20", name: "Shrimp Scampi", price: "$22.99", calories: "720", description: "Garlic shrimp over linguine pasta", category: "Main Course" },
    { id: "21", name: "Chicken Marsala", price: "$19.99", calories: "680", description: "Chicken breast in mushroom wine sauce", category: "Main Course" },
    { id: "22", name: "Eggplant Parmesan", price: "$16.99", calories: "590", description: "Breaded eggplant with marinara and cheese", category: "Main Course" },
    { id: "23", name: "Beef Stir Fry", price: "$18.99", calories: "650", description: "Tender beef strips with Asian vegetables", category: "Main Course" },
    { id: "24", name: "Lobster Mac & Cheese", price: "$24.99", calories: "980", description: "Creamy mac & cheese with lobster meat", category: "Main Course" },
    { id: "25", name: "Pork Chop", price: "$21.99", calories: "720", description: "Grilled pork chop with apple chutney", category: "Main Course" },
    { id: "26", name: "Seafood Paella", price: "$27.99", calories: "890", description: "Spanish rice with mixed seafood", category: "Main Course" },
    { id: "27", name: "Vegan Buddha Bowl", price: "$15.99", calories: "520", description: "Quinoa bowl with roasted vegetables", category: "Main Course" },
    // Desserts
    { id: "28", name: "Chocolate Lava Cake", price: "$7.99", calories: "650", description: "Warm cake with molten chocolate center", category: "Desserts" },
    { id: "29", name: "New York Cheesecake", price: "$8.99", calories: "730", description: "Classic creamy cheesecake", category: "Desserts" },
    { id: "30", name: "Apple Pie", price: "$6.99", calories: "450", description: "Homemade pie with vanilla ice cream", category: "Desserts" },
    { id: "31", name: "Tiramisu", price: "$8.99", calories: "420", description: "Italian coffee-flavored dessert", category: "Desserts" },
    { id: "32", name: "Ice Cream Sundae", price: "$6.99", calories: "550", description: "Three scoops with toppings", category: "Desserts" },
    { id: "33", name: "Crème Brûlée", price: "$8.99", calories: "520", description: "Classic French custard with caramelized sugar", category: "Desserts" },
    { id: "34", name: "Key Lime Pie", price: "$7.99", calories: "380", description: "Tangy lime pie with whipped cream", category: "Desserts" },
    { id: "35", name: "Bread Pudding", price: "$6.99", calories: "480", description: "Warm pudding with bourbon sauce", category: "Desserts" },
    { id: "36", name: "Fruit Tart", price: "$7.99", calories: "340", description: "Pastry cream with fresh seasonal fruits", category: "Desserts" },
    { id: "37", name: "Chocolate Mousse", price: "$6.99", calories: "380", description: "Light and airy chocolate dessert", category: "Desserts" },
    // Beverages
    { id: "38", name: "Craft Mojito", price: "$8.99", calories: "180", description: "Fresh mint and lime cocktail", category: "Beverages" },
    { id: "39", name: "Iced Tea", price: "$3.99", calories: "0", description: "Fresh brewed unsweetened tea", category: "Beverages" },
    { id: "40", name: "Lemonade", price: "$3.99", calories: "120", description: "Fresh squeezed lemonade", category: "Beverages" },
    { id: "41", name: "Smoothie", price: "$5.99", calories: "240", description: "Blend of fresh fruits", category: "Beverages" },
    { id: "42", name: "Coffee", price: "$2.99", calories: "0", description: "Premium roast coffee", category: "Beverages" },
    { id: "43", name: "Margarita", price: "$9.99", calories: "220", description: "Classic tequila cocktail", category: "Beverages" },
    { id: "44", name: "Old Fashioned", price: "$10.99", calories: "180", description: "Whiskey cocktail with bitters", category: "Beverages" },
    { id: "45", name: "Espresso Martini", price: "$11.99", calories: "190", description: "Coffee-flavored cocktail", category: "Beverages" },
    { id: "46", name: "Virgin Piña Colada", price: "$6.99", calories: "180", description: "Non-alcoholic tropical drink", category: "Beverages" },
    { id: "47", name: "Craft Beer", price: "$6.99", calories: "150", description: "Rotating selection of local beers", category: "Beverages" },
    { id: "48", name: "Red Wine", price: "$8.99", calories: "125", description: "House red wine by the glass", category: "Beverages" },
    { id: "49", name: "White Wine", price: "$8.99", calories: "120", description: "House white wine by the glass", category: "Beverages" },
    { id: "50", name: "Sparkling Water", price: "$3.99", calories: "0", description: "Premium sparkling mineral water", category: "Beverages" }
  ]);

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  const filterMenuItems = (category: string, searchTerm: string) => {
    return menuItems.filter(item => 
      (category === 'All' || item.category === category) &&
      (searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems, categories, filterMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
