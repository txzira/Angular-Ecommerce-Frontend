import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingMethod } from 'src/app/core/models/shippingMethod.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminShippingMethodsService {
  private ADMIN_SHIPPING_METHODS_URL = !env.production
    ? 'http://localhost:4000/admin/shipping-methods'
    : `${env.express_server_url}/admin/shipping-methods`;

  constructor(private httpClient: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };
  // CRUD Operations

  // Create
  addShippingMethod(shippingMethod: any): Observable<ShippingMethod> {
    return this.httpClient.post<ShippingMethod>(
      `${this.ADMIN_SHIPPING_METHODS_URL}/add-shipping-method`,
      { shippingMethod }
    );
  }

  // Read
  getAllShippingMethods(): Observable<ShippingMethod[]> {
    return this.httpClient.get<ShippingMethod[]>(
      `${this.ADMIN_SHIPPING_METHODS_URL}/get-all-shipping-methods`
    );
  }

  // Update
  editShippingMethod(
    shippingMethod: ShippingMethod
  ): Observable<Array<ShippingMethod>> {
    return this.httpClient.put<Array<ShippingMethod>>(
      `${this.ADMIN_SHIPPING_METHODS_URL}/edit-shipping-method`,
      {
        shippingMethod,
      }
    );
  }

  // Delete
  deleteShippingMethod(
    shippingMethodId: string
  ): Observable<Array<ShippingMethod>> {
    return this.httpClient.delete<Array<ShippingMethod>>(
      `${this.ADMIN_SHIPPING_METHODS_URL}/delete-shipping-method/${shippingMethodId}`
    );
  }
}
