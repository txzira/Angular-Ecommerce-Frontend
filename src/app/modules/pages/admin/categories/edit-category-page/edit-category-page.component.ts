import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { AdminCategoriesService } from 'src/app/core/services/admin/categories/categories.service';

@Component({
  selector: 'app-edit-category-page',
  templateUrl: './edit-category-page.component.html',
})
export class AdminEditCategoryPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private adminCategoriesService: AdminCategoriesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  category!: Category;
  subcategories!: { name: string; id: number }[];
  editCategoryForm!: FormGroup;

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.adminCategoriesService
      .getCategoryById(categoryId)
      .subscribe((response) => {
        this.category = response.category;
        this.subcategories = response.subcategories;
        this.setCategoryForm(response.category);
      });
  }

  editCategory(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    // delete '-' at end of slug (slug[len-1]) if appended by white space
    let slug = this.editCategoryForm.value.slug;
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
      this.editCategoryForm.patchValue({ slug });
    }

    this.adminCategoriesService
      .editCategoryById(categoryId, this.editCategoryForm.value)
      .subscribe({
        next: (_category) => {
          this.category = _category;
          this.setCategoryForm(_category);
          this.snackBar.open('\u2705Category change successful! ', 'Ok', {
            duration: 3000,
          });
        },
        error: (response: any) => {
          console.log(response);
          this.snackBar.open('\u274cCategory change unsuccessful', 'Ok', {
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
    this.editCategoryForm.patchValue({ slug });
  }
  handleSlug(): void {
    let slug = this.editCategoryForm.value.slug;
    slug = slug.toLowerCase().replaceAll(' ', '-');

    this.editCategoryForm.patchValue({ slug });
  }

  private setCategoryForm(responseCategory: Category): void {
    const selectedSubcategories: any = [];
    if (responseCategory.children) {
      for (let i = 0; i < responseCategory.children.length; i++) {
        selectedSubcategories.push(responseCategory.children[i].id);
      }
    }
    this.editCategoryForm = this.formBuilder.group({
      name: new FormControl(responseCategory.name, [Validators.required]),
      slug: new FormControl(responseCategory.slug, [Validators.required]),
      description: new FormControl(responseCategory.description, []),
      subcategories: new FormControl(selectedSubcategories),
    });
  }
}
