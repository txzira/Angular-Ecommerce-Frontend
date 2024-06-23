import { Component } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent {
  validLink: boolean | undefined;
  changePasswordForm!: FormGroup;
  userId: string | null = null;
  tokenId: string | null = null;
  passwordChanged = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.tokenId = this.route.snapshot.queryParamMap.get('tokenId');
    if (this.userId && this.tokenId) {
      this.authService
        .verifyPasswordReset(this.userId, this.tokenId)
        .subscribe({
          next: (response) => {
            this.validLink = response.validLink;
          },
          error: (response) => {
            this.validLink = response.error.validLink;
          },
        });
    } else {
      console.log('invalid credentials');
      this.validLink = false;
    }

    this.changePasswordForm = this.formBuilder.group(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          this.createPasswordStrengthValidator(),
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()[\]])/
          ),
        ]),
        retypedNewPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.createPasswordsEquivalentValidator() }
    );
  }

  changePassword(): void {
    const passwords = this.changePasswordForm.value;
    const newPassword = passwords.newPassword;
    const retypedNewPassword = passwords.retypedNewPassword;

    if (newPassword === retypedNewPassword) {
      // send request to reset password route
      // if password change success send notification of change
      if (this.userId && this.tokenId) {
        this.authService
          .resetPassword(newPassword, this.userId, this.tokenId)
          .subscribe({
            next: (response) => {
              if (response.status) {
                this.snackBar.open('\u2705Password change successful! ', 'Ok', {
                  duration: 3000,
                });
                this.changePasswordForm.reset();
                this.passwordChanged = true;
              }
            },
            error: (error) => {
              this.snackBar.open(
                `\u274c${error.error.message}. Password change unsuccessful!`,
                'Ok',
                {
                  duration: 3000,
                }
              );
              this.changePasswordForm.reset();
            },
          });
      } else {
        console.log('invalid credentials');
        this.validLink = false;
      }
    } else {
      // send password mismatch error
      this.snackBar.open(
        '\u274cPassword mismatch. Password change unsuccessful!',
        'Ok',
        {
          duration: 3000,
        }
      );
      this.changePasswordForm.reset();
    }
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
      const newPassword = control.get('newPassword')?.value;
      const retypedNewPassword = control.get('retypedNewPassword');
      const retypedNewPasswordErrors =
        control.get('retypedNewPassword')?.errors;

      // if no password inputs remove error from retyped password control
      if (!newPassword || !retypedNewPassword) {
        retypedNewPassword?.hasError('passwordsNotEquivalent')
          ? delete retypedNewPassword?.errors?.['passwordsNotEquivalent']
          : null;

        return null;
      }
      if (newPassword !== retypedNewPassword?.value) {
        // if passwords not equal add error to retyped password control
        retypedNewPassword.setErrors({
          ...retypedNewPasswordErrors,
          passwordsNotEquivalent: true,
        });
      } else {
        // else remove error if it exists
        retypedNewPassword?.hasError('passwordsNotEquivalent')
          ? delete retypedNewPassword?.errors?.['passwordsNotEquivalent']
          : null;
      }
      // clear errors if object empty
      JSON.stringify(retypedNewPasswordErrors) === '{}'
        ? retypedNewPassword?.setErrors(null)
        : null;

      return null;
    };
  }
}
