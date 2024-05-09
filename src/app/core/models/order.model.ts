import { Cart } from './cart.model';

export interface Order {
  id: number;
  customerEmail: string;
  amount: number;
  date: string;
  status: string;
  tracking?: string;
  customer: { firstName: string; lastName: string };
  cart: Cart;
  shippingAddressId: number;
}
