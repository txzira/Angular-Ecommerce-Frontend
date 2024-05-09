import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminCategoriesService } from 'src/app/core/services/admin/categories/categories.service';

@Component({
  selector: 'app-delete-categoy-modal',
  templateUrl: './delete-categoy-modal.component.html',
})
export class AdminDeleteCategoyModalComponent {
  category!: any;
  constructor(
    private adminCategoriesService: AdminCategoriesService,
    private dialogRef: MatDialogRef<AdminDeleteCategoyModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.category = data.category;
  }

  deleteCategory(): void {
    this.adminCategoriesService.deleteCategory(this.category.id).subscribe({
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
