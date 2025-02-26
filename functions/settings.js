import { SSMClient, GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({});
const parameterPath = process.env.PATH_PREFIX || '';


export const handler = async (event) => {
  try {
    if (event.requestContext.http.method === 'GET') {
      const settings = {};
      
      const keys = [
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
          }
        } catch (error) {
          console.error(`Error fetching SSM parameter for ${key}:`, error);
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify(settings),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    } else if (event.httpMethod === 'PUT') {
      const settings = JSON.parse(event.body || '{}');
      
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

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Settings updated successfully' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
  } catch (error) {
    console.error('Error handling settings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
