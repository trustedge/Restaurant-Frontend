import { NextResponse } from 'next/server';
import { SSMClient, GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm";

interface RestaurantSettings {
  RESTAURANT_NAME: string;
  RESTAURANT_DESCRIPTION: string;
  RESTAURANT_ADDRESS: string;
  RESTAURANT_HOURS: string;
  RESTAURANT_EMAIL: string;
  RESTAURANT_SUPPORT_PHONE: string;
  PHONE_AGENT_INSTRUCTION: string;
}

const defaultSettings: RestaurantSettings = {
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

const createSSMClient = () => {
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

  return new SSMClient(clientConfig);
};

export async function GET() {
  try {
    // For development/testing, return default settings
    // if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    //   return NextResponse.json(defaultSettings);
    // }

    const client = createSSMClient();
    const settings: RestaurantSettings = {} as RestaurantSettings;
    const parameterPath = process.env.SSM_PARAMETER_PATH;
    if (!parameterPath) {
      throw new Error('SSM_PARAMETER_PATH environment variable is not set');
    }
    
    // Get each setting from SSM Parameter Store
    for (const key of Object.keys(defaultSettings) as (keyof RestaurantSettings)[]) {
        console.log(key)
      const command = new GetParameterCommand({
        Name: `${parameterPath}/${key.toLowerCase()}`,
      });

      try {
        const response = await client.send(command);
        settings[key] = response.Parameter?.Value || defaultSettings[key];
        
      } catch (error) {
        console.error(`Error fetching SSM parameter for ${key}:`, error);
        settings[key] = defaultSettings[key];
      }
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const settings: RestaurantSettings = await request.json();

    // For development mode, just return success
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      return NextResponse.json({ message: 'Settings updated successfully' });
    }

    const client = createSSMClient();
    const parameterPath = process.env.SSM_PARAMETER_PATH;
    if (!parameterPath) {
      throw new Error('SSM_PARAMETER_PATH environment variable is not set');
    }
    
    // Update each setting in SSM Parameter Store
    for (const [key, value] of Object.entries(settings)) {
      const command = new PutParameterCommand({
        Name: `${parameterPath}/${key.toLowerCase()}`,
        Value: value,
        Type: 'String',
        Overwrite: true
      });

      try {
        await client.send(command);
      } catch (error) {
        console.error(`Error updating SSM parameter for ${key}:`, error);
        throw error;
      }
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
