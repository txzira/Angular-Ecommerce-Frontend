import { ProductVariantAttribute } from './product.model';

export interface Cart {
  items: Array<CartItem>;
}

export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  variant: CartItemVariant | undefined;
}

interface CartItemVariant {
  id: number;
  productVariantAttributes: Array<ProductVariantAttribute>;
}
