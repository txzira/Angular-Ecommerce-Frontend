import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminShippingMethodsService } from 'src/app/core/services/admin/shipping-methods/shipping-methods.service';

@Component({
  selector: 'app-delete-shipping-method-modal',
  templateUrl: './delete-shipping-method-modal.component.html',
})
export class AdminDeleteShippingMethodModalComponent {
  shippingMethod!: any;
  constructor(
    private adminShippingMethodsService: AdminShippingMethodsService,
    private dialogRef: MatDialogRef<AdminDeleteShippingMethodModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.shippingMethod = data.shippingMethod;
  }

  deleteShippingMethod(): void {
    this.adminShippingMethodsService
      .deleteShippingMethod(this.shippingMethod.id)
      .subscribe({
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
