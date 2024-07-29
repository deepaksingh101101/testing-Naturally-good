export interface BagItem {
  itemName: string;
  itemPrice: number;
  itemPieces?: number;
  itemWeight?: number;
}

export interface Creator {
  role: 'Admin' | 'Customer' | 'Employee';
  name: string;
}

export interface Bag {
  bagName: string;
  bagItems: BagItem[];
  totalPrice: number;
  totalWeight?: number;
  totalPieces?: number;
  createdDate: string;
  updatedDate?: string;
  status: 'Active' | 'Inactive';
  createdBy: Creator;
  visibility?:String
}

export const BagData: Bag[] = [
  {
    bagName: 'Regular Veggie Bag',
    bagItems: [
      { itemName: 'Carrots', itemPrice: 100, itemWeight: 1 },
      { itemName: 'Potatoes', itemPrice: 200, itemWeight: 2 },
      { itemName: 'Tomatoes', itemPrice: 200, itemWeight: 2 },
    ],
    totalPrice: 500,
    totalWeight: 5,
    totalPieces: undefined,
    createdDate: '2023-01-01',
    status: 'Active',
    visibility: 'Admin',
    createdBy: { role: 'Admin', name: 'Deepak singh' }
  },
  {
    bagName: 'Mini Veggie Bag',
    bagItems: [
      { itemName: 'Spinach', itemPrice: 100, itemPieces: 1 },
      { itemName: 'Onions', itemPrice: 100, itemPieces: 1 },
      { itemName: 'Garlic', itemPrice: 100, itemPieces: 1 },
    ],
    totalPrice: 300,
    totalWeight: undefined,
    totalPieces: 3,
    createdDate: '2023-07-01',
    status: 'Inactive',
    visibility: 'Customer',
    createdBy: { role: 'Customer', name: 'John Doe' }
  },
  {
    bagName: 'Veggie Bag',
    bagItems: [
      { itemName: 'Spinach', itemPrice: 100, itemPieces: 1 },
      { itemName: 'Onions', itemPrice: 100, itemPieces: 1 },
      { itemName: 'Garlic', itemPrice: 100, itemPieces: 1 },
    ],
    totalPrice: 300,
    totalWeight: undefined,
    totalPieces: 3,
    createdDate: '2023-07-01',
    status: 'Inactive',
    createdBy: { role: 'Employee', name: 'John roy' },
    visibility: 'Admin'
  }
];