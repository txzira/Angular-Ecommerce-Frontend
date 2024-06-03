import { Component, HostListener, OnInit } from '@angular/core';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';

@Component({
  selector: 'app-commerce-layout',
  templateUrl: './commerce-layout.component.html',
  styleUrls: ['./commerce-layout.component.css'],
})
export class CommerceLayoutComponent implements OnInit {
  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }
  constructor(public browserDetectorService: BrowserDetectorService) {}

  ngOnInit(): void {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }
}
