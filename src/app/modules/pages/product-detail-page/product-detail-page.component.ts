import { Component, HostListener, OnInit } from '@angular/core';
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
  attributeGroups: Array<AttributeGroup> = [];
  productQuantity = 1;
  displayImage: {
    url: string | undefined;
    index: number;
    imageCount: number | undefined;
  } = { url: '', index: 0, imageCount: 0 };

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

    if (slug) {
      this.productsService.getProductBySlug(slug).subscribe((_product) => {
        this.product = _product;
        this.displayImage = {
          url: _product.images?.[0]?.url,
          index: 0,
          imageCount: _product.images?.length,
        };

        this.setColorAsFirstAttributeGroup();
        // if (this.attributeGroups && this.attributeGroups.length) {
        //   this.groupProdVariantsByFirstAttributeGroupAttributes(
        //     this.attributeGroups[0],
        //     _product.productVariants
        //   );
        // }

        this.setDefaultSelectedOptions(_product);
      });
    }
  }

  scrollImageLeft(): void {
    if (this.displayImage.index! > 0) {
      this.displayImage.index -= 1;
    } else {
      this.displayImage.index = this.displayImage.imageCount! - 1;
    }
    if (!this.selectedProductVariant) {
      this.displayImage.url =
        this.product.images?.[this.displayImage.index].url;
    } else {
      this.displayImage.url =
        this.selectedProductVariant.variantImages[this.displayImage.index].url;
    }
  }
  scrollImageRight(): void {
    if (this.displayImage.index! < this.displayImage.imageCount! - 1) {
      this.displayImage.index += 1;
    } else {
      this.displayImage.index = 0;
    }
    if (!this.selectedProductVariant) {
      this.displayImage.url =
        this.product.images?.[this.displayImage.index].url;
    } else {
      this.displayImage.url =
        this.selectedProductVariant.variantImages[this.displayImage.index].url;
    }
  }

  setDisplayImage(url: string, index: number): void {
    this.displayImage.url = url;
    this.displayImage.index = index;
  }

  onAddQuantity() {
    this.productQuantity += 1;
  }

  onRemoveQuantity() {
    if (this.productQuantity > 1) this.productQuantity -= 1;
  }

  checkIfSoldOut(): boolean {
    //If product has variants
    if (this.product.productVariants.length && this.selectedProductVariant) {
      if (this.selectedProductVariant.available) {
        if (this.product.managedStock) {
          if (this.selectedProductVariant.quantity) {
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
        //Ex. use clicked color:blue color-attributeGroupId:1 blue-attributeId:14
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
    // this.prodVariantsGroupedByFirstAttributeGroupAttributes.get(
    //   this.selectedOptions.get(firstAttributeGroup.id!)!
    // )?.find(productVariant=>{
    //   let flag=false;
    //   for(let i =0;i<productVariant.productVariantAttributes.length;i++){
    //     productVariant.productVariantAttributes

    //   }
    // })

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
        if (result && result.available && result.quantity > 0) {
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

      const firstAvailableProdVariant = this.product.productVariants.find(
        (productVariant) => {
          if (productVariant.available && productVariant.quantity > 0) {
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
      if (firstAvailableProdVariant && firstAvailableProdVariant.quantity) {
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
      const attributeGroups = this.product.attributeGroups;
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
        if (productVariants[i].available && productVariants[i].quantity) {
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
        if (selectedProductVariant.variantImages.length) {
          this.displayImage = {
            url: selectedProductVariant.variantImages[0].url,
            index: 0,
            imageCount: selectedProductVariant.variantImages.length,
          };
        }

        return selectedProductVariant;
      } else {
        if (this.attributeGroups.length > 1) {
          this.displayImage = {
            url: undefined,
            index: 0,
            imageCount: undefined,
          };
        } else {
          if (this.product.images && this.product.images.length) {
            this.displayImage = {
              url: this.product.images?.[0]?.url,
              index: 0,
              imageCount: this.product.images?.length,
            };
          } else {
            this.displayImage = {
              url: undefined,
              index: 0,
              imageCount: undefined,
            };
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
        productVariant.available &&
        productVariant.quantity > 0
      ) {
        result = true;
      } else {
        return false;
      }
    }
    return result;
  }

  // private groupProdVariantsByFirstAttributeGroupAttributes(
  //   firstAttributeGroup: AttributeGroup,
  //   _productVariants: Array<ProductVariant>
  // ): void {
  //   const productVariants: Array<ProductVariant> = JSON.parse(
  //     JSON.stringify(_productVariants)
  //   );
  //   if (
  //     firstAttributeGroup.attributes &&
  //     firstAttributeGroup.attributes.length
  //   ) {
  //     for (let i = 0; i < firstAttributeGroup.attributes.length; i++) {
  //       //first attributeId in attributeGroup array
  //       let tempProductVariants: Array<ProductVariant> = [];
  //       for (let j = 0; j < productVariants.length; j++) {
  //         for (
  //           let k = 0;
  //           k < productVariants[j].productVariantAttributes.length;
  //           k++
  //         ) {
  //           if (
  //             productVariants[j].productVariantAttributes[k].attributeId ===
  //             firstAttributeGroup.attributes[i].id
  //           ) {
  //             tempProductVariants.push(productVariants[j]);
  //           }
  //         }
  //       }
  //       this.prodVariantsGroupedByFirstAttributeGroupAttributes.set(
  //         firstAttributeGroup.attributes[i].id!,
  //         tempProductVariants
  //       );
  //     }
  //   }
  // }
}
