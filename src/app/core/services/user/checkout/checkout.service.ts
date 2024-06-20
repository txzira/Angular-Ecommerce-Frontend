import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingMethod } from 'src/app/core/models/shippingMethod.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private CHECKOUT_URL = !env.production
    ? 'http://localhost:4000/checkout'
    : `${env.express_server_url}/checkout`;

  // private BASE_BACKEND_URL = process.env['production']
  //   ? 'http://localhost:4000'
  //   : `${process.env['express_server_url']}`;

  constructor(private http: HttpClient) {}

  getClientSecret(items: any): Observable<any> {
    return this.http.post<any>(`${this.CHECKOUT_URL}/create-payment-intent`, {
      items,
    });
  }

  createOrder(
    requestShippingForm: any,
    requestCart: any,
    shippingMethod: ShippingMethod,
    calculatedTax: any,
    orderTotal: any
  ): Observable<any> {
    return this.http.post<any>(`${this.CHECKOUT_URL}/create-order`, {
      requestShippingForm,
      requestCart,
      shippingMethod,
      calculatedTax,
      orderTotal,
    });
  }

  calculateOrderTax(
    items: any,
    paymentIntent: any,
    shippingMethod: any,
    shippingAddress: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this.CHECKOUT_URL}/add-order-tax-and-shipping`,
      {
        items,
        paymentIntent,
        shippingMethod,
        shippingAddress,
      }
    );
  }
}
