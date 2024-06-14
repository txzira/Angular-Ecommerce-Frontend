import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingMethod } from 'src/app/core/models/shippingMethod.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShippingMethodsService {
  private SHIPPING_METHODS_URL = !env.production
    ? 'http://localhost:4000/shipping-methods'
    : `${env.express_server_url}/shipping-methods`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };
  constructor(private httpClient: HttpClient) {}

  getShippingMethods(country: string): Observable<ShippingMethod[]> {
    return this.httpClient.get<ShippingMethod[]>(
      `${this.SHIPPING_METHODS_URL}/get-shipping-methods-by-country/${country}`
    );
  }
}
