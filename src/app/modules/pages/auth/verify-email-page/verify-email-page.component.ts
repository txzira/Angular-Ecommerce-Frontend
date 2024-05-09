import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  styles: [],
})
export class VerifyEmailPageComponent implements OnInit, OnDestroy {
  params = new HttpParams();

  requestSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.requestSubscription = this.authService
      .verifyEmail(this.route.snapshot.queryParams['token'])
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }
}
