import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetectorService {
  // private isMobileSource = new BehaviorSubject<boolean>(false);

  // isMobile = this.isMobileSource.asObservable();

  constructor() {}

  isMobile(): boolean {
    return window.navigator.maxTouchPoints > 0 || window.innerWidth < 768;
  }

  // changeBrowser(): void {
  //   this.isMobileSource.next(this.checkIsMobile());
  // }
}
