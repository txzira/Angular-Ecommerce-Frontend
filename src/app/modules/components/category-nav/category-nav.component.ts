import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
})
export class CategoryNavComponent implements OnInit, OnDestroy {
  categoriesSubscription: Subscription | undefined;
  categories: Array<Category> | undefined;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.categoriesService
      .getParentCategories()
      .subscribe((response) => {
        this.categories = response;
      });
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
