import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, debounceTime, map, of, switchMap } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { ProductsFilterService } from 'src/app/core/services/filters/products-filter.service';
import { ProductsService } from 'src/app/core/services/user/products/products.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
})
export class CategoryPageComponent implements OnInit {
  products: Array<Product> | undefined;
  columns!: number;
  rowHeight!: number;
  sort!: string;
  itemsToShowCount!: string;
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private productsFilterService: ProductsFilterService
  ) {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return of(params.get('categoryName'));
        })
      )
      .subscribe((param) => {
        this.productsService
          .getProductsByCategoryName(param)
          .subscribe((_products) => (this.products = _products));
      });
  }

  ngOnInit(): void {
    this.productsFilterService.columns.subscribe(
      (columns) => (this.columns = columns)
    );
    this.productsFilterService.rowHeight.subscribe(
      (rowHeight) => (this.rowHeight = rowHeight)
    );
    this.productsFilterService.itemsToShowCount.subscribe(
      (itemsToShowCount) => (this.itemsToShowCount = itemsToShowCount)
    );
    this.productsFilterService.sort.subscribe((sort) => (this.sort = sort));
  }
}
