"use client";

import React, { createContext, useContext, useState } from 'react';

interface Settings {
  RESTAURANT_NAME: string;
  RESTAURANT_DESCRIPTION: string;
  RESTAURANT_ADDRESS: string;
  RESTAURANT_HOURS: string;
  RESTAURANT_EMAIL: string;
  RESTAURANT_SUPPORT_PHONE: string;
  PHONE_AGENT_INSTRUCTION: string;
}

const defaultSettings: Settings = {
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
4. Confirm all details with the caller, including the date and time of the appointment.`
};

const SettingsContext = createContext<{
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}>({
  settings: defaultSettings,
  setSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
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
