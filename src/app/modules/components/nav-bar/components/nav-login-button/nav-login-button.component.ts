import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user/user.service';

@Component({
  selector: 'app-nav-login-button',
  templateUrl: './nav-login-button.component.html',
})
export class NavLoginButtonComponent implements OnInit, OnDestroy {
  user$ = this.userService.user.asObservable();
  // isAdmin$ = this.userService.isAdmin.asObservable();
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  logout(): void {
    this.authService.logout().subscribe();
    this.userService.logoutUser();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
