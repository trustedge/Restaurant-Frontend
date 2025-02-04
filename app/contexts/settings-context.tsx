"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface RestaurantSettings {
  RESTAURANT_NAME: string;
  RESTAURANT_DESCRIPTION: string;
  RESTAURANT_ADDRESS: string;
  RESTAURANT_HOURS: string;
  RESTAURANT_EMAIL: string;
  RESTAURANT_SUPPORT_PHONE: string;
  PHONE_AGENT_INSTRUCTION: string;
}

const SettingsContext = createContext<{
  settings: RestaurantSettings;
  setSettings: React.Dispatch<React.SetStateAction<RestaurantSettings>>;
  isLoading: boolean;
}>({
  settings: {} as RestaurantSettings,
  setSettings: () => {},
  isLoading: true
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings>({} as RestaurantSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
