import { Card } from './card.model';
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
  shippingAddress?: any;
  billingAddress?: any;
  card?: Card;
  shippingMethodId: number;
  shippingMethod?: any;
}
