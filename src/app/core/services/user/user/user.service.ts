import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionUser } from '../../../models/user.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = new BehaviorSubject<SessionUser | null>(null);
  isAdmin = new BehaviorSubject<boolean | null>(null);
  // user$ = this.user.asObservable();
  // isAdmin$ = this.isAdmin.asObservable();

  constructor(private authService: AuthService) {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.user.next(JSON.parse(user));
    }
  }

  getUser(): Observable<SessionUser | null> {
    return this.user.asObservable();
  }

  setUser(user: SessionUser): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.authService.isAdmin().subscribe({
      next: (response) => {
        this.isAdmin.next(response);
      },
      error: (response) => {
        this.isAdmin.next(false);
      },
    });

    this.user.next(user);
  }

  logoutUser(): void {
    sessionStorage.removeItem('user');
    this.user.next(null);
    this.isAdmin.next(null);
  }
}
