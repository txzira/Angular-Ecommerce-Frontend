import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionUser } from '../../models/user.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private AUTH_URL = !env.production
    ? 'http://localhost:4000/auth'
    : `${env.express_server_url}/auth`;

  constructor(private http: HttpClient) {}

  getUser(): Observable<SessionUser> {
    return this.http.get<any>(`${this.AUTH_URL}/user`);
  }

  registerUser(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.AUTH_URL}/register-user`, {
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
    return this.http.get<any>(`${this.AUTH_URL}/google/redirect`, httpOptions);
  }

  isAuthenticated(): Observable<any> {
    return this.http.get(`${this.AUTH_URL}/isauth`);
  }
  isAdmin(): Observable<any> {
    return this.http.get(`${this.AUTH_URL}/isadmin`);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.AUTH_URL}/verify`, {
      observe: 'response',
      params: { token },
    });
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.AUTH_URL}/logout`, {
      withCredentials: true,
    });
  }
}
