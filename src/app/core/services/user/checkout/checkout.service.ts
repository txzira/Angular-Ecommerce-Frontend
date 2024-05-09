import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private BASE_BACKEND_URL = !env.production
    ? 'http://localhost:4000'
    : `${env.express_server_url}`;
  constructor(private http: HttpClient) {}

  getClientSecret(items: any): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_BACKEND_URL}/create-payment-intent`,
      {
        items,
      }
    );
  }

  createOrder(requestShippingForm: any, requestCart: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_BACKEND_URL}/create-order`, {
      requestShippingForm,
      requestCart,
    });
  }
}
