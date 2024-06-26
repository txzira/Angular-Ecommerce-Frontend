import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  styles: [],
})
export class VerifyEmailPageComponent {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    const { userId, tokenId } = this.route.snapshot.queryParams;
    console.log({ userId, tokenId });
    this.authService.verifyEmail(userId, tokenId).subscribe({
      next: (response) => {
        this.snackBar.open(`\u2705Email verification successful.`, 'Ok', {
          duration: 3000,
        });
        this.router.navigate(['/auth/login']);
        // console.log(response);
      },
      error: (err) => {
        this.snackBar.open(`\u274cEmail verification failed.`, 'Ok', {
          duration: 3000,
        });
        this.router.navigate(['/auth/login']);
        // console.log(err);
      },
    });
  }
}
