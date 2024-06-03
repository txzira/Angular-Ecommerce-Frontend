import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
import { UserService } from 'src/app/core/services/user/user/user.service';

@Component({
  selector: 'app-nav-login-button',
  templateUrl: './nav-login-button.component.html',
})
export class NavLoginButtonComponent implements OnInit {
  user$ = this.userService.user.asObservable();
  // isAdmin$ = this.userService.isAdmin.asObservable();

  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    public browserDetectorService: BrowserDetectorService
  ) {}

  logout(): void {
    this.authService.logout().subscribe();
    this.userService.logoutUser();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }
}
