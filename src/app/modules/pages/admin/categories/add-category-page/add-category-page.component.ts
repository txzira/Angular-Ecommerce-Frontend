import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { AdminCategoriesService } from 'src/app/core/services/admin/categories/categories.service';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category-page.component.html',
})
export class AdminAddCategoryPageComponent implements OnInit {
  categories: Array<Category> | undefined;
  categoryForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    description: [''],
    parentId: [''],
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private adminCategoryService: AdminCategoriesService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  async addCategory(formDirective: FormGroupDirective): Promise<void> {
    let categoryName = this.categoryForm.value.name;
    categoryName =
      categoryName!.charAt(0).toUpperCase() + categoryName!.slice(1);

    let slug = this.categoryForm.value.slug!;
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
      this.categoryForm.patchValue({ slug });
    }

    this.categoryForm.patchValue({ name: categoryName });
    this.adminCategoryService.addCategory(this.categoryForm.value).subscribe({
      next: (response) => {
        formDirective.resetForm();
        this.categories = response.categories;
        this.snackBar.open('\u2705Category successfully added!', 'Ok', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('\u274cFailed to add category!', 'Ok', {
          duration: 3000,
        });
      },
    });
  }

  handleSlugFromName(event: Event): void {
    let slug = (event.target as HTMLInputElement).value;
    slug = slug.toLowerCase().replaceAll(' ', '-');
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
    }
    this.categoryForm.patchValue({ slug });
  }
  handleSlug(): void {
    let slug = this.categoryForm.value.slug;
    slug = slug!.toLowerCase().replaceAll(' ', '-');

    this.categoryForm.patchValue({ slug });
  }
}
