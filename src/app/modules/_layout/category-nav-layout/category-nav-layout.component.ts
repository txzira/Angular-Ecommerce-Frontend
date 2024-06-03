import { Component, HostListener, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/core/services/navbar/navbar.service';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';

@Component({
  selector: 'app-category-nav-layout',
  templateUrl: './category-nav-layout.component.html',
  styleUrls: ['./category-nav-layout.component.css'],
})
export class CategoryNavLayoutComponent implements OnInit {
  navBarIsOpen = false;
  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }
  constructor(
    public browserDetectorService: BrowserDetectorService,
    private navBarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.isMobileDisplay = this.browserDetectorService.isMobile();

    this.navBarService.isOpen.subscribe(
      (navBarIsOpen) => (this.navBarIsOpen = navBarIsOpen)
    );
  }
  onIsOpenUpdated() {
    this.navBarService.changeIsOpen();
  }
}
