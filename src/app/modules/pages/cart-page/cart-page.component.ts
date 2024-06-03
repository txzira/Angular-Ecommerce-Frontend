import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/core/models/cart.model';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
import { CartService } from 'src/app/core/services/user/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  itemsQuantity = 0;
  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }

  constructor(
    private cartService: CartService,
    public browserDetectorService: BrowserDetectorService
  ) {}

  ngOnInit(): void {
    this.isMobileDisplay = this.browserDetectorService.isMobile();

    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.itemsQuantity = this.cartService.getItemsQuantity(_cart);
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

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }
}
