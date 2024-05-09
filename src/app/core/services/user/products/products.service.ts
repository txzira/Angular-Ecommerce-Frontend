import { Injectable } from '@angular/core';
import { Product } from '../../../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // private PRODUCTS_URL = !env.production
  //   ? 'http://localhost:4000/products'
  //   : `${env.express_server_url}/products`;

  private PRODUCTS_URL = process.env['production']
    ? 'http://localhost:4000/products'
    : `${process.env['express_server_url']}/products`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };
  constructor(private httpClient: HttpClient) {}

  getAllActiveProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.PRODUCTS_URL}/get-all-active-products`
    );
  }

  getProductById(id: string | null): Observable<Product> {
    return this.httpClient.get<Product>(`${this.PRODUCTS_URL}/${id}`);
  }

  getProductsByCategoryName(
    categoryName: string | null
  ): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(
      `${this.PRODUCTS_URL}/get-products-by-category/${categoryName}`
    );
  }
}
