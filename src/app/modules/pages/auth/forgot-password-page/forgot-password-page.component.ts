import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styles: [],
})
export class ForgotPasswordPageComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  email = new FormControl('', [Validators.email]);
  emailSent = false;

  sendForgotPasswordEmail() {
    if (this.email.valid && this.email.value) {
      this.authService
        .sendForgotPasswordEmail(this.email.value)
        .subscribe((response) => {
          if (response.message === 'success') {
            this.emailSent = true;
            this.snackBar.open('\u2705Password reset email sent.', 'Ok', {
              duration: 3000,
            });
            this.email.reset();
          }
        });
    } else {
      this.snackBar.open('\u274cInvalid email address.', 'Ok', {
        duration: 3000,
      });
      this.email.reset();
    }
  }
}
