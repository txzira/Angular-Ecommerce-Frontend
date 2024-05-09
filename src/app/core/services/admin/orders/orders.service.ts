import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/core/models/order.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  // private ADMIN_ORDERS_URL = !env.production
  //   ? 'http://localhost:4000/admin/orders'
  //   : `${env.express_server_url}/admin/orders`;
  private ADMIN_ORDERS_URL = process.env['production']
    ? 'http://localhost:4000/admin/orders'
    : `${process.env['express_server_url']}/admin/orders`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private httpClient: HttpClient) {}

  getAllOrders(): Observable<Array<Order>> {
    return this.httpClient.get<Array<Order>>(
      `${this.ADMIN_ORDERS_URL}/get-all-orders`
    );
  }
  getOrdersByCustomerId(): Observable<Array<Order>> {
    return this.httpClient.get<Array<Order>>(
      `${this.ADMIN_ORDERS_URL}/get-orders-by-customer-id`
    );
  }
}
