"use client";

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Settings {
  RESTAURANT_NAME: string;
  RESTAURANT_DESCRIPTION: string;
  RESTAURANT_ADDRESS: string;
  RESTAURANT_HOURS: string;
  RESTAURANT_EMAIL: string;
  RESTAURANT_SUPPORT_PHONE: string;
  PHONE_AGENT_INSTRUCTION: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    RESTAURANT_NAME: "Terry's American Dining",
    RESTAURANT_DESCRIPTION: "Terry's American Dining provides amazing American cuisine!",
    RESTAURANT_ADDRESS: "123 Main St",
    RESTAURANT_HOURS: "9AM-10PM",
    RESTAURANT_EMAIL: "testing@johndining.com",
    RESTAURANT_SUPPORT_PHONE: "+1234567890",
    PHONE_AGENT_INSTRUCTION: `If a customer wish to reserve table, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:
1. Ask for their name.
2. Ask for number of the people who will be dining.
3. Request their preferred date and time for the appointment.
4. Confirm all details with the caller, including the date and time of the appointment.

If a customer wishes to place an order:
1. Please confirm with the details(important fields: Customer name, item name, quantity if not specified will be default to 1) before executing the PlaceOrder function
2. The customer can only order items in the menu (Only read out the name of the items if asked to do so, and read description, price, calories only if specifically requested)
3. If customer wants an item that doesn't exist in menu below, you may suggest an menu item that is similar to the customer's item according to the menu description
4. Customer can also add side notes on each item.`
  });

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save to database
    console.log('Saving settings:', settings);
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Restaurant Settings</h1>

        <div className="grid gap-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant Name</label>
                <Input
                  value={settings.RESTAURANT_NAME}
                  onChange={(e) => handleChange('RESTAURANT_NAME', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={settings.RESTAURANT_DESCRIPTION}
                  onChange={(e) => handleChange('RESTAURANT_DESCRIPTION', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  value={settings.RESTAURANT_ADDRESS}
                  onChange={(e) => handleChange('RESTAURANT_ADDRESS', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <Input
                  value={settings.RESTAURANT_HOURS}
                  onChange={(e) => handleChange('RESTAURANT_HOURS', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={settings.RESTAURANT_EMAIL}
                  onChange={(e) => handleChange('RESTAURANT_EMAIL', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Support Phone</label>
                <Input
                  type="tel"
                  value={settings.RESTAURANT_SUPPORT_PHONE}
                  onChange={(e) => handleChange('RESTAURANT_SUPPORT_PHONE', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Phone Agent Instructions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Phone Agent Instructions</h2>
            <Textarea
              value={settings.PHONE_AGENT_INSTRUCTION}
              onChange={(e) => handleChange('PHONE_AGENT_INSTRUCTION', e.target.value)}
              rows={10}
            />
          </div>
        </div>
      </div>

      {/* Fixed Save Button at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-end">
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
