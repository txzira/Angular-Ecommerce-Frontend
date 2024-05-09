import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminBrandsService } from 'src/app/core/services/admin/brands/brands.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-brand-page',
  templateUrl: './edit-brand-modal.component.html',
})
export class AdminEditBrandModalComponent {
  constructor(
    private adminBrandsService: AdminBrandsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdminEditBrandModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  brandForm!: FormGroup;
  ngOnInit(): void {
    const brand = this.data.brand;
    console.log(this.data);
    this.brandForm = this.fb.group({
      id: [brand.id],
      name: [brand.name, [Validators.required]],
    });
  }

  editBrand(): void {
    this.adminBrandsService.editBrand(this.brandForm.value).subscribe({
      next: (response) => {
        this.dialogRef.close({ event: 'Edit', data: response });
        console.log(response);
      },
      error: (response) => {
        console.log(response.error);
      },
    });
  }

  closeModal(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
