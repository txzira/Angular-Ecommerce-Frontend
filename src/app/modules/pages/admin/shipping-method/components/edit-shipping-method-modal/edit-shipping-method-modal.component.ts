import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminShippingMethodsService } from 'src/app/core/services/admin/shipping-methods/shipping-methods.service';
import countries from '../../../../../../../assets/countries.json';

@Component({
  selector: 'app-edit-shipping-method-modal',
  templateUrl: './edit-shipping-method-modal.component.html',
})
export class AdminEditShippingMethodModalComponent {
  constructor(
    private adminShippingMethodsService: AdminShippingMethodsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdminEditShippingMethodModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  shippingMethodForm!: FormGroup;
  countries = countries;

  ngOnInit(): void {
    const shippingMethod = this.data.shippingMethod;
    console.log(this.data);
    this.shippingMethodForm = this.fb.group({
      id: [shippingMethod.id],
      name: [shippingMethod.name, [Validators.required]],
      price: [
        Number(shippingMethod.price),
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      active: [shippingMethod.active, [Validators.required]],
      countries: [shippingMethod.countries],
    });
  }

  editShippingMethod(): void {
    this.adminShippingMethodsService
      .editShippingMethod(this.shippingMethodForm.value)
      .subscribe({
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
