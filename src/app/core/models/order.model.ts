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
  tracking?: Tracking;
  customer: { firstName: string; lastName: string };
  cart: Cart;
  shippingAddress?: any;
  billingAddress?: any;
  card?: Card;
  shippingMethodId: number;
  shippingMethod?: any;
}

export interface Tracking {
  id?: string;
  tracking_number: string;
  carrier: 'UPS' | 'USPS' | 'FEDEX';
  email_sent: boolean;
}
