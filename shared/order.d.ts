export interface OrderAddress {
  delMethodId: number;
  city?: string;
  street?: string;
  houseNr?: string;
  flatNr?: number;
  branch?: number;
}

export interface OrderItem {
  itemId: number;
  price: number;
}

export interface Order {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  price: number;
  status: number;
  hasPaid?: string | null;
  ttn?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethodId: number;
  promocode?: string;
  comments?: string;
  receiverName?: string;
  receiverSurname?: string;
  receiverPhoneNumber?: string;
  order_items: OrderItem[];
  order_address?: OrderAddress;
}

export interface CreateOrderPayload {
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  userId?: number;
  receiverName?: string;
  receiverSurname?: string;
  receiverPhoneNumber?: string;
  order_items: Array<{ itemId: number; price: number }>;
  order_address: OrderAddress;
  price: number;
  status: boolean;
  comments?: string;
  paymentMethodId: number;
  promocode?: string;
}
