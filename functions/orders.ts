import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.DYNAMODB_ORDERS_TABLE || 'Orders';

    const scanParams = {
      TableName: tableName
    };
    const { Items } = await docClient.send(new ScanCommand(scanParams));

    return {
      statusCode: 200,
      body: JSON.stringify(Items || []),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch orders' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
