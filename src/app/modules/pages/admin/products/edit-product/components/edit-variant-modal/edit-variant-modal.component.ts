import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductVariant } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-edit-variant-modal',
  templateUrl: './edit-variant-modal.component.html',
})
export class AdminEditVariantModalComponent implements OnInit {
  variant: ProductVariant = this.data.variant;
  variantForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.variantForm = this.formBuilder.group({
      sku: new FormControl(this.variant.sku),
      quantity: new FormControl(this.variant.quantity),
      price: new FormControl(this.variant.price),
      desciption: new FormControl(this.variant.description),
    });
    for (let i = 0; i < this.variant.productVariantAttributes.length; i++) {
      this.variantForm.addControl(
        `attributeGroup${i + 1}`,
        new FormControl(this.variant.productVariantAttributes[i].attributeId, [
          Validators.required,
        ])
      );
    }
    console.log(this.variant);
  }
}
