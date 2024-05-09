import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/core/models/cart.model';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/user/cart/cart.service';
import { ProductsService } from 'src/app/core/services/user/products/products.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
})
export class SiteLayoutComponent implements OnInit {
  cart: Cart = { items: [] };
  products: Array<Product> | undefined;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
    this.getProducts();
  }

  getProducts(): void {
    this.productsService.getAllActiveProducts().subscribe((_products) => {
      this.products = _products;
    });
  }
}
