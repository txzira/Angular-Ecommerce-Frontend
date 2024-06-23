import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Cart, CartItem } from 'src/app/core/models/cart.model';
import { CartService } from 'src/app/core/services/user/cart/cart.service';
import { NavCartModalComponent } from './components/nav-cart-modal/nav-cart-modal.component';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';

@Component({
  selector: 'app-nav-cart-button',
  templateUrl: './nav-cart-button.component.html',
})
export class NavCartButtonComponent {
  private _cart: Cart = { cartItems: [] };
  itemsQuantity = 0;
  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = this.cartService.getItemsQuantity(cart);
  }

  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private browserDetectorService: BrowserDetectorService
  ) {}

  openCartDialog(): void {
    this.dialog.open(NavCartModalComponent, {
      position: { right: 'true' },
      height: '100%',
      ...(!this.browserDetectorService.isMobile()
        ? { width: '25%' }
        : { width: '75%' }),
    });
  }
}
