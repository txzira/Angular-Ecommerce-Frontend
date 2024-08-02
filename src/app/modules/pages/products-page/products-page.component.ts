import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Category } from 'src/app/core/models/category.model';
import { Product } from 'src/app/core/models/product.model';
import { ProductsFilterService } from 'src/app/core/services/filters/products-filter.service';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
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
  filteredProducts: Array<Product> | undefined;
  productSearch = new FormControl('');

  sort!: string;
  itemsToShowCount!: string;
  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
    if (!this.isMobileDisplay) {
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
    } else {
      this.columns = 1;
      this.rowHeight = 400;
      this.sort = 'asc';
      this.itemsToShowCount = '100';
    }
  }

  constructor(
    private productsService: ProductsService,
    private productsFilterService: ProductsFilterService,
    public browserDetectorService: BrowserDetectorService
  ) {}

  ngOnInit(): void {
    this.productsService.getAllActiveProducts().subscribe((_products) => {
      this.products = _products;
    });
    this.isMobileDisplay = this.browserDetectorService.isMobile();

    if (!this.isMobileDisplay) {
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
    } else {
      this.columns = 1;
      this.rowHeight = 400;
      this.sort = 'asc';
      this.itemsToShowCount = '100';
    }
  }

  filterProducts(): void {
    if (this.productSearch.value) {
      this.filteredProducts = this.products?.filter((product) => {
        return product.name
          .toLowerCase()
          .includes(this.productSearch.value!.toLowerCase());
      });
    } else {
      this.filteredProducts = this.products;
    }
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
