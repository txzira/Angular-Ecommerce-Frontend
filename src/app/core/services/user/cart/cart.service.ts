import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../../../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../local/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ cartItems: [] });

  constructor(
    private _snackBar: MatSnackBar,
    private localService: LocalStorageService
  ) {
    const cart = this.localService.getLocalStorageData('cart');
    if (cart) {
      this.cart.next(JSON.parse(cart));
    }
  }

  getCart(): Cart {
    return this.cart.value;
  }

  addToCart(item: CartItem): void {
    console.log(this.getCart());
    const cartItems = [...this.getCart().cartItems];
    const itemInCart = cartItems.find((_item) => _item.id === item.id);
    const attributes = item.variant?.productVariantAttributes.map(
      (productVariantAttribute) => {
        return productVariantAttribute.attribute.name;
      }
    );

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      cartItems.push(item);
    }
    this.cart.next({ cartItems });
    this.localService.saveLocalStorageData(
      'cart',
      JSON.stringify({ cartItems })
    );
    if (attributes) {
      let variantName = '';
      for (let i = 0; i < attributes.length; i++) {
        if (i !== attributes.length - 1) {
          variantName += attributes[i] + ' - ';
        } else {
          variantName += attributes[i];
        }
      }
      this._snackBar.open(
        `'${item.productName}: ${variantName}' added to cart.`,
        'Ok',
        { duration: 3000 }
      );
    } else {
      this._snackBar.open(`'${item.productName}' added to cart.`, 'Ok', {
        duration: 3000,
      });
    }
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.cartItems.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }
    this.cart.next({ cartItems: filteredItems });
    this.localService.saveLocalStorageData(
      'cart',
      JSON.stringify({ cartItems: filteredItems })
    );

    this._snackBar.open('1 item removed from cart.', 'Ok', { duration: 3000 });
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCartFromNav(): void {
    this.cart.next({ cartItems: [] });
    this.localService.clearLocalStorageData('cart');
    this._snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000,
    });
  }
  clearCartFromCheckout(): void {
    this.cart.next({ cartItems: [] });
    this.localService.clearLocalStorageData('cart');
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.cartItems.filter(
      (_item) => _item.id !== item.id
    );
    if (update) {
      this.cart.next({ cartItems: filteredItems });
      this.localService.saveLocalStorageData(
        'cart',
        JSON.stringify({ cartItems: filteredItems })
      );
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });
    }
    return filteredItems;
  }
  getItemsQuantity(cart: Cart) {
    return cart.cartItems
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }
}
