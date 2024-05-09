import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import env from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  getClientSecret(items: any): Observable<any> {
    return this.http.post<any>(
      `${env.express_server_url}/create-payment-intent`,
      {
        items,
      }
    );
  }

  createOrder(requestShippingForm: any, requestCart: any): Observable<any> {
    return this.http.post<any>(`${env.express_server_url}/create-order`, {
      requestShippingForm,
      requestCart,
    });
  }
}
