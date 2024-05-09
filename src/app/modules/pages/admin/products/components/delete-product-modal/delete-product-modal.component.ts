import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminProductsService } from 'src/app/core/services/admin/products/products.service';

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
})
export class AdminDeleteProductModalComponent {
  product!: any;
  constructor(
    private adminProductsService: AdminProductsService,
    private dialogRef: MatDialogRef<AdminDeleteProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.product = data.product;
  }

  deleteProduct(): void {
    this.adminProductsService.deleteProduct(this.product.id).subscribe({
      next: (response) => {
        this.dialogRef.close({ event: 'Delete', data: response });
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  closeModal(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
