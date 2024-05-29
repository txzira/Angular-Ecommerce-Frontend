import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductsFilterService } from 'src/app/core/services/filters/products-filter.service';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
})
export class ProductsHeaderComponent implements OnInit {
  constructor(private productsFilterService: ProductsFilterService) {}
  sort!: string;
  itemsToShowCount!: number;
  columns!: number;

  ngOnInit(): void {
    this.productsFilterService.sort.subscribe((sort) => (this.sort = sort));
    this.productsFilterService.itemsToShowCount.subscribe(
      (itemsToShowCount) => (this.itemsToShowCount = Number(itemsToShowCount))
    );
    this.productsFilterService.columns.subscribe(
      (columns) => (this.columns = columns)
    );
  }

  onSortUpdated(newSort: string): void {
    this.productsFilterService.sortChange(newSort);
  }
  onItemsToShowCountUpdated(count: number): void {
    this.productsFilterService.itemsToShowCountChange(count);
  }

  onColumnsUpdated(colsNum: number): void {
    this.productsFilterService.columnsCountChange(colsNum);
  }
}
