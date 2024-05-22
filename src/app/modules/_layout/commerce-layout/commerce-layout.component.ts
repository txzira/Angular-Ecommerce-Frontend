import { Component } from '@angular/core';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';

@Component({
  selector: 'app-commerce-layout',
  templateUrl: './commerce-layout.component.html',
  styleUrls: ['./commerce-layout.component.css'],
})
export class CommerceLayoutComponent {
  constructor(public broswerDetectorService: BrowserDetectorService) {}
}
