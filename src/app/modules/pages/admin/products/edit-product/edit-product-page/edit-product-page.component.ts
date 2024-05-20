import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/core/models/brand.model';
import { Category } from 'src/app/core/models/category.model';
import { Product } from 'src/app/core/models/product.model';
import { BrandsService } from 'src/app/core/services/user/brands/brands.service';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';
import { ProductsService } from 'src/app/core/services/user/products/products.service';
import { AdminProductsService } from 'src/app/core/services/admin/products/products.service';
import { AdminVariantsModalComponent } from '../components/variants-modal/variants-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.css'],
})
export class AdminEditProductPageComponent implements OnInit {
  product!: Product;
  categories!: Array<Category>;
  brands!: Array<Brand>;
  attributeGroups: any = [];
  editProductForm!: FormGroup;
  productImages: {
    id?: number;
    imageName: string;
    imagePath?: string | ArrayBuffer | null | undefined;
    url?: string;
  }[] = [];

  constructor(
    private productsService: ProductsService,
    private adminProductsService: AdminProductsService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    this.productsService.getProductById(productId).subscribe((_product) => {
      this.product = _product;
      this.setProductForm(_product);
    });
    this.categoriesService
      .getAllCategories()
      .subscribe((_categories) => (this.categories = _categories));

    this.brandsService.getAllBrands().subscribe((_brands) => {
      this.brands = _brands;
    });
    this.adminProductsService
      .getAttrGroupByProdId(productId)
      .subscribe(
        (_attributeGroups) => (this.attributeGroups = _attributeGroups)
      );

    this.adminProductsService
      .getProductImages(productId)
      .subscribe((_productImages) => {
        for (let i = 0; i < _productImages.length; i++) {
          let imageName: string[] | string =
            _productImages[i].publicId.split('/');
          imageName = imageName[imageName.length - 1];
          this.productImages.push({
            id: _productImages[i].id,
            imageName: imageName,
            url: _productImages[i].url,
          });
        }
      });
  }

  editProduct(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    let slug = this.editProductForm.value.slug!;
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
      this.editProductForm.patchValue({ slug });
    }

    this.adminProductsService
      .editProduct(productId!, this.editProductForm.value, this.productImages)
      .subscribe({
        next: (_product) => {
          this.product = _product;
          this.snackBar.open(
            `\u2705${_product.name} successfully edited.`,
            'Ok.',
            {
              duration: 3000,
            }
          );
        },
        error: (response) => {
          console.log(response);
          this.snackBar.open(
            `\u274cFailed to edit ${this.product.name} .`,
            'Ok.',
            {
              duration: 3000,
            }
          );
        },
      });
  }

  openVariantsDialog(): void {
    const tempAttributeGroups = JSON.parse(
      JSON.stringify(this.attributeGroups)
    );
    const dialogRef = this.dialog.open(AdminVariantsModalComponent, {
      data: { product: this.product, attributeGroups: tempAttributeGroups },
      height: '100%',
      width: '1000px',
      position: { right: '0' },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result.event === 'Delete') {
    //     this.categories = result.data;
    //   }
    // });
  }

  handleSlugFromName(event: Event): void {
    let slug = (event.target as HTMLInputElement).value;
    slug = slug.toLowerCase().replaceAll(' ', '-');
    if (slug[slug.length - 1] === '-') {
      slug = slug.substring(0, slug.length - 1);
    }
    this.editProductForm.patchValue({ slug });
  }
  handleSlug(): void {
    let slug = this.editProductForm.value.slug;
    slug = slug!.toLowerCase().replaceAll(' ', '-');

    this.editProductForm.patchValue({ slug });
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

  navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  private setProductForm(responseProduct: Product): void {
    const selectedCategories: any = [];

    for (let i = 0; i < responseProduct.categories.length; i++) {
      selectedCategories.push(responseProduct.categories[i].id);
    }

    // const imagePublicId = responseProduct.image?.publicId;
    // if (imagePublicId) {
    //   let imageName: any = imagePublicId.split('/');
    //   imageName = imageName[imageName.length - 1];
    //   console.log(imageName);
    //   this.defaultImage.imageName = imageName;
    //   this.defaultImage.imagePath = responseProduct.image?.url;
    // }
    // this.defaultImage.imageName= responseProduct.image.

    this.editProductForm = this.formBuilder.group({
      name: new FormControl(responseProduct.name, [Validators.required]),
      slug: new FormControl(responseProduct.slug, [Validators.required]),
      stock: new FormControl(responseProduct.quantity, [Validators.required]),
      description: new FormControl(responseProduct.description),
      active: new FormControl(responseProduct.active, [Validators.required]),
      price: new FormControl(responseProduct.price, [Validators.required]),
      sku: new FormControl(responseProduct.sku),
      brand: new FormControl(
        responseProduct.brand?.id ? responseProduct.brand?.id : ''
      ),
      categories: new FormControl(selectedCategories),
    });
  }
}
