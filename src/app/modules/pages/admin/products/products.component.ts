import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/core/models/product.model';
import { AdminProductsService } from 'src/app/core/services/admin/products/products.service';
import { AdminDeleteProductModalComponent } from './components/delete-product-modal/delete-product-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class AdminProductsPageComponent implements OnInit {
  productSearch = new FormControl('');
  products: Array<Product> | undefined;

  constructor(
    private adminProductService: AdminProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.adminProductService.getAllProducts().subscribe((_products) => {
      this.products = _products;
    });
  }

  openDeleteProductDialog(product: any): void {
    const dialogRef = this.dialog.open(AdminDeleteProductModalComponent, {
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Delete') {
        this.products = result.data;
      }
    });
  }
}
