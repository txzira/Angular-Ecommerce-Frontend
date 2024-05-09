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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/core/services/user/account/account.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user/user.service';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';

@Component({
  selector: 'app-my-account-page',
  templateUrl: './my-account-page.component.html',
  styleUrls: ['./my-account-page.component.css'],
})
export class MyAccountPageComponent implements OnInit {
  accountInformation: any = null;
  accountOrders: any = null;
  ordersToShow: any[] = [];
  changePasswordForm!: FormGroup;
  itemsPerPage = new FormControl<number>(3);

  totalOrders!: number;
  itemCursor = 0;
  nextItemCursor!: number;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAccountInformation();
    this.getAccountOrders();
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: new FormControl('', [Validators.required]),
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
  getAccountInformation(): void {
    this.accountService
      .getAccountInformation()
      .subscribe((_accountInformation) => {
        this.accountInformation = _accountInformation.account;
      });
  }
  getAccountOrders(): void {
    this.accountService.getAccountOrders().subscribe((_accountOrders) => {
      this.accountOrders = _accountOrders.orders;
      this.totalOrders = this.accountOrders.length;

      if (this.accountOrders.length > this.itemsPerPage.value!) {
        this.nextItemCursor = this.itemsPerPage.value!;
      } else {
        if (this.accountOrders.length === 0) {
          this.itemCursor = 0;
          this.nextItemCursor = 0;
          return;
        } else {
          this.nextItemCursor = this.accountOrders.length;
        }
      }
      this.ordersToShow = this.accountOrders.slice(
        this.itemCursor,
        this.nextItemCursor
      );
    });
  }

  nextOrderPage(): void {
    if (this.accountOrders.length > this.nextItemCursor) {
      this.itemCursor += this.itemsPerPage.value!;

      if (
        this.nextItemCursor + this.itemsPerPage.value! >
        this.accountOrders.length
      ) {
        this.nextItemCursor =
          this.nextItemCursor +
          (this.accountOrders.length - this.nextItemCursor);
      } else {
        this.nextItemCursor += this.itemsPerPage.value!;
      }
      this.ordersToShow = this.accountOrders.slice(
        this.itemCursor,
        this.nextItemCursor
      );
    }
  }
  prevOrderPage(): void {
    if (this.itemCursor - this.itemsPerPage.value! >= 0) {
      this.itemCursor -= this.itemsPerPage.value!;
      if (this.nextItemCursor === this.totalOrders) {
        this.nextItemCursor = this.itemCursor + this.itemsPerPage.value!;
      } else {
        this.nextItemCursor -= this.itemsPerPage.value!;
      }
      this.ordersToShow = this.accountOrders.slice(
        this.itemCursor,
        this.nextItemCursor
      );
      // this.nextItemCursor = this.itemsPerPage.value!;
    }
  }

  changeItemsPerPage(): void {
    this.itemCursor = 0;
    if (this.accountOrders.length > this.itemsPerPage.value!) {
      this.nextItemCursor = this.itemsPerPage.value!;
    } else {
      if (this.accountOrders.length === 0) {
        this.itemCursor = 0;
        this.nextItemCursor = 0;
        return;
      } else {
        this.nextItemCursor = this.accountOrders.length;
      }
    }

    this.ordersToShow = this.accountOrders.slice(
      this.itemCursor,
      this.nextItemCursor
    );
  }

  changePassword(): void {
    const passwords = this.changePasswordForm.value;
    const oldPassword = passwords.oldPassword;
    const newPassword = passwords.newPassword;
    const retypedNewPassword = passwords.retypedNewPassword;

    if (newPassword === retypedNewPassword) {
      // send request to change password route
      // if password change success send notification of change
      // else old password not valid or password didnt pass server-side password input validation
      this.accountService
        .changeAccountPassword(oldPassword, newPassword)
        .subscribe({
          next: (response) => {
            if (response.status === 'Success') {
              this.snackBar.open('\u2705Password change successful! ', 'Ok', {
                duration: 3000,
              });
              this.changePasswordForm.reset();
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

  openDialog(order: any): void {
    this.dialog.open(OrderDetailModalComponent, {
      data: { order: order },
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
    this.userService.logoutUser();
    this.router.navigate(['/']);
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
