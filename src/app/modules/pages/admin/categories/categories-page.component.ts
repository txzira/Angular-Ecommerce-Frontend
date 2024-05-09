import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';
import { AdminDeleteCategoyModalComponent } from './components/delete-categoy-modal/delete-categoy-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-categories',
  templateUrl: './categories-page.component.html',
})
export class AdminCategoriesPageComponent implements OnInit {
  categorySearch = new FormControl('');
  categories: Array<Category> | undefined;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.categoriesService
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  openDeleteCategoryDialog(category: any): void {
    const dialogRef = this.dialog.open(AdminDeleteCategoyModalComponent, {
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Delete') {
        this.categories = result.data;
      }
    });
  }
}
