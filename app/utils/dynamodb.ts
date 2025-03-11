import { MenuItem, DynamoMenuItem } from '@/app/types/menu';

// Function to fetch all menu items from DynamoDB
export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }

    const response = await fetch(`${apiUrl}/api/menu`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
}

// Function to create a new menu item
export async function createMenuItem(menuItem: MenuItem): Promise<MenuItem> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }

    const response = await fetch(`${apiUrl}/api/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create menu item: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
}

// Function to update a menu item
export async function updateMenuItem(menuItem: MenuItem): Promise<MenuItem> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }

    const response = await fetch(`${apiUrl}/api/menu/${menuItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update menu item: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

// Function to delete a menu item
export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }

    const response = await fetch(`${apiUrl}/api/menu/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete menu item: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}
