import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/core/models/cart.model';
import { CartService } from 'src/app/core/services/user/cart/cart.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
})
export class SiteLayoutComponent implements OnInit {
  cart: Cart = { cartItems: [] };

  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
  }
}
