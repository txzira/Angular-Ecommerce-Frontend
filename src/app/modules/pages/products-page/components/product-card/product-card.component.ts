import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute, Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;

  displayImage: string | undefined;
  colors!: Attribute[];
  available: boolean | undefined;
  price: number | undefined;
  queryParams: any = {};

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.product) {
      this.available = this.product.available;
      this.price = this.product.price;
      this.displayImage = this.product?.images?.[0]?.url;
      if (this.product.productVariants.length) {
        for (let i = 0; i < this.product.attributeGroups.length; i++) {
          if (
            ['colors', 'color', 'styles', 'style'].includes(
              this.product.attributeGroups[i].name.toLowerCase()
            )
          ) {
            this.colors = this.product.attributeGroups[i].attributes!;
          }
        }
        for (let i = 0; i < this.product.productVariants.length; i++) {
          const productVariant = this.product.productVariants[i];
          if (productVariant.available) {
            productVariant.variantImages[0]?.url
              ? (this.displayImage = productVariant.variantImages[0]?.url)
              : (this.displayImage = this.product.images?.[0]?.url);
            this.price = productVariant.price;
            this.available = true;
            break;
          }
        }
      }
    }
  }

  hoverImg(color: Attribute): void {
    if (this.product) {
      this.displayImage = color.images?.[0]?.url;
      this.queryParams.colorId = color.id;
      this.queryParams.attrGroupId = color.attributeGroupId;

      const available = this.product?.productVariants.find((productVariant) => {
        const productVariantAttributes =
          productVariant.productVariantAttributes;
        let found = false;
        for (let i = 0; i < productVariantAttributes.length; i++) {
          if (
            productVariantAttributes[i].attribute.id === color.id &&
            productVariant.available
          ) {
            if (this.product?.managedStock) {
              if (productVariant.quantity > 0) {
                found = true;
                break;
              } else {
                found = false;
                break;
              }
            } else {
              found = true;
              break;
            }
          }
        }
        return found;
      });
      if (available) {
        this.available = true;
        this.price = available.price;
      } else {
        this.available = false;
        // setPrice(available.price);
      }
      return;
    }
  }
}
