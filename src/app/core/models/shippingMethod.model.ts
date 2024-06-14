import { Order } from './order.model';

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  active: boolean;
  orders: Order[];
}
