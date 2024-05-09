import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { customer } from 'src/app/core/models/customer.model';

import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminCustomersService {
  // private ADMIN_CUSTOMERS_URL = !env.production
  //   ? 'http://localhost:4000/admin/customers'
  //   : `${env.express_server_url}/admin/customers`;
  private ADMIN_CUSTOMERS_URL = process.env['production']
    ? 'http://localhost:4000/admin/customers'
    : `${process.env['express_server_url']}/admin/customers`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  constructor(private httpClient: HttpClient) {}

  getAllCustomers(): Observable<Array<customer>> {
    return this.httpClient.get<Array<customer>>(
      `${this.ADMIN_CUSTOMERS_URL}/get-all-customers`
    );
  }
}
