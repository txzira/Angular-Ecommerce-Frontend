import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUser(): Observable<SessionUser> {
    return this.http.get<any>('http://localhost:4000/user');
  }

  registerUser(credentials: any): Observable<any> {
    return this.http.post<any>('http://localhost:4000/auth/register-user', {
      email: credentials.email,
      password: credentials.password,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
    });
  }

  login(email: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

      withCredentials: true,
      observe: 'response' as 'response',
    };
    return this.http.post<any>(
      'http://localhost:4000/auth/login',
      {
        username: email,
        password: password,
      },
      httpOptions
    );
  }

  checkGoogleUserLoggedIn(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response' as 'response',
    };
    return this.http.get<any>(
      'http://localhost:4000/auth/google/redirect',
      httpOptions
    );
  }

  isAuthenticated(): Observable<any> {
    return this.http.get('http://localhost:4000/auth/isauth');
  }
  isAdmin(): Observable<any> {
    return this.http.get('http://localhost:4000/auth/isadmin');
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get('http://localhost:4000/auth/verify', {
      observe: 'response',
      params: { token },
    });
  }

  logout(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/auth/logout', {
      withCredentials: true,
    });
  }
}
