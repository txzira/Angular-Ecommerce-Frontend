import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { Product } from 'src/app/core/models/product.model';
import { ProductsFilterService } from 'src/app/core/services/filters/products-filter.service';
import { ProductsService } from 'src/app/core/services/user/products/products.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent implements OnInit {
  columns!: number;
  rowHeight!: number;
  products: Array<Product> | undefined;
  sort!: string;
  itemsToShowCount!: string;

  constructor(
    private productsService: ProductsService,
    private productsFilter: ProductsFilterService
  ) {}

  ngOnInit(): void {
    this.productsService.getAllActiveProducts().subscribe((_products) => {
      this.products = _products;
    });
    this.productsFilter.columns.subscribe(
      (columns) => (this.columns = columns)
    );
    this.productsFilter.rowHeight.subscribe(
      (rowHeight) => (this.rowHeight = rowHeight)
    );
    this.productsFilter.itemsToShowCount.subscribe(
      (itemsToShowCount) => (this.itemsToShowCount = itemsToShowCount)
    );
    this.productsFilter.sort.subscribe((sort) => (this.sort = sort));
  }
  getStyle() {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.columns}, 1fr)`,
      'justify-items': 'center',
      'row-gap': '10em',
    };
  }
}
