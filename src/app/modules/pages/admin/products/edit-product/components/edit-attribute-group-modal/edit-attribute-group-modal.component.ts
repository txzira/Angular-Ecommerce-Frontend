import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttributeGroup } from 'src/app/core/models/product.model';
import { AdminProductsService } from 'src/app/core/services/admin/products/products.service';

@Component({
  selector: 'app-edit-attribute-group-modal',
  templateUrl: './edit-attribute-group-modal.component.html',
})
export class AdminEditAttributeGroupModalComponent implements OnInit {
  attributeGroup: AttributeGroup = this.data.attributeGroup;
  attributeImagesCollection = new Map<
    number,
    {
      attributeId: number | null;
      images: Array<{
        id?: number;
        imageName: string;
        imagePath?: string | ArrayBuffer | null | undefined;
        url?: string;
      }>;
    }
  >();
  attributesForm = this.formBuilder.group({});

  constructor(
    private adminProductsService: AdminProductsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.attributeGroup.attributes?.map((attribute, index) => {
      const images: Array<{
        id?: number;
        imageName: string;
        imagePath?: string | ArrayBuffer | null | undefined;
        url?: string;
      }> = [];
      attribute.images?.map((image, index) => {
        let imageName: string[] | string = image.publicId.split('/');
        imageName = imageName[imageName.length - 1];

        images.push({ id: image.id, imageName, url: image.url });
      });

      ////////////////////////////////////

      this.attributesForm.addControl(
        `attribute${index}`,
        this.formBuilder.group({
          id: new FormControl(attribute.id),
          name: new FormControl(attribute.name, [Validators.required]),
        })
      );
      this.attributeImagesCollection.set(index, {
        attributeId: attribute.id ? attribute.id : null,
        images: images,
      });
    });

    console.log(this.attributeGroup);
  }

  saveChanges(): void {
    const attributes = [];
    const attributesForm = Object.keys(this.attributesForm.value).map((key) => {
      return this.attributesForm.get(key)!.value;
    });

    const attributeImages = Array.from(
      this.attributeImagesCollection,
      ([key, value]) => ({ index: key, images: value })
    );

    for (let i = 0; i < attributesForm.length; i++) {
      attributes.push({
        attributeId: attributesForm[i].id,
        name: attributesForm[i].name,
        images: attributeImages[i].images.images,
      });
    }
    this.adminProductsService
      .editAttributes(this.attributeGroup.id, attributes)
      .subscribe((response) => {
        console.log(response);
      });
    console.log(attributes);
  }

  changeAttributeImagesCollection(
    _attributeImages: Array<{
      id?: number;
      imageName: string;
      imagePath?: string | ArrayBuffer | null | undefined;
      url?: string;
    }>,
    index: number,
    attributeId: number
  ): void {
    this.attributeImagesCollection.set(index, {
      attributeId: attributeId ? attributeId : null,
      images: _attributeImages,
    });
  }
}
