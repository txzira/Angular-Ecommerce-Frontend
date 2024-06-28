import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductVariant } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-edit-variant-modal',
  templateUrl: './edit-variant-modal.component.html',
})
export class AdminEditVariantModalComponent implements OnInit {
  variant: ProductVariant = this.data.variant;
  variantForm!: FormGroup;
  images: {
    id?: number;
    imageName: string;
    imagePath?: string | ArrayBuffer | null | undefined;
    url?: string;
  }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AdminEditVariantModalComponent>,
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
    for (let i = 0; i < this.variant.variantImages.length; i++) {
      let imageName: string[] | string =
        this.variant.variantImages[i].publicId.split('/');
      imageName = imageName[imageName.length - 1];
      this.images.push({
        id: this.variant.variantImages[i].id,
        imageName,
        url: this.variant.variantImages[i].url,
      });
    }
    console.log(this.variant);
  }
  closeModal() {
    this.dialogRef.close();
  }
}
