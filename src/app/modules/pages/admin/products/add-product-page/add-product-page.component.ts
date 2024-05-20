import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Brand } from 'src/app/core/models/brand.model';
import { Category } from 'src/app/core/models/category.model';
import { Product } from 'src/app/core/models/product.model';
import { BrandsService } from 'src/app/core/services/user/brands/brands.service';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';
import { AdminProductsService } from 'src/app/core/services/admin/products/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product-page.component.html',
})
export class AdminAddProductPageComponent implements OnInit {
  product: Product | null = null;
  categories: Array<Category> | undefined;
  brands: Array<Brand> | undefined;
  productImages: {
    id?: number;
    imageName: string;
    imagePath?: string | ArrayBuffer | null | undefined;
    url?: string;
  }[] = [];

  addProductForm = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    stock: [0, [Validators.required]],
    active: [false, [Validators.required]],
    price: [0, [Validators.required]],
    sku: ['', []],
    brand: [''],
    description: [''],
    categories: [[]],
  });
  constructor(
    private adminProductsService: AdminProductsService,
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe((_categories) => {
      this.categories = _categories;
    });

    this.brandsService.getAllBrands().subscribe((_brands) => {
      this.brands = _brands;
    });
  }

  addProduct(): void {
    let slug = this.addProductForm.value.slug!;
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
      this.addProductForm.patchValue({ slug });
    }

    this.adminProductsService
      .addProduct(this.addProductForm.value, this.productImages)
      .subscribe({
        next: (_product) => {
          this.snackBar.open(
            `\u2705${_product.name} added successfully.`,
            'Ok',
            {
              duration: 3000,
            }
          );
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          this.snackBar.open('\u274cFailed to add product.', 'Ok', {
            duration: 3000,
          });
        },
      });
  }
  addImages(
    _productImages: Array<{
      id?: number;
      imageName: string;
      imagePath?: string | ArrayBuffer | null | undefined;
      url?: string;
    }>
  ) {
    this.productImages = _productImages;
  }
  handleSlugFromName(event: Event): void {
    let slug = (event.target as HTMLInputElement).value;
    slug = slug.toLowerCase().replaceAll(' ', '-');
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
    }
    this.addProductForm.patchValue({ slug });
  }
  handleSlug(): void {
    let slug = this.addProductForm.value.slug;
    slug = slug!.toLowerCase().replaceAll(' ', '-');

    this.addProductForm.patchValue({ slug });
  }

  navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }
}
