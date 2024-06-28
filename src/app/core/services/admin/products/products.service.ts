import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AttributeGroup,
  Image,
  Product,
  ProductVariant,
} from '../../../models/product.model';

import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminProductsService {
  private ADMIN_PRODUCTS_URL = !env.production
    ? 'http://localhost:4000/admin/products'
    : `${env.express_server_url}/admin/products`;

  // private ADMIN_PRODUCTS_URL = process.env['production']
  //   ? 'http://localhost:4000/admin/products'
  //   : `${process.env['express_server_url']}/admin/products`;

  constructor(private httpClient: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };

  // CRUD Operations

  // Create
  addProduct(productForm: any, productImages: any): Observable<Product> {
    return this.httpClient.post<Product>(
      this.ADMIN_PRODUCTS_URL + '/add-product',
      { productForm, productImages },
      this.httpOptions
    );
  }

  saveAndGenerateVariants(
    productId: string | null,
    attributeGroups: any,
    attributeGroupsToDelete: any,
    attributesToDelete: any
  ): Observable<any> {
    return this.httpClient.post<any>(
      `${this.ADMIN_PRODUCTS_URL}/save-and-generate-variants`,
      {
        productId,
        attributeGroups,
        attributeGroupsToDelete,
        attributesToDelete,
      },
      this.httpOptions
    );
  }

  // Read
  getAttrGroupByProdId(
    productId: string | null
  ): Observable<Array<AttributeGroup>> {
    return this.httpClient.get<Array<AttributeGroup>>(
      `${this.ADMIN_PRODUCTS_URL}/get-attr-groups-by-prod-id/${productId}`,
      this.httpOptions
    );
  }

  getProductImages(productId: string | null): Observable<Array<Image>> {
    return this.httpClient.get<Array<Image>>(
      `${this.ADMIN_PRODUCTS_URL}/get-product-images/${productId}`,
      this.httpOptions
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.ADMIN_PRODUCTS_URL}/get-all-products`
    );
  }

  getVariantsByProductId(
    productId: string | null
  ): Observable<Array<ProductVariant>> {
    return this.httpClient.get<Array<ProductVariant>>(
      `${this.ADMIN_PRODUCTS_URL}/get-variants-by-prod-id/${productId}`,
      this.httpOptions
    );
  }

  // Update
  editProduct(
    productId: string,
    product: Product,
    productImages: any
  ): Observable<Product> {
    return this.httpClient.put<Product>(
      `${this.ADMIN_PRODUCTS_URL}/edit-product/${productId}`,
      { product, productImages },
      this.httpOptions
    );
  }

  saveAttributeGroupChanges(
    productId: number,
    attributeGroups: any,
    attributeGroupsToDelete: any,
    attributesToDelete: any
  ): Observable<Array<any>> {
    return this.httpClient.post<Array<any>>(
      `${this.ADMIN_PRODUCTS_URL}/save-attr-groups-changes`,
      {
        productId,
        attributeGroups,
        attributeGroupsToDelete,
        attributesToDelete,
      },
      this.httpOptions
    );
  }

  editAttributes(attributeGroupId: any, attributes: any[]): Observable<any> {
    return this.httpClient.post<any>(
      `${this.ADMIN_PRODUCTS_URL}/edit-attributes`,
      { attributeGroupId, attributes },
      this.httpOptions
    );
  }

  // Delete
  deleteProduct(productId: string): Observable<Array<Product>> {
    return this.httpClient.delete<Array<Product>>(
      `${this.ADMIN_PRODUCTS_URL}/delete-product/${productId}`,
      this.httpOptions
    );
  }
}
