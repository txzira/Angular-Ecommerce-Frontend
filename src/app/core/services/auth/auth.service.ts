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

  // private AUTH_URL = process.env['production']
  //   ? 'http://localhost:4000/auth'
  //   : `${process.env['express_server_url']}/auth`;

  constructor(private http: HttpClient) {}

  getUser(): Observable<SessionUser> {
    return this.http.get<any>(`${this.AUTH_URL}/user`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

      withCredentials: true,
    });
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
      `${this.AUTH_URL}/login`,
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
    return this.http.get(`${this.AUTH_URL}/isauth`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

      withCredentials: true,
    });
  }
  isAdmin(): Observable<any> {
    return this.http.get(`${this.AUTH_URL}/isadmin`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

      withCredentials: true,
    });
  }

  verifyEmail(userId: string, tokenId: string): Observable<any> {
    return this.http.put(`${this.AUTH_URL}/verify-email`, {
      tokenId,
      userId,
    });
  }

  sendForgotPasswordEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.AUTH_URL}/forgot-password`, {
      email,
    });
  }

  resendEmailVerificationLink(email: string): Observable<any> {
    return this.http.put<any>(`${this.AUTH_URL}/resend-email-verification`, {
      email,
    });
  }

  verifyPasswordReset(userId: string, tokenId: string): Observable<any> {
    return this.http.post<any>(`${this.AUTH_URL}/verify-password-reset `, {
      userId,
      tokenId,
    });
  }
  resetPassword(
    newPassword: any,
    userId: string,
    tokenId: string
  ): Observable<any> {
    return this.http.post<any>(`${this.AUTH_URL}/reset-password`, {
      newPassword,
      userId,
      tokenId,
    });
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.AUTH_URL}/logout`, {
      withCredentials: true,
    });
  }
}
