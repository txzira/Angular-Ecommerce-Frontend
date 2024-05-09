import { Component } from '@angular/core';
import { CartService } from '../core/services/user/cart/cart.service';
import { Cart } from '../core/models/cart.model';
import { Router } from '@angular/router';
import { ProductsService } from '../core/services/user/products/products.service';
import { Product } from '../core/models/product.model';
import { ProductsFilterService } from '../core/services/filters/products-filter.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  cart: Cart = { items: [] };
  products: Array<Product> | undefined;
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  sort = 'desc';
  count = '12';
  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private productsFilter: ProductsFilterService,
    public router: Router
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
  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }
}
