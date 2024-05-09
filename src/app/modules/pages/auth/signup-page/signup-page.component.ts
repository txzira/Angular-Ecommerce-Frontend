import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
})
export class SignupPageComponent implements OnInit, OnDestroy {
  credentials!: FormGroup;
  requestSubscription: Subscription | undefined;
  registrationResponse: { message: string; success: boolean } | undefined;
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  register(): void {
    const credentials = this.credentials.value;
    this.requestSubscription = this.authService
      .registerUser(credentials)
      .subscribe({
        next: (response) => {
          this.registrationResponse = response;
        },
        error: (response) => {
          this.registrationResponse = response.error;
        },
      });
  }
  back(): void {
    this.registrationResponse = undefined;
    this.requestSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }
}
