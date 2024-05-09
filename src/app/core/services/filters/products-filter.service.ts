import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Injectable({
  providedIn: 'root',
})
export class ProductsFilterService {
  private columnsSource = new BehaviorSubject<number>(3);
  private rowHeightSource = new BehaviorSubject<number>(ROWS_HEIGHT[3]);
  private sortSource = new BehaviorSubject<string>('desc');
  private itemsToShowCountSource = new BehaviorSubject<string>('12');

  columns = this.columnsSource.asObservable();
  rowHeight = this.rowHeightSource.asObservable();

  sort = this.sortSource.asObservable();
  itemsToShowCount = this.itemsToShowCountSource.asObservable();
  constructor() {}

  columnsCountChange(colsNum: number): void {
    this.columnsSource.next(colsNum);
    this.rowHeightSource.next(ROWS_HEIGHT[colsNum]);
  }

  itemsToShowCountChange(newCount: number): void {
    this.itemsToShowCountSource.next(newCount.toString());
  }

  sortChange(newSort: string): void {
    this.sortSource.next(newSort);
  }
}
