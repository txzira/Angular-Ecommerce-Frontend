import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CartItem } from 'src/app/core/models/cart.model';
import {
  Attribute,
  AttributeGroup,
  Image,
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
  attributeGroups: Array<AttributeGroup> = [];
  productQuantity = 1;
  displayImage: {
    url: string | undefined;
    index: number;
    imageCount: number | undefined;
  } = { url: '', index: 0, imageCount: 0 };
  displayImages: Array<Image> | undefined;
  unavailableVariants: Array<ProductVariant> = [];
  // prodVariantsGroupedByFirstAttributeGroupAttributes: Map<
  //   number,
  //   Array<ProductVariant>
  // > = new Map();

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const queryParams = this.route.snapshot.queryParams;
    console.log(queryParams);

    if (slug) {
      this.productsService.getProductBySlug(slug).subscribe((_product) => {
        this.product = _product;
        this.displayImage = {
          url: _product.images?.[0]?.url,
          index: 0,
          imageCount: _product.images?.length,
        };
        if (_product.images) this.displayImages = _product.images;

        this.setColorAsFirstAttributeGroup();

        if (queryParams['colorId'] && queryParams['attrGroupId']) {
          this.findFirstAvailProdVariant(
            Number(queryParams['attrGroupId']),
            Number(queryParams['colorId'])
          );
        } else {
          this.setDefaultSelectedOptions(_product);
        }
      });
    }
  }

  scrollImageLeft(): void {
    if (this.displayImage.index! > 0) {
      this.displayImage.index -= 1;
    } else {
      this.displayImage.index = this.displayImage.imageCount! - 1;
    }
    this.displayImage.url = this.displayImages?.[this.displayImage.index].url;
  }
  scrollImageRight(): void {
    if (this.displayImage.index! < this.displayImage.imageCount! - 1) {
      this.displayImage.index += 1;
    } else {
      this.displayImage.index = 0;
    }
    this.displayImage.url = this.displayImages?.[this.displayImage.index].url;
  }

  setDisplayImage(url: string, index: number): void {
    this.displayImage.url = url;
    this.displayImage.index = index;
  }

  onIncrementQuantity() {
    this.productQuantity += 1;
  }

  onDecrementQuantity() {
    if (this.productQuantity > 1) this.productQuantity -= 1;
  }

  checkIfSoldOut(): boolean {
    //If product has variants
    if (this.product.productVariants.length && this.selectedProductVariant) {
      if (this.checkProductVariantAvailability(this.selectedProductVariant))
        return false;
      else return true;

      //else standalone product
    } else {
      if (this.product.available) {
        if (this.product.managedStock) {
          if (this.product.quantity) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }

  onSelectOption(
    attributeGroupId: number,
    attributeId: number,
    attributeGroupIndex: number
  ): void {
    if (this.product) {
      if (attributeGroupIndex) {
        //size or other attribute type was clicked
        this.setSelectedOption(attributeGroupId, attributeId);
      } else {
        //color or style attribute was clicked
        //Ex. user clicked color:blue color-attributeGroupId:1 blue-attributeId:14
        //Find first availabale variant with combination (1,14)
        this.findFirstAvailProdVariant(attributeGroupId, attributeId);
      }
    }
  }

  disableOption(
    index: number,
    firstAttributeGroup: AttributeGroup,
    attribute: Attribute
  ): boolean {
    const optionMap = new Map();
    if (this.attributeGroups.length > 1) {
      optionMap.set(attribute.attributeGroupId, attribute.id);

      optionMap.set(
        firstAttributeGroup.id,
        this.selectedOptions.get(firstAttributeGroup.id!)
      );
    } else {
      optionMap.set(attribute.attributeGroupId, attribute.id);
    }

    if (!index && this.attributeGroups.length > 1) {
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
          return !this.checkProductVariantAvailability(result);
        } else return true;
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
            : this.product.images && this.product.images.length
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
      this.setSelectedOption(attributeGroupId, attributeId);
      this.unavailableVariants = [];
      const firstAvailableProdVariant = this.product.productVariants.find(
        (productVariant) => {
          if (this.checkProductVariantAvailability(productVariant)) {
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
                console.log('here');
                return true;
              }
            }
          } else {
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
                this.unavailableVariants.push(productVariant);
              }
            }
          }
          return false;
        }
      );
      if (firstAvailableProdVariant) {
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
      } else {
        for (
          let i = 0;
          i < this.product.productVariants[0].productVariantAttributes.length;
          i++
        ) {
          const variantAttribute =
            this.product.productVariants[0].productVariantAttributes[i];

          if (attributeGroupId !== variantAttribute.attibuteGroupId)
            this.setSelectedOption(variantAttribute.attibuteGroupId, 0);
        }
      }
    }
  }

  private setColorAsFirstAttributeGroup(): void {
    if (this.product) {
      const attributeGroups = this.product.attributeGroups.map(
        (attributeGroup) => {
          return { ...attributeGroup };
        }
      );
      for (let i = 0; i < attributeGroups.length; i++) {
        if (
          ['style', 'styles', 'color', 'colors'].includes(
            attributeGroups[i].name.toLowerCase()
          )
        ) {
          this.attributeGroups = [
            attributeGroups.splice(i, 1)[0],
            ...attributeGroups,
          ];
          return;
        }
      }
      this.attributeGroups = attributeGroups;
      return;
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
        if (this.checkProductVariantAvailability(productVariants[i])) {
          productVariants[i].productVariantAttributes.map(
            (productVariantAttribute) => {
              this.setSelectedOption(
                productVariantAttribute.attibuteGroupId,
                productVariantAttribute.attributeId
              );
            }
          );
          if (productVariants[i].variantImages.length) {
            this.displayImages = productVariants[i].variantImages;
          }
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
        if (selectedProductVariant.variantImages.length) {
          this.displayImage = {
            url: selectedProductVariant.variantImages[0].url,
            index: 0,
            imageCount: selectedProductVariant.variantImages.length,
          };
          this.displayImages = selectedProductVariant.variantImages;
        } else {
          if (this.product.images && this.product.images.length) {
            this.displayImage = {
              url: this.product.images?.[0]?.url,
              index: 0,
              imageCount: this.product.images?.length,
            };
            this.displayImages = this.product.images;
          } else {
            this.displayImage = {
              url: undefined,
              index: 0,
              imageCount: undefined,
            };
            this.displayImages = undefined;
          }
        }

        return selectedProductVariant;
      } else {
        if (this.attributeGroups.length > 1) {
          if (this.unavailableVariants.length) {
            this.displayImage = {
              url: this.unavailableVariants[0].variantImages?.[0]?.url,
              index: 0,
              imageCount: this.unavailableVariants[0].variantImages?.length,
            };
            this.displayImages = this.unavailableVariants[0].variantImages;
          } else {
            this.displayImage = {
              url: undefined,
              index: 0,
              imageCount: undefined,
            };
            this.displayImages = undefined;
          }
        } else {
          if (this.product.images && this.product.images.length) {
            this.displayImage = {
              url: this.product.images?.[0]?.url,
              index: 0,
              imageCount: this.product.images?.length,
            };
            this.displayImages = this.product.images;
          } else {
            this.displayImage = {
              url: undefined,
              index: 0,
              imageCount: undefined,
            };
            this.displayImages = undefined;
          }
        }
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
        this.checkProductVariantAvailability(productVariant)
      ) {
        result = true;
      } else {
        return false;
      }
    }
    return result;
  }

  private checkProductVariantAvailability(productVariant: ProductVariant) {
    if (productVariant.available) {
      if (this.product.managedStock) {
        if (productVariant.quantity > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
