import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  Attribute,
  AttributeGroup,
  Product,
  ProductVariant,
} from 'src/app/core/models/product.model';
import { AdminProductsService } from 'src/app/core/services/admin/products/products.service';
import { AdminEditAttributeGroupModalComponent } from '../edit-attribute-group-modal/edit-attribute-group-modal.component';
import { AdminEditVariantModalComponent } from '../edit-variant-modal/edit-variant-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-variants-modal',
  templateUrl: './variants-modal.component.html',
})
export class AdminVariantsModalComponent implements OnInit {
  attributeGroups: Array<AttributeGroup> = [];
  attributesToDelete: Array<Attribute> = [];
  attributeGroupsmarkedForDelete = new Map();
  variants!: Array<ProductVariant>;
  product: Product | undefined;

  constructor(
    private adminProductsService: AdminProductsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AdminVariantsModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.attributeGroups = this.data.attributeGroups;
    this.product = this.data.product;
    if (this.product) {
      this.adminProductsService
        .getVariantsByProductId(this.product.id.toString())
        .subscribe((_variants) => {
          this.variants = _variants;
        });
    }
  }

  addAttributeGroup(): void {
    this.attributeGroups.push({ name: '', attributes: [] });
  }
  changeAttributeGroupName(event: Event, index: number) {
    this.attributeGroups[index].name = (event.target as HTMLInputElement).value;
  }

  addAttribute(event: Event, index: number) {
    const attribute = (event.target as HTMLInputElement).value;
    if (attribute) {
      this.attributeGroups[index].attributes!.push({ name: attribute });
      (event.target as HTMLInputElement).value = '';
    }
  }

  deleteAttribute(groupIndex: number, attributeIndex: number) {
    const attribute = this.attributeGroups[groupIndex].attributes!.splice(
      attributeIndex,
      1
    )[0];
    if (attribute.id) {
      this.attributesToDelete.push(attribute);
    }
  }

  deleteAttributeGroup(index: number, attributeGroupId: number): void {
    if (attributeGroupId) {
      this.attributeGroupsmarkedForDelete.set(
        attributeGroupId,
        attributeGroupId
      );
    } else {
      this.attributeGroups.splice(index, 1);
    }
  }
  cancelAttributeGroupDelete(attributeGroupId: number): void {
    this.attributeGroupsmarkedForDelete.delete(attributeGroupId);
  }

  saveChanges(): void {
    const attributeGroupsToDelete = Array.from(
      this.attributeGroupsmarkedForDelete
    ).map((obj) => obj[0]);

    this.adminProductsService
      .saveAttributeGroupChanges(
        this.data.product.id,
        this.attributeGroups,
        attributeGroupsToDelete,
        this.attributesToDelete
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  saveAndGenerateVariants(): void {
    const attributeGroupsToDelete = Array.from(
      this.attributeGroupsmarkedForDelete
    ).map((obj) => obj[0]);

    this.adminProductsService
      .saveAndGenerateVariants(
        this.data.product.id,
        this.attributeGroups,
        attributeGroupsToDelete,
        this.attributesToDelete
      )
      .subscribe((response) => {
        console.log(response);
        this.variants = response.variants;
        if (response.message === 'Success') {
          this.snackBar.open(
            `\u2705Save success and variants generated.`,
            'Ok',
            {
              duration: 3000,
            }
          );
        }
      });
  }
  openEditAttributeGroupDialog(attributeGroup: AttributeGroup): void {
    const dialogRef = this.dialog.open(AdminEditAttributeGroupModalComponent, {
      data: { attributeGroup },
      height: '100%',
      width: '950px',
      position: { right: '0' },
    });
  }
  openEditVariantDialog(variant: ProductVariant): void {
    const dialogRef = this.dialog.open(AdminEditVariantModalComponent, {
      data: { variant },
      height: '100%',
      width: '950px',
      position: { right: '0' },
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
