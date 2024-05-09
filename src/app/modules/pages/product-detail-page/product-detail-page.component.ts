import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart.model';
import {
  Attribute,
  AttributeGroup,
  Product,
  ProductVariant,
} from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/user/cart/cart.service';
import { ProductsService } from 'src/app/core/services/user/products/products.service';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css'],
})
export class ProductDetailPageComponent implements OnInit {
  product!: Product;
  selectedOptions: Map<number, number> = new Map();
  selectedProductVariant: ProductVariant | undefined;
  displayImage: string | undefined;
  options: Array<AttributeGroup> = [];
  productQuantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.getProductById(id).subscribe((_product) => {
        this.product = _product;
        this.displayImage = _product.images?.[0]?.url;
        this.setColorAsFirstAttributeGroup();
        this.setDefaultSelectedOptions(_product);
      });
    }
  }

  setDisplayImage(url: string): void {
    this.displayImage = url;
  }

  onAddQuantity() {
    this.productQuantity += 1;
  }

  onRemoveQuantity() {
    if (this.productQuantity > 1) this.productQuantity -= 1;
  }

  onSelectOption(
    attributeGroupId: number,
    attributeId: number,
    attributeGroupIndex: number
  ): void {
    if (this.product) {
      if (attributeGroupIndex) {
        this.setSelectedOption(attributeGroupId, attributeId);
      } else {
        this.findFirstAvailProdVariant(attributeGroupId, attributeId);
      }
    }
  }

  disableOption(
    index: number,
    firstAttributeGroup: AttributeGroup,
    value: Attribute
  ): boolean {
    const optionMap = new Map();
    optionMap.set(value.attributeGroupId, value.id);
    optionMap.set(
      firstAttributeGroup.id,
      this.selectedOptions.get(firstAttributeGroup.id!)
    );

    if (!index) {
      return false;
    } else {
      if (this.product) {
        const result = this.product.productVariants.find((productVariant) => {
          return this.containsSelectedVariantAttributes(
            productVariant,
            optionMap
          );
        });
        if (result) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }

  onAddToCart(): void {
    let cartItem: CartItem;

    this.selectedProductVariant
      ? (cartItem = {
          id: `prod${this.product.id}var${this.selectedProductVariant.id}`,
          productId: this.product.id,
          productName: this.product.name,
          price: this.selectedProductVariant.price,
          quantity: this.productQuantity,
          ...(this.selectedProductVariant.variantImages.length
            ? { image: this.selectedProductVariant.variantImages[0].url }
            : this.product.images
            ? { image: this.product.images?.[0].url }
            : { image: '' }),
          variant: {
            id: this.selectedProductVariant.id,
            productVariantAttributes:
              this.selectedProductVariant.productVariantAttributes,
          },
        })
      : (cartItem = {
          id: `prod${this.product.id}`,
          productId: this.product.id,
          productName: this.product.name,
          price: this.product.price,
          quantity: this.productQuantity,
          ...(this.product.images && this.product.images.length
            ? { image: this.product.images?.[0].url }
            : { image: '' }),
          variant: undefined,
        });

    this.cartService.addToCart(cartItem);
  }

  private findFirstAvailProdVariant(
    attributeGroupId: number,
    attributeId: number
  ): void {
    if (this.product) {
      const firstAvailableProdVariant = this.product.productVariants.find(
        (productVariant) => {
          if (productVariant.available) {
            for (
              let i = 0;
              i < productVariant.productVariantAttributes.length;
              i++
            ) {
              const productVariantAttribute =
                productVariant.productVariantAttributes[i];

              if (
                productVariantAttribute.attibuteGroupId === attributeGroupId &&
                productVariantAttribute.attributeId === attributeId
              ) {
                return true;
              }
            }
          }
          return false;
        }
      );
      if (firstAvailableProdVariant) {
        this.setSelectedOption(attributeGroupId, attributeId);
        for (
          let i = 0;
          i < firstAvailableProdVariant.productVariantAttributes.length;
          i++
        ) {
          const variantAttribute =
            firstAvailableProdVariant.productVariantAttributes[i];
          if (attributeGroupId !== variantAttribute.attibuteGroupId)
            this.setSelectedOption(
              variantAttribute.attibuteGroupId,
              variantAttribute.attributeId
            );
        }
      }
    }
  }

  private setColorAsFirstAttributeGroup(): void {
    if (this.product) {
      const attributeGroups = this.product.attributeGroups;
      for (let i = 0; i < attributeGroups.length; i++) {
        if (attributeGroups[i].name.toLowerCase() === 'color') {
          this.options.push(attributeGroups.splice(i, 1)[0]);
          break;
        }
      }
      this.options = [...this.options, ...attributeGroups];
    }
  }

  private setSelectedOption(
    attributeGroupId: number,
    attributeId: number
  ): void {
    this.selectedOptions.set(attributeGroupId, attributeId);
    this.selectedProductVariant = this.findSelectedProductVariant();
  }

  private setDefaultSelectedOptions(product: Product): void {
    if (product.productVariants.length) {
      const productVariants = product.productVariants;
      for (let i = 0; i < productVariants.length; i++) {
        if (productVariants[i].available) {
          productVariants[i].productVariantAttributes.map(
            (productVariantAttribute) => {
              this.setSelectedOption(
                productVariantAttribute.attibuteGroupId,
                productVariantAttribute.attributeId
              );
            }
          );
          return;
        }
      }
    }
  }

  private findSelectedProductVariant(): ProductVariant | undefined {
    if (this.product) {
      const selectedProductVariant = this.product.productVariants.find(
        (productVariant) => {
          return this.containsSelectedVariantAttributes(
            productVariant,
            this.selectedOptions
          );
        }
      );
      if (selectedProductVariant) {
        selectedProductVariant.variantImages.length
          ? this.setDisplayImage(selectedProductVariant.variantImages[0].url)
          : null;
        return selectedProductVariant;
      }
    }
    return;
  }

  private containsSelectedVariantAttributes(
    productVariant: ProductVariant,
    selectedOptions: Map<number, number>
  ): boolean {
    let result = false;

    for (let i = 0; i < productVariant.productVariantAttributes.length; i++) {
      const productVariantAttribute =
        productVariant.productVariantAttributes[i];

      if (
        selectedOptions.get(productVariantAttribute.attibuteGroupId) ===
          productVariantAttribute.attributeId &&
        productVariant.available
      ) {
        result = true;
      } else {
        return false;
      }
    }
    return result;
  }
}
