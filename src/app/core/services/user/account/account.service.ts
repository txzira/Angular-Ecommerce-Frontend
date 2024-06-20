import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private BACKEND_URL = !env.production
    ? 'http://localhost:4000'
    : `${env.express_server_url}`;

  // private BACKEND_URL = process.env['production']
  //   ? 'http://localhost:4000'
  //   : `${process.env['express_server_url']}/auth`;

  constructor(private http: HttpClient) {}

  getAccountInformation(): Observable<any> {
    return this.http.get<any>(`${this.BACKEND_URL}/account-information`);
  }
  getInitialAccountOrders(limit: number): Observable<any> {
    return this.http.get<any>(`${this.BACKEND_URL}/account-initial-orders`, {
      params: {
        limit,
      },
    });
  }
  getAccountOrders(limit: number, page: number): Observable<any> {
    return this.http.get<any>(`${this.BACKEND_URL}/account-orders`, {
      params: {
        limit,
        page,
      },
    });
  }
  changeAccountPassword(oldPassword: any, newPassword: any): Observable<any> {
    return this.http.post<any>(
      `${this.BACKEND_URL}/change-password`,
      {
        oldPassword,
        newPassword,
      },
      { observe: 'response' }
    );
  }
}
