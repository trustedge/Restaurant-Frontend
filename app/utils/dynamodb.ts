import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Order, DynamoOrder } from "@/app/types/orders";
import { MenuItem } from "@/app/types/menu";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const createDynamoDBClient = () => {
  // Only use credentials in local development mode
  const clientConfig = process.env.NEXT_PUBLIC_DEV_MODE === 'true' 
    ? {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      }
    : { region: process.env.AWS_REGION };

  return new DynamoDBClient(clientConfig);
};

export const client = createDynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// Mock data for development mode
const mockOrders = [
  {
    OrderNumber: { S: "e0d0742c-579f" },
    timestamp: { S: "1729121765" },
    Customer: { M: { Name: { S: "Sam Wilson" }, PhoneNumber: { S: "123-456-7890" } } },
    Items: { L: [
      { M: { Name: { S: "Fried Chicken Platter" }, Notes: { S: "no cornbread" }, Quantity: { N: 1 } } },
      { M: { Name: { S: "Coffee" }, Notes: { S: "decaf" }, Quantity: { N: 1 } } }
    ]},
    Notes: { S: "Allergic to nuts" },
    OrderDateTime: { S: "2024-10-16T23:36:05.714Z" },
    OrderStatus: { S: "Preparing" },
    UpdateDateTime: { S: "2024-10-16T23:36:05.714Z" }
  },
  {
    OrderNumber: { S: "f1e8742d-680g" },
    timestamp: { S: "1729121766" },
    Customer: { M: { Name: { S: "Emily Chen" }, PhoneNumber: { S: "123-555-0123" } } },
    Items: { L: [
      { M: { Name: { S: "Caesar Salad" }, Notes: { S: "dressing on side" }, Quantity: { N: 1 } } },
      { M: { Name: { S: "Grilled Salmon" }, Notes: { S: "well done" }, Quantity: { N: 1 } } },
      { M: { Name: { S: "Sparkling Water" }, Notes: { S: "" }, Quantity: { N: 1 } } }
    ]},
    Notes: { S: "Priority order" },
    OrderDateTime: { S: "2024-10-16T23:40:05.714Z" },
    OrderStatus: { S: "Placed" },
    UpdateDateTime: { S: "2024-10-16T23:40:05.714Z" }
  },
  {
    OrderNumber: { S: "g2f9853e-791h" },
    timestamp: { S: "1729121767" },
    Customer: { M: { Name: { S: "Michael Brown" }, PhoneNumber: { S: "123-777-8888" } } },
    Items: { L: [
      { M: { Name: { S: "Burger Deluxe" }, Notes: { S: "medium rare" }, Quantity: { N: 1 } } },
      { M: { Name: { S: "Sweet Potato Fries" }, Notes: { S: "extra crispy" }, Quantity: { N: 1 } } },
      { M: { Name: { S: "Chocolate Shake" }, Notes: { S: "" }, Quantity: { N: 1 } } },
      { M: { Name: { S: "Apple Pie" }, Notes: { S: "warmed" }, Quantity: { N: 1 } } }
    ]},
    Notes: { S: "Birthday celebration" },
    OrderDateTime: { S: "2024-10-16T23:42:05.714Z" },
    OrderStatus: { S: "Ready" },
    UpdateDateTime: { S: "2024-10-16T23:42:05.714Z" }
  }
];

// Mock menu data for development mode
const mockMenuItems: MenuItem[] = [
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
  // Main Course and other items remain the same...
];

export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  // Check if we're in development mode
  // if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    return mockMenuItems;
  // }

  // Production mode: fetch from DynamoDB
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_MENU_TABLE_NAME,
    });

    const response = await docClient.send(command);
    // Transform DynamoDB items to match MenuItem interface
    const menuItems = (response.Items || []).map(item => ({
      id: item.id || '',
      name: item.name || '',
      price: item.price || '',
      calories: item.calories || '',
      description: item.description || '',
      category: item.category || ''
    }));

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items from DynamoDB:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  // Check if we're in development mode
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    return mockOrders;
  }

  // Production mode: fetch from DynamoDB
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_ORDER_TABLE_NAME,
    });

    const response = await docClient.send(command);
    // Transform DynamoDB items to match Order interface
    const orders = (response.Items || []).map((item: Record<string, any>) => ({
      OrderNumber: { S: item.OrderNumber || '' },
      Customer: {
        M: {
          Name: { S: (item.Customer?.Name as string) || '' },
          PhoneNumber: { S: (item.Customer?.PhoneNumber as string) || '' }
        }
      },
      Items: {
        L: (item.Items || []).map((orderItem: any) => ({
          M: {
            Name: { S: orderItem.Name || '' },
            Notes: { S: orderItem.Notes || '' },
            Quantity: { N: parseInt(orderItem.Quantity) || 1 }
          }
        }))
      },
      Notes: { S: item.Notes || '' },
      OrderDateTime: { S: item.OrderDateTime || new Date().toISOString() },
      OrderStatus: { S: item.OrderStatus || 'Placed' },
      UpdateDateTime: { S: item.UpdateDateTime || new Date().toISOString() }
    }));

    return orders;
  } catch (error) {
    console.error('Error fetching orders from DynamoDB:', error);
    throw error;
  }
};
