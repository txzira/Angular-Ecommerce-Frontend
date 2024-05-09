import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user/user.service';

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
})
export class UnauthorizedPageComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((result) => {
      if (result) {
        this.isLoggedIn = true;
      }
    });
  }
  logout(): void {
    this.userService.logoutUser();
    this.authService.logout().subscribe();
    this.router.navigate(['/']);
  }
}
