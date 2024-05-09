import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminBrandsService } from 'src/app/core/services/admin/brands/brands.service';

@Component({
  selector: 'app-add-brand-page',
  templateUrl: './add-brand-modal.component.html',
})
export class AdminAddBrandModalComponent implements OnInit {
  constructor(
    private adminBrandsService: AdminBrandsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdminAddBrandModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  brandForm = this.fb.group({
    name: ['', [Validators.required]],
  });
  ngOnInit(): void {}

  addBrand(): void {
    this.adminBrandsService.addBrand(this.brandForm.value).subscribe({
      next: (response) => {
        this.dialogRef.close({ event: 'Add', data: response });
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
