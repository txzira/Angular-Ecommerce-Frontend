import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminBrandsService } from 'src/app/core/services/admin/brands/brands.service';

@Component({
  selector: 'app-delete-brand-modal',
  templateUrl: './delete-brand-modal.component.html',
})
export class AdminDeleteBrandModalComponent {
  brand!: any;
  constructor(
    private adminBrandsService: AdminBrandsService,
    private dialogRef: MatDialogRef<AdminDeleteBrandModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.brand = data.brand;
  }

  deleteBrand(): void {
    this.adminBrandsService.deleteBrand(this.brand.id).subscribe({
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
