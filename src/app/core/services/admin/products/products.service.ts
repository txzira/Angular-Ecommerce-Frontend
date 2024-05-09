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
  constructor(private httpClient: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };
  private ADMIN_PRODUCTS_URL = !env.production
    ? 'http://localhost:4000/admin/products'
    : `${env.express_server_url}/admin/products`;
  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.ADMIN_PRODUCTS_URL}/get-all-products`
    );
  }

  addProduct(product: any, productImages: any): Observable<Product> {
    return this.httpClient.post<Product>(
      this.ADMIN_PRODUCTS_URL + '/add-product',
      { product, productImages },
      this.httpOptions
    );
  }

  editProduct(
    productId: string,
    product: any,
    productImages: any
  ): Observable<Product> {
    return this.httpClient.post<Product>(
      `${this.ADMIN_PRODUCTS_URL}/edit-product/${productId}`,
      { product, productImages },
      this.httpOptions
    );
  }
  deleteProduct(productId: string): Observable<Array<Product>> {
    return this.httpClient.delete<Array<Product>>(
      `${this.ADMIN_PRODUCTS_URL}/delete-product/${productId}`,
      this.httpOptions
    );
  }
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

  getVariantsByProductId(
    productId: string | null
  ): Observable<Array<ProductVariant>> {
    return this.httpClient.get<Array<ProductVariant>>(
      `${this.ADMIN_PRODUCTS_URL}/get-variants-by-prod-id/${productId}`,
      this.httpOptions
    );
  }

  saveAndGenerateVariants(productId: string | null): Observable<any> {
    return this.httpClient.post<any>(
      `${this.ADMIN_PRODUCTS_URL}/save-and-generate-variants`,
      { productId },
      this.httpOptions
    );
  }
}
