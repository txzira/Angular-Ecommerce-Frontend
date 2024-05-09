import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit, OnDestroy {
  credentials!: FormGroup;
  credentialValidationSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    const credentials = this.credentials.value;
    this.credentialValidationSubscription = this.authService
      .login(credentials.email, credentials.password)
      .subscribe({
        next: (result) => {
          this.userService.setUser(result.body.user);
          this.router.navigateByUrl('/');
        },
        error: (response) => {
          console.log(response.error.message);
          this.snackBar.open(`\u274c${response.error.message}`, undefined, {
            duration: 3000,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.credentialValidationSubscription?.unsubscribe();
  }
}
