import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const tableName = process.env.DYNAMODB_MENU_TABLE;
    
    // GET all menu items
    if (event.requestContext.http.method === 'GET' && !event.pathParameters) {
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
    }
    // GET a specific menu item
    else if (event.requestContext.http.method === 'GET' && event.pathParameters?.id) {
      const getParams = {
        TableName: tableName,
        Key: {
          id: event.pathParameters.id
        }
      };
      
      const { Item } = await docClient.send(new GetCommand(getParams));
      
      if (!Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Menu item not found' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(Item),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    // POST - Create a new menu item
    else if (event.requestContext.http.method === 'POST') {
      const menuItem = JSON.parse(event.body);
      
      const putParams = {
        TableName: tableName,
        Item: menuItem
      };
      
      await docClient.send(new PutCommand(putParams));
      
      return {
        statusCode: 201,
        body: JSON.stringify(menuItem),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    // PUT - Update a menu item
    else if (event.requestContext.http.method === 'PUT' && event.pathParameters?.id) {
      const menuItem = JSON.parse(event.body);
      menuItem.id = event.pathParameters.id;
      
      const putParams = {
        TableName: tableName,
        Item: menuItem
      };
      
      await docClient.send(new PutCommand(putParams));
      
      return {
        statusCode: 200,
        body: JSON.stringify(menuItem),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    // DELETE - Delete a menu item
    else if (event.requestContext.http.method === 'DELETE' && event.pathParameters?.id) {
      const deleteParams = {
        TableName: tableName,
        Key: {
          id: event.pathParameters.id
        }
      };
      
      await docClient.send(new DeleteCommand(deleteParams));
      
      return {
        statusCode: 204,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    else {
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
    console.error('Error handling menu items:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process menu items request' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
