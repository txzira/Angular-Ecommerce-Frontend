import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionUser } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user/user/user.service';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './login-redirect-page.component.html',
})
export class LoginRedirectPageComponent implements OnInit, OnDestroy {
  user: SessionUser | null = null;
  userSubscription: Subscription | undefined;
  checkUserLoggedInSubscription: Subscription | undefined;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // check if user logined with session storage?
    this.userSubscription = this.userService.getUser().subscribe((_user) => {
      this.user = _user;
    });
    // if user not logged inquery backend if user loggined and send name/email
    // else user logined do nothing
    if (!this.user) {
      this.checkUserLoggedInSubscription = this.authService
        .checkGoogleUserLoggedIn()
        .subscribe((result) => {
          this.userService.setUser(result.body.user);
          this.router.navigateByUrl('/');
        });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.checkUserLoggedInSubscription?.unsubscribe();
  }
}
