import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  state = '';

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
          this.state = response.error.state;
          this.snackBar.open(`\u274c${response.error.message}`, 'Ok', {
            duration: 3000,
          });
        },
      });
  }

  resendVerificationEmail(): void {
    const email = this.credentials.value.email;
    this.authService
      .resendEmailVerificationLink(email)
      .subscribe((response) => {
        if (response.status === 'success') {
          this.state = '';

          this.snackBar.open(`\u2705Email verification sent.`, 'Ok', {
            duration: 3000,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.credentialValidationSubscription?.unsubscribe();
  }
}
