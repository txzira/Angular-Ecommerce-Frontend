import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cart, CartItem } from 'src/app/core/models/cart.model';
import { CartService } from 'src/app/core/services/user/cart/cart.service';

@Component({
  selector: 'app-nav-cart-modal',
  templateUrl: './nav-cart-modal.component.html',
})
export class NavCartModalComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  get cart(): Cart {
    return this._cart;
  }

  constructor(
    private cartService: CartService,
    private dialogRef: MatDialogRef<NavCartModalComponent>
  ) {
    this.cartService.cart.subscribe((cart) => {
      this._cart = cart;

      this.itemsQuantity = this.cartService.getItemsQuantity(cart);
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCartFromNav();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }
  closeModal(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
