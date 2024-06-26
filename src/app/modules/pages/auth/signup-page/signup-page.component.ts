import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
})
export class SignupPageComponent implements OnInit {
  credentials!: FormGroup;
  requestSubscription: Subscription | undefined;
  registrationResponse: { message: string; success: boolean } | undefined;
  state = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.credentials = this.fb.group(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          this.createPasswordStrengthValidator(),
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()[\]])/
          ),
        ]),
        retypedPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.createPasswordsEquivalentValidator() }
    );
  }

  register(): void {
    const credentials = this.credentials.value;
    if (credentials.password === credentials.retypedPassword) {
      this.requestSubscription = this.authService
        .registerUser(credentials)
        .subscribe({
          next: (response) => {
            this.registrationResponse = response;
            this.state = 'success';
          },
          error: (response) => {
            this.registrationResponse = response.error;
            if (response.error.state === 'unverified') {
              this.state = 'unverified';
              this.snackBar.open(
                `\u274cAccount already exist with this email.`,
                'Ok',
                {
                  duration: 3000,
                }
              );
            } else if (response.error.state === 'verified') {
              this.state = 'verified';
              this.snackBar.open(
                `\u274cAccount already exist with this email.`,
                'Ok',
                {
                  duration: 3000,
                }
              );
              this.registrationResponse = undefined;
            } else {
              this.state = 'failed';
              this.snackBar.open(`\u274c${response.error.message}`, 'Ok', {
                duration: 3000,
              });
            }
          },
        });
    } else {
      this.snackBar.open(`\u274cPassword mismatch`, 'Ok', {
        duration: 3000,
      });
    }
  }

  resendVerificationEmail() {
    const email = this.credentials.value.email;
    this.authService
      .resendEmailVerificationLink(email)
      .subscribe((response) => {
        if (response.status === 'success') {
          this.state = '';

          this.snackBar.open(`\u2705Email verification sent.`, undefined, {
            duration: 3000,
          });
        }
      });
  }

  back(): void {
    this.registrationResponse = undefined;
  }

  private createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSymbol = /[[!@#$%^&*()\]]+/.test(value);

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSymbol;

      return !passwordValid
        ? {
            passwordStrength: {
              hasUpperCase,
              hasLowerCase,
              hasNumeric,
              hasSymbol,
            },
          }
        : null;
    };
  }
  private createPasswordsEquivalentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const retypedPassword = control.get('retypedPassword');
      const retypedPasswordErrors = control.get('retypedPassword')?.errors;

      // if no password inputs remove error from retyped password control
      if (!password || !retypedPassword) {
        retypedPassword?.hasError('passwordsNotEquivalent')
          ? delete retypedPassword?.errors?.['passwordsNotEquivalent']
          : null;

        return null;
      }
      if (password !== retypedPassword?.value) {
        // if passwords not equal add error to retyped password control
        retypedPassword.setErrors({
          ...retypedPasswordErrors,
          passwordsNotEquivalent: true,
        });
      } else {
        // else remove error if it exists
        retypedPassword?.hasError('passwordsNotEquivalent')
          ? delete retypedPassword?.errors?.['passwordsNotEquivalent']
          : null;
      }
      // clear errors if object empty
      JSON.stringify(retypedPasswordErrors) === '{}'
        ? retypedPassword?.setErrors(null)
        : null;

      return null;
    };
  }
}
