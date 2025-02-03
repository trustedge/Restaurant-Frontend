export interface MenuItem {
  id: string;
  name: string;
  price: string;
  calories: string;
  description: string;
  category: string;
}

export interface DynamoMenuItem {
  M: {
    id: { S: string };
    name: { S: string };
    price: { S: string };
    calories: { S: string };
    description: { S: string };
    category: { S: string };
  };
}
