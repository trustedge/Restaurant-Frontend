import { NextResponse } from 'next/server';
import { SSMClient, GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm";

// Remove force-static to allow dynamic execution
export const dynamic = 'force-static'

interface RestaurantSettings {
  RESTAURANT_NAME: string;
  RESTAURANT_DESCRIPTION: string;
  RESTAURANT_ADDRESS: string;
  RESTAURANT_HOURS: string;
  RESTAURANT_EMAIL: string;
  RESTAURANT_SUPPORT_PHONE: string;
  PHONE_AGENT_INSTRUCTION: string;
}



// var defaultSettings: RestaurantSettings = {
//   RESTAURANT_NAME: "Terry's American Dining",
//   RESTAURANT_DESCRIPTION: "Terry's American Dining provides amazing American cuisine!",
//   RESTAURANT_ADDRESS: "123 Main St",
//   RESTAURANT_HOURS: "9AM-10PM",
//   RESTAURANT_EMAIL: "testing@johndining.com",
//   RESTAURANT_SUPPORT_PHONE: "+1234567890",
//   PHONE_AGENT_INSTRUCTION: `If a customer wish to reserve table, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:
// 1. Ask for their name.
// 2. Ask for number of the people who will be dining.
// 3. Request their preferred date and time for the appointment.
// 4. Confirm all details with the caller, including the date and time of the appointment.`
// };

const createSSMClient = () => {
  console.log(' in create SSMClient')
  // Only use credentials in local development mode
  const clientConfig = process.env.NEXT_PUBLIC_DEV_MODE && process.env.NEXT_PUBLIC_DEV_MODE === 'true' 
    ? {
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      }
    : { region: process.env.AWS_REGION || 'us-east-1' };

  return new SSMClient(clientConfig);
};
const parameterPath = process.env.PATH_PREFIX || '';

export async function GET() {

  try {
    console.log('DEV_MODE:', process.env.NEXT_PUBLIC_DEV_MODE);
    // For development/testing, return default settings
    // if (process.env.NEXT_PUBLIC_DEV_MODE && process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    //   return NextResponse.json(defaultSettings);
    // }
    
    // If NEXT_PUBLIC_DEV_MODE is not 'true', proceed with fetching from SSM
    const client = createSSMClient();
    const settings: RestaurantSettings = {} as RestaurantSettings;
    
    // Get each setting from SSM Parameter Store
    const keys: (keyof RestaurantSettings)[] = [
      'RESTAURANT_NAME',
      'RESTAURANT_DESCRIPTION',
      'RESTAURANT_ADDRESS',
      'RESTAURANT_HOURS',
      'RESTAURANT_EMAIL',
      'RESTAURANT_SUPPORT_PHONE',
      'PHONE_AGENT_INSTRUCTION'
    ];

    for (const key of keys) {
      const command = new GetParameterCommand({
        Name: `${parameterPath}/${key}`,
      });

      try {
        const response = await client.send(command);
        if (response.Parameter?.Value) {
          settings[key] = response.Parameter.Value;
        } else {
          console.warn(`No value found for ${key} in SSM, skipping.`);
        }
      } catch (error) {
        console.error(`Error fetching SSM parameter for ${key}:`, error);
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
    if (process.env.NEXT_PUBLIC_DEV_MODE && process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      return NextResponse.json({ message: 'Settings updated successfully' });
    }

    // If NEXT_PUBLIC_DEV_MODE is not 'true', proceed with updating SSM
    const client = createSSMClient();
   
    // Update each setting in SSM Parameter Store
    for (const [key, value] of Object.entries(settings)) {
      const command = new PutParameterCommand({
        Name: `${parameterPath}/${key}`,
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
