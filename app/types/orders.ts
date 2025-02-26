export interface DynamoOrderItem {
  Name: string;
  Notes: string;
  Quantity: number;
  Price: number;
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
  timestamp: string;
  Total: number;
}
