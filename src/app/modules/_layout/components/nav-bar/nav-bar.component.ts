import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Cart } from 'src/app/core/models/cart.model';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
import { NavbarService } from 'src/app/core/services/navbar/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  @Input() cart!: Cart;
  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }

  constructor(
    private navBarService: NavbarService,
    public browserDetectorService: BrowserDetectorService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }
  showStaticLogo(): void {
    (document.getElementById('logo') as HTMLImageElement).src =
      '/assets/images/pseudo-corp.png';
  }
  showLogoAnimation(): void {
    (document.getElementById('logo') as HTMLImageElement).src =
      '/assets/images/pseudo-corp.gif';
  }
  onIsOpenUpdated() {
    this.navBarService.changeIsOpen();
  }
}
