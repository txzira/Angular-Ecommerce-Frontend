import { Cart } from './cart.model';

export interface Order {
  id: number;
  customerEmail: string;
  shippingTotal: number;
  taxTotal: number;
  cartTotal: number;
  orderTotal: number;
  date: string;
  status: string;
  tracking?: string;
  customer: { firstName: string; lastName: string };
  cart: Cart;
  shippingAddressId: number;
}
