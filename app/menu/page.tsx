"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '../contexts/admin-context';
import { useMenu } from '../contexts/menu-context';
import type { MenuItem } from '../contexts/menu-context';

export default function MenuPage() {
  const { isAdmin } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { menuItems, setMenuItems } = useMenu();

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const [newItem, setNewItem] = useState<MenuItem>({
    id: generateId(),
    name: "",
    price: "",
    calories: "",
    description: "",
    category: "Main Course"
  });

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  const handleDeleteItem = (itemToDelete: MenuItem) => {
    setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu</h1>
        {isAdmin && (
          <Button onClick={() => setIsAddItemDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems
          .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
          .map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.calories} Calories</CardDescription>
                  </div>
                  <div className="text-lg font-bold">{item.price}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  {isAdmin ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">Add to Order</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Dialog open={isAddItemDialogOpen || selectedItem !== null} onOpenChange={(open) => {
        if (!open) {
          setIsAddItemDialogOpen(false);
          setSelectedItem(null);
          setNewItem({
            id: generateId(),
            name: "",
            price: "",
            calories: "",
            description: "",
            category: "Main Course"
          });
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Edit the details of the menu item below.' : 'Fill in the details of the new menu item below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input 
                className="mt-1" 
                value={selectedItem?.name || newItem.name}
                onChange={(e) => selectedItem 
                  ? setSelectedItem({...selectedItem, name: e.target.value})
                  : setNewItem({...newItem, name: e.target.value})
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input 
                className="mt-1" 
                type="text" 
                placeholder="$0.00"
                value={selectedItem?.price || newItem.price}
                onChange={(e) => selectedItem 
                  ? setSelectedItem({...selectedItem, price: e.target.value})
                  : setNewItem({...newItem, price: e.target.value})
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Calories</label>
              <Input 
                className="mt-1" 
                type="text" 
                placeholder="0"
                value={selectedItem?.calories || newItem.calories}
                onChange={(e) => selectedItem 
                  ? setSelectedItem({...selectedItem, calories: e.target.value})
                  : setNewItem({...newItem, calories: e.target.value})
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                className="mt-1" 
                rows={3}
                value={selectedItem?.description || newItem.description}
                onChange={(e) => selectedItem 
                  ? setSelectedItem({...selectedItem, description: e.target.value})
                  : setNewItem({...newItem, description: e.target.value})
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select 
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                value={selectedItem?.category || newItem.category}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  if (selectedItem) {
                    setSelectedItem({...selectedItem, category: newCategory});
                  } else {
                    setNewItem({...newItem, category: newCategory});
                  }
                }}
              >
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddItemDialogOpen(false);
              setSelectedItem(null);
              setNewItem({
                id: generateId(),
                name: "",
                price: "",
                calories: "",
                description: "",
                category: "Main Course"
              });
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedItem) {
                // Edit existing item
                setMenuItems(menuItems.map(item => 
                  item.id === selectedItem.id ? selectedItem : item
                ));
              } else {
                // Add new item
                setMenuItems([...menuItems, newItem]);
              }
              setIsAddItemDialogOpen(false);
              setSelectedItem(null);
              setNewItem({
                id: generateId(),
                name: "",
                price: "",
                calories: "",
                description: "",
                category: "Main Course"
              });
            }}>
              {selectedItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
