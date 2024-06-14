import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminShippingMethodsService } from 'src/app/core/services/admin/shipping-methods/shipping-methods.service';
import countries from '../../../../../../../assets/countries.json';

@Component({
  selector: 'app-add-shipping-method-modal',
  templateUrl: './add-shipping-method-modal.component.html',
})
export class AdminAddShippingMethodModalComponent implements OnInit {
  constructor(
    private adminShippingMethodsService: AdminShippingMethodsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdminAddShippingMethodModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  shippingMethodForm = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
    active: [false, [Validators.required]],
    countries: [[]],
  });
  countries = countries;
  ngOnInit(): void {}

  addShippingMethod(): void {
    this.adminShippingMethodsService
      .addShippingMethod(this.shippingMethodForm.value)
      .subscribe({
        next: (response) => {
          this.dialogRef.close({ event: 'Add', data: response });
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
