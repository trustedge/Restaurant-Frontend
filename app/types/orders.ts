// DynamoDB stored format
export interface DynamoOrderItem {
  Name: string;
  Notes: string;
  Quantity: number;
}

export interface DynamoCustomer {
  Name: string;
  PhoneNumber: string;
}

export interface DynamoOrder {
  OrderNumber: string;
  Customer: DynamoCustomer;
  Items: DynamoOrderItem[];
  Notes: string;
  OrderDateTime: string;
  OrderStatus: string;
  UpdateDateTime: string;
}

// Application format (with DynamoDB attribute types)
export interface OrderItem {
  M: {
    Name: { S: string };
    Notes: { S: string };
    Quantity: { N: number };
  };
}

export interface Customer {
  M: {
    Name: { S: string };
    PhoneNumber: { S: string };
  };
}

export interface Order {
  OrderNumber: { S: string };
  Customer: Customer;
  Items: { L: OrderItem[] };
  Notes: { S: string };
  OrderDateTime: { S: string };
  OrderStatus: { S: string };
  UpdateDateTime: { S: string };
}
