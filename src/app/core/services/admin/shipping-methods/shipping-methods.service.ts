import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShippingMethodsService {
  private ADMIN_PRODUCTS_URL = !env.production
    ? 'http://localhost:4000/admin/shipping-methods'
    : `${env.express_server_url}/admin/shipping-methods`;

  constructor(private httpClient: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };
}
