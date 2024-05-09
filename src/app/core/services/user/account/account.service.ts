import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccountInformation(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/account-information');
  }
  getAccountOrders(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/account-orders');
  }
  changeAccountPassword(oldPassword: any, newPassword: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:4000/change-password',
      {
        oldPassword,
        newPassword,
      },
      { observe: 'response' }
    );
  }
}
