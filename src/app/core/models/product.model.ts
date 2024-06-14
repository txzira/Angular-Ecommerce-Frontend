import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  price: number;
  brand: { id: number; name: string } | undefined;
  description: string | undefined;
  sku: string | undefined;
  quantity: number;
  slug: string;
  active: boolean;
  available: boolean;
  managedStock: boolean;
  categories: Category[];
  images:
    | (Image & {
        productId: number;
      })[]
    | null;
  productVariants: Array<ProductVariant>;
  attributeGroups: Array<AttributeGroup>;
}

export interface ProductVariant {
  id: number;
  productId: number;
  price: number;
  quantity: number;
  available: boolean;
  productVariantAttributes: Array<ProductVariantAttribute>;
  variantImages: Array<Image>;
  sku?: string;
  description?: string;
}

export interface ProductVariantAttribute {
  id: number;
  productVariantId: number;
  attibuteGroupId: number;
  attributeId: number;
  attribute: Attribute;
  attributeGroup: AttributeGroup;
}

export interface Image {
  id?: number;
  url: string;
  publicId: string;
  position: number;
}

export interface AttributeGroup {
  id?: number;
  name: string;
  productId?: number;
  attributes?: Attribute[];
}

export interface Attribute {
  id?: number;
  name: string;
  attributeGroupId?: number;
  images?: (Image & {
    attributeId: number;
  })[];
}
